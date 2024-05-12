"use client";

import EmailSignIn from "@/server/actions/email-signin";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormDescription,
  FormMessage,
} from "../ui/form";
import AuthCard from "./auth-card";
import LoginSchema from "@/types/login-schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";

const LoginForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, status } = useAction(EmailSignIn, {
    onSuccess(data) {
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });

  const onSubmitForm = (value: z.infer<typeof LoginSchema>) => {
    // console.log(value);
    execute(value);
  };
  return (
    <div>
      <AuthCard
        showSocials
        cardTitle={"Welcome Back!"}
        backButtonHref={"/auth/register"}
        backButtonlabel={"Create a New Accout"}
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)}>
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="abc@email.com"
                          type="email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormDescription />
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
                        <Input {...field} placeholder="*****" type="password" />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormSuccess message={success} />
                <FormError message={error} />
                <Button asChild variant={"link"} size={"sm"}>
                  <Link href={"/auth/reset"}>Forget Password?</Link>
                </Button>
                <Button
                  className={cn(
                    "w-full my-2",
                    status === "executing" ? "animate-pulse" : ""
                  )}
                  type="submit"
                >
                  {"Login"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </AuthCard>
    </div>
  );
};

export default LoginForm;
