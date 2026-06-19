/* ─── JavaScript Browser Sandbox & Event Loop Visualizer ──────────────── */

export interface EventLoopFrame {
  step: number;
  description: string;
  callStack: string[];
  webAPIs: string[];
  microtasks: string[];
  macrotasks: string[];
  logs: string[];
}

export const JSVisualizer = {
  // Execute code in a safe evaluation wrapper, capturing console outputs
  runCode(code: string, files: Record<string, string> = {}): { output: string; error?: string } {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("code-executed"));
    }
    let capturedLogs: string[] = [];
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalPrompt = typeof window !== "undefined" ? window.prompt : undefined;

    // Temporary override console
    console.log = (...args) => {
      capturedLogs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "));
    };
    console.warn = console.log;
    console.error = (...args) => {
      capturedLogs.push("[Error] " + args.join(" "));
    };

    // Temporary override prompt
    if (typeof window !== "undefined") {
      window.prompt = (message) => {
        const res = originalPrompt ? originalPrompt(message) : "";
        capturedLogs.push(`${message || ""}${res || ""}`);
        return res;
      };
    }

    // CommonJS style require resolution
    const modules: Record<string, { exports: any }> = {};
    const customRequire = (path: string): any => {
      let fileName = path.replace(/^\.\//, "");
      if (!fileName.endsWith(".js") && !fileName.endsWith(".ts")) {
        fileName += ".js";
      }
      if (modules[fileName]) {
        return modules[fileName].exports;
      }
      if (!files[fileName]) {
        throw new Error(`Cannot find module '${path}'`);
      }
      const module = { exports: {} };
      modules[fileName] = module;
      const wrapper = new Function("exports", "require", "module", files[fileName]);
      wrapper(module.exports, customRequire, module);
      return module.exports;
    };

    try {
      // Execute module wrapper
      const module = { exports: {} };
      const wrapper = new Function("require", "exports", "module", code);
      const result = wrapper(customRequire, module.exports, module);

      // Restore overrides
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      if (typeof window !== "undefined" && originalPrompt) {
        window.prompt = originalPrompt;
      }

      let logString = capturedLogs.join("\n");
      if (result !== undefined) {
        logString += (logString ? "\n" : "") + `[Return value: ${JSON.stringify(result)}]`;
      }
      return { output: logString };
    } catch (err: any) {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      if (typeof window !== "undefined" && originalPrompt) {
        window.prompt = originalPrompt;
      }
      return { output: capturedLogs.join("\n"), error: err.message || String(err) };
    }
  },

  // Compile code into Event Loop visual steps
  generateEventLoopTrace(code: string): EventLoopFrame[] {
    const frames: EventLoopFrame[] = [];
    const logs: string[] = [];

    // Setup base frame
    const baseFrame = () => ({
      callStack: [] as string[],
      webAPIs: [] as string[],
      microtasks: [] as string[],
      macrotasks: [] as string[],
      logs: [...logs]
    });

    // Detect lines of interest in code
    const lines = code.split("\n").map(l => l.trim());

    // Phase 1: Initialization
    let f = baseFrame();
    f.callStack.push("global()");
    frames.push({
      step: 1,
      description: "Start script execution. Global execution context created and pushed to the Call Stack.",
      ...f
    });

    // We compile simulated steps based on statements detected in order.
    // E.g. console.log, setTimeout, Promises
    let stepCount = 2;
    let hasPromise = false;
    let hasTimeout = false;

    lines.forEach((line) => {
      if (line.includes("console.log")) {
        // Extract string or number
        const match = line.match(/console\.log\((['"`]?)(.*?)\1\)/);
        const logContent = match ? match[2] : "Log message";

        let frame1 = baseFrame();
        frame1.callStack.push("global()");
        frame1.callStack.push(`console.log('${logContent}')`);
        if (hasPromise) frame1.microtasks.push("PromiseCallback()");
        if (hasTimeout) frame1.webAPIs.push("setTimeout timer");

        frames.push({
          step: stepCount++,
          description: `Push console.log('${logContent}') to the Call Stack.`,
          ...frame1
        });

        // Add to logs
        logs.push(logContent);

        let frame2 = baseFrame();
        frame2.callStack.push("global()");
        if (hasPromise) frame2.microtasks.push("PromiseCallback()");
        if (hasTimeout) frame2.webAPIs.push("setTimeout timer");

        frames.push({
          step: stepCount++,
          description: `Execute console.log. Output '${logContent}' printed to terminal console. Pop console.log.`,
          ...frame2
        });
      }

      if (line.includes("setTimeout")) {
        hasTimeout = true;
        let frame1 = baseFrame();
        frame1.callStack.push("global()");
        frame1.callStack.push("setTimeout()");
        if (hasPromise) frame1.microtasks.push("PromiseCallback()");

        frames.push({
          step: stepCount++,
          description: "Push setTimeout() to the Call Stack. Register timer with browser Web API background thread.",
          ...frame1
        });

        let frame2 = baseFrame();
        frame2.callStack.push("global()");
        frame2.webAPIs.push("setTimeout timer");
        if (hasPromise) frame2.microtasks.push("PromiseCallback()");

        frames.push({
          step: stepCount++,
          description: "Web API background timer starts counting down. Pop setTimeout() from the Call Stack.",
          ...frame2
        });
      }

      if (line.includes("Promise.resolve") || line.includes(".then")) {
        hasPromise = true;
        let frame1 = baseFrame();
        frame1.callStack.push("global()");
        frame1.callStack.push("Promise.then()");
        if (hasTimeout) frame1.webAPIs.push("setTimeout timer");

        frames.push({
          step: stepCount++,
          description: "Push Promise resolver to Call Stack. Resolve promise immediately.",
          ...frame1
        });

        let frame2 = baseFrame();
        frame2.callStack.push("global()");
        frame2.microtasks.push("PromiseCallback()");
        if (hasTimeout) frame2.webAPIs.push("setTimeout timer");

        frames.push({
          step: stepCount++,
          description: "Promise resolved. Queue Promise callback wrapper into the Microtask Queue. Pop Promise from Call Stack.",
          ...frame2
        });
      }
    });

    // End of synchronous execution
    let endSyncFrame = baseFrame();
    if (hasPromise) endSyncFrame.microtasks.push("PromiseCallback()");
    if (hasTimeout) endSyncFrame.webAPIs.push("setTimeout timer");

    frames.push({
      step: stepCount++,
      description: "Synchronous script execution finishes. Call Stack is empty. Global context popped.",
      ...endSyncFrame
    });

    // Microtasks Phase
    if (hasPromise) {
      let frame1 = baseFrame();
      frame1.callStack.push("PromiseCallback()");
      if (hasTimeout) frame1.webAPIs.push("setTimeout timer");

      frames.push({
        step: stepCount++,
        description: "Event Loop checks Microtask Queue. High-priority PromiseCallback popped from queue and pushed to Call Stack.",
        ...frame1
      });

      // Add promise log
      logs.push("3: Microtask (Promise)");

      let frame2 = baseFrame();
      if (hasTimeout) frame2.webAPIs.push("setTimeout timer");

      frames.push({
        step: stepCount++,
        description: "Execute Promise callback. Print output. Pop callback. Microtask Queue is now empty.",
        ...frame2
      });
    }

    // Timer expires
    if (hasTimeout) {
      let frame1 = baseFrame();
      frame1.macrotasks.push("TimeoutCallback()");
      frames.push({
        step: stepCount++,
        description: "Web API background timer expires. Browser pushes TimeoutCallback to Macrotask Queue.",
        ...frame1
      });

      let frame2 = baseFrame();
      frame2.callStack.push("TimeoutCallback()");
      frames.push({
        step: stepCount++,
        description: "Event Loop checks Call Stack & Microtasks (both empty). Pops TimeoutCallback from Macrotask Queue and pushes to Call Stack.",
        ...frame2
      });

      // Add timeout log
      logs.push("2: Macrotask (setTimeout)");

      let frame3 = baseFrame();
      frames.push({
        step: stepCount++,
        description: "Execute setTimeout callback function. Print output to console. Pop TimeoutCallback. Script execution complete.",
        ...frame3
      });
    }

    return frames;
  }
};
