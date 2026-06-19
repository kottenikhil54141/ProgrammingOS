/* ─── WebAssembly Pyodide Runner & Trace Engine ──────────────────────── */

declare global {
  interface Window {
    loadPyodide?: any;
    pyodideInstance?: any;
  }
}

const PYODIDE_JS_URL = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";

// Load Pyodide CDN script dynamically
export function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.loadPyodide) return resolve();

    // Check if script is already injected
    const existingScript = document.querySelector(`script[src="${PYODIDE_JS_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.src = PYODIDE_JS_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

// Get or initialize the Pyodide instance
async function getPyodideInstance(onStdout?: (msg: string) => void) {
  if (typeof window === "undefined") return null;
  await loadPyodideScript();

  if (!window.pyodideInstance) {
    window.pyodideInstance = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
    });
  }

  // Redirect stdout/stderr
  window.pyodideInstance.setStdout({
    batched: (text: string) => {
      if (onStdout) onStdout(text + "\n");
    },
  });

  return window.pyodideInstance;
}

export interface TraceFrame {
  line: number;
  locals: Record<string, { value: string; type: string; id: number }>;
}

export const PyodideRunner = {
  async warmup(): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      await getPyodideInstance();
    } catch (e) {
      console.warn("Pyodide warmup failed:", e);
    }
  },

  async runCode(
    code: string,
    onStdout?: (msg: string) => void
  ): Promise<{ output: string; error?: string }> {
    let consoleOutput = "";
    const logAccumulator = (msg: string) => {
      consoleOutput += msg;
      if (onStdout) onStdout(msg);
    };

    try {
      const pyodide = await getPyodideInstance(logAccumulator);
      if (!pyodide) {
        return { output: "", error: "Environment not supported." };
      }

      // Setup custom input hook and sys.path
      const setupCode = `
import sys
import builtins
import js

if "/workspace" not in sys.path:
    sys.path.append("/workspace")

def custom_input(prompt_msg=""):
    val = js.prompt(prompt_msg)
    if val is None:
        val = ""
    print(f"{prompt_msg}{val}")
    return val

builtins.input = custom_input
`;
      await pyodide.runPythonAsync(setupCode);

      // Execute code
      await pyodide.runPythonAsync(code);
      return { output: consoleOutput };
    } catch (err: any) {
      const errMsg = err.message || String(err);
      return { output: consoleOutput, error: errMsg };
    }
  },

  async runCodeWithFiles(
    files: Record<string, string>,
    mainFile: string,
    onStdout?: (msg: string) => void
  ): Promise<{ output: string; files: Record<string, string>; error?: string }> {
    let consoleOutput = "";
    const logAccumulator = (msg: string) => {
      consoleOutput += msg;
      if (onStdout) onStdout(msg);
    };

    try {
      const pyodide = await getPyodideInstance(logAccumulator);
      if (!pyodide) {
        return { output: "", files, error: "Environment not supported." };
      }

      // Ensure /workspace exists
      try {
        pyodide.FS.mkdir('/workspace');
      } catch (e) {}

      // Write all workspace files into Pyodide's FS
      for (const [filename, content] of Object.entries(files)) {
        pyodide.FS.writeFile('/workspace/' + filename, content);
      }

      // Change directory to /workspace
      pyodide.FS.chdir('/workspace');

      // Setup custom input hook and sys.path
      const setupCode = `
import sys
import builtins
import js

if "/workspace" not in sys.path:
    sys.path.append("/workspace")

def custom_input(prompt_msg=""):
    val = js.prompt(prompt_msg)
    if val is None:
        val = ""
    print(f"{prompt_msg}{val}")
    return val

builtins.input = custom_input
`;
      await pyodide.runPythonAsync(setupCode);

      // Execute the active script file
      const activeScript = files[mainFile] || "";
      await pyodide.runPythonAsync(activeScript);

      // Read back all files from /workspace to synchronize changes
      const updatedFiles: Record<string, string> = {};
      const fileNames = pyodide.FS.readdir('/workspace') as string[];
      
      for (const name of fileNames) {
        if (name === "." || name === "..") continue;
        const filePath = '/workspace/' + name;
        try {
          const stat = pyodide.FS.stat(filePath);
          if (pyodide.FS.isFile(stat.mode)) {
            const content = pyodide.FS.readFile(filePath, { encoding: "utf8" }) as string;
            updatedFiles[name] = content;
          }
        } catch (fileErr) {
          // File might have been deleted or read error
        }
      }

      return { output: consoleOutput, files: updatedFiles };
    } catch (err: any) {
      const errMsg = err.message || String(err);
      
      // Still sync files even on runtime failure (e.g. file was written before crashing)
      const pyodide = window.pyodideInstance;
      const updatedFiles: Record<string, string> = { ...files };
      if (pyodide) {
        try {
          const fileNames = pyodide.FS.readdir('/workspace') as string[];
          for (const name of fileNames) {
            if (name === "." || name === "..") continue;
            const filePath = '/workspace/' + name;
            try {
              const stat = pyodide.FS.stat(filePath);
              if (pyodide.FS.isFile(stat.mode)) {
                updatedFiles[name] = pyodide.FS.readFile(filePath, { encoding: "utf8" }) as string;
              }
            } catch (e) {}
          }
        } catch (e) {}
      }

      return { output: consoleOutput, files: updatedFiles, error: errMsg };
    }
  },

  async traceCode(code: string): Promise<{ frames: TraceFrame[]; error?: string }> {
    try {
      const pyodide = await getPyodideInstance();
      if (!pyodide) {
        return { frames: [], error: "Environment not supported." };
      }

      // Escaping quotes and backslashes in user code
      const escapedCode = code.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

      // Tracing runner wrapper in Python using sys.settrace
      const tracerCode = `
import sys
import json

execution_frames = []

def trace_calls(frame, event, arg):
    # Only trace user code scope, avoid tracing internals/sys imports
    if frame.f_code.co_filename == "<string>" or frame.f_code.co_filename == "user_code":
        if event == 'line':
            local_vars = {}
            for k, v in frame.f_locals.items():
                if not k.startswith('__') and not hasattr(v, '__call__'):
                    try:
                        val_str = str(v)
                        # Truncate extremely long structures
                        if len(val_str) > 100:
                            val_str = val_str[:100] + "..."
                        local_vars[k] = {
                            "value": val_str,
                            "type": type(v).__name__,
                            "id": id(v)
                        }
                    except Exception:
                        pass
            execution_frames.append({
                "line": frame.f_lineno,
                "locals": local_vars
            })
    return trace_calls

sys.settrace(trace_calls)
try:
    # Compile and execute the user code under the custom name
    compiled_code = compile("""${escapedCode}""", "user_code", "exec")
    exec(compiled_code, {})
finally:
    sys.settrace(None)

import json
json.dumps(execution_frames)
`;

      const jsonResult = await pyodide.runPythonAsync(tracerCode);
      const frames = JSON.parse(jsonResult) as TraceFrame[];
      return { frames };
    } catch (err: any) {
      return { frames: [], error: err.message || String(err) };
    }
  },
};
