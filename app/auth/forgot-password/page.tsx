import { Suspense } from "react";
import ForgotPassword from "@/components/modules/auth/forgot-password";

export default function Forgotassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPassword />
    </Suspense>
  );
}
