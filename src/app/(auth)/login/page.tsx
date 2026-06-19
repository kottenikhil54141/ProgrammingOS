import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const unstable_instant = {
  prefetch: "static",
  unstable_disableValidation: true,
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
