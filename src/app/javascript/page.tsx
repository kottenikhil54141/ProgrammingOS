import { Suspense } from "react";
import JavaScriptEngineClient from "./JavaScriptEngineClient";

export default function JavaScriptEnginePage() {
  return (
    <Suspense fallback={null}>
      <JavaScriptEngineClient />
    </Suspense>
  );
}
