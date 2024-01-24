"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { useState } from "react";

const Page = () => {
  const { logout, resendEmailVerification } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/dashboard",
  });

  const [status, setStatus] = useState(null);

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Thanks for signing up!
        </h1>
        <p className="text-sm text-muted-foreground">
          Before getting started, could you verify verify your email address by
          clicking on the link we just emailed to you? If you didn&apos;t
          receive the email, we will gladly gladly send you another.
        </p>
      </div>

      {status === "verification-link-sent" && (
        <div className="mb-4 font-medium text-sm text-green-600">
          A new verification link has been sent to the email address address you
          provided during registration.
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <Button onClick={() => resendEmailVerification({ setStatus })}>
          Resend Verification Email
        </Button>

        <Button type="button" variant="link" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Page;
