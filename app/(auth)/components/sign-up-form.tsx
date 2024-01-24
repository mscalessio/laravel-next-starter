"use client";

import { useAuth } from "@/hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Link from "next/link";

import { Icons } from "@/components/icons";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const registerFormSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string(),
  password_confirmation: z.string(),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function SignUpForm() {
  const { register } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {},
  });

  function onSubmit(values: RegisterFormValues) {
    register({
      name: values.name,
      email: values.email,
      password: values.password,
      password_confirmation: values.password_confirmation,
      setError: form.setError,
    });
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
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
          <form
            id="create-account-form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoFocus required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} required />
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
                    <Input
                      {...field}
                      type="password"
                      required
                      autoComplete="new-password"
                    />
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
          </form>
        </Form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant="link" asChild>
          <Link
            href="/login"
            className="underline text-sm text-gray-600 hover:text-gray-900"
          >
            Already registered?
          </Link>
        </Button>
        <Button
          type="submit"
          form="create-account-form"
          className="ml-4"
          aria-disabled={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
        >
          Register
        </Button>
      </CardFooter>
    </Card>
  );
}
