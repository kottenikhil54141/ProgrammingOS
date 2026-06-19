import { Suspense } from "react";
import PythonEngineClient from "./PythonEngineClient";

export default function PythonEnginePage() {
  return (
    <Suspense fallback={null}>
      <PythonEngineClient />
    </Suspense>
  );
}
