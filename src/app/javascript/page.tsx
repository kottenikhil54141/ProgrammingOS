import { Suspense } from "react";
import JavaScriptEngineClient from "./JavaScriptEngineClient";

export const unstable_instant = {
  prefetch: "static",
  unstable_disableValidation: true,
};

export default function JavaScriptEnginePage() {
  return (
    <Suspense fallback={null}>
      <JavaScriptEngineClient />
    </Suspense>
  );
}
