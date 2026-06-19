import { Suspense } from "react";
import SignupClient from "./SignupClient";

export const unstable_instant = {
  prefetch: "static",
  unstable_disableValidation: true,
};

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupClient />
    </Suspense>
  );
}
