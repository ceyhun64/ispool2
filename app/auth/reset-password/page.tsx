import { Suspense } from "react";
import ResetPasswordPage from "@/components/modules/auth/reset-password";

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
