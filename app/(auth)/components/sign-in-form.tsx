"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Link from "next/link";

import { toast } from "@/components/ui/use-toast";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  useEffect(() => {
    if (searchParams.has("reset")) {
      toast({ description: atob(searchParams.get("reset")!) });
    }
  }, [searchParams]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {},
  });

  function onSubmit(values: LoginFormValues) {
    login({
      email: values.email,
      password: values.password,
      setError: form.setError,
    });
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your email below to signin into your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline" asChild>
            <Link
              href={{
                host: new URL(process.env.NEXT_PUBLIC_BACKEND_URL!).host,
                pathname: "/auth/github/redirect",
              }}
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              Github
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href={{
                hostname: new URL(process.env.NEXT_PUBLIC_BACKEND_URL!).host,
                pathname: "/auth/google/redirect",
              }}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Link>
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
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
                  <FormControl>
                    <Input
                      placeholder="Password"
                      {...field}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant="link" asChild>
          <Link
            href="/forgot-password"
            className="underline text-sm text-gray-600 hover:text-gray-900"
          >
            Forgot your password?
          </Link>
        </Button>
        <Button
          type="submit"
          form="create-account-form"
          className="ml-4"
          aria-disabled={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
        >
          Sign In
        </Button>
      </CardFooter>
    </Card>
  );
}
