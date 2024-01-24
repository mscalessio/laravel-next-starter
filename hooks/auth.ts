import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { UseFormSetError } from "react-hook-form";
import { LoginFormValues } from "@/app/(auth)/login/page";
import { RegisterFormValues } from "@/app/(auth)/components/sign-up-form";

interface UseAuth {
  middleware?: "auth" | "guest";
  redirectIfAuthenticated?: string;
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: UseAuth) => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", () =>
    axios
      .get("/api/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;

        router.push("/verify-email");
      })
  );

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const register = async ({
    setError,
    ...props
  }: {
    setError: UseFormSetError<RegisterFormValues>;
    [x: string]: any;
  }) => {
    await csrf();

    axios
      .post("/register", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        Object.keys(error.response.data.errors).forEach(
          (key: any) => {
            setError(key, {message: error.response.data.errors[key][0]});
          }
        );
      });
  };

  const login = async ({
    setError,
    ...props
  }: {
    setError: UseFormSetError<LoginFormValues>;
    [x: string]: any;
  }) => {
    await csrf();

    axios
      .post("/login", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        Object.keys(error.response.data.errors).forEach(
          (key: any) => {
            setError(key, {message: error.response.data.errors[key][0]});
          }
        );
      });
  };

  const forgotPassword = async ({ email }: { email: string }) => {
    await csrf();

    axios
      .post("/forgot-password", { email })
      .then((response) =>
        toast({ title: "Success!", description: response.data.message })
      )
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        toast({
          variant: "destructive",
          title: "Oops!",
          description: error.response.data.errors.email.join(" "),
        });
      });
  };

  const resetPassword = async ({ ...props }: { [x: string]: any }) => {
    await csrf();

    axios
      .post("/reset-password", { token: params.token, ...props })
      .then((response) =>
        router.push("/login?reset=" + btoa(response.data.status))
      )
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        toast({
          title: "Oops!",
          description: JSON.stringify(error.response.data.errors),
        });
      });
  };

  const resendEmailVerification = ({ setStatus }: { setStatus: any }) => {
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status));
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);
    if (
      window.location.pathname === "/verify-email" &&
      redirectIfAuthenticated &&
      user?.email_verified_at
    )
      router.push(redirectIfAuthenticated);
    if (middleware === "auth" && error) logout();
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
