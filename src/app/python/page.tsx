import { Suspense } from "react";
import PythonEngineClient from "./PythonEngineClient";

export const unstable_instant = {
  prefetch: "static",
  unstable_disableValidation: true,
};

export default function PythonEnginePage() {
  return (
    <Suspense fallback={null}>
      <PythonEngineClient />
    </Suspense>
  );
}
