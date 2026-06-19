import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export const unstable_instant = {
  prefetch: "static",
  unstable_disableValidation: true,
};

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardClient />
    </Suspense>
  );
}
