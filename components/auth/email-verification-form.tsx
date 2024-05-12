"use client";

import { newVerification } from "@/server/actions/token";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AuthCard from "./auth-card";
import FormSuccess from "./form-success";
import FormError from "./form-error";

const EmailVerificationForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = useSearchParams().get("token");
  const router = useRouter();

  const handleVerification = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Token not Found");
      return;
    }
    newVerification(token).then((data) => {
      if (data?.error) {
        setError(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
        router.push("/auth/login");
      }
    });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <div>
      <AuthCard
        cardTitle={"Verify Your Account..."}
        backButtonHref={"/auth/login"}
        backButtonlabel={"back to login"}
      >
        <div className="flex items-center flex-col justify-center w-full">
          <p>{!success && !error ? "Verifing Email..." : null}</p>
          <FormSuccess message={success} />
          <FormError message={error} />
        </div>
      </AuthCard>
    </div>
  );
};

export default EmailVerificationForm;
