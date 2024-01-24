"use client";

import { useAuth } from "@/hooks/auth";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// import AuthSessionStatus from "@/app/(auth)/auth-session-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
});

const PasswordReset = () => {
  const searchParams = useSearchParams();

  const { resetPassword } = useAuth({ middleware: "guest" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    resetPassword({
      email: values.email,
      password: values.password,
      password_confirmation: values.password_confirmation,
    });
  };

  // useEffect(() => {
  //   if (searchParams.has("email")) {
  //     form.setValue("email", searchParams.get("email")!);
  //   }
  // }, [searchParams, form]);

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Login to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to continue.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end mt-4">
            <Button type="submit">Reset Password</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PasswordReset;
