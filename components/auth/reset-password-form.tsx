"use client";

import { cn } from "@/lib/utils";
import NewPassword from "@/server/actions/new-password";
import NewPasswordSchema from "@/types/new-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import AuthCard from "./auth-card";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import ResetPasswordSchema from "@/types/reset-password-schema";
import PasswordReset from "@/server/actions/password-reset";

const ResetPasswordForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, status } = useAction(PasswordReset, {
    onSuccess(data) {
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });

  const onSubmitForm = (value: z.infer<typeof ResetPasswordSchema>) => {
    // console.log(value);
    execute(value);
  };
  return (
    <div>
      <AuthCard
        showSocials
        cardTitle={"Forget your Password"}
        backButtonHref={"/auth/login"}
        backButtonlabel={"Back to Login"}
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
                          placeholder="abc@gmail.com"
                          type="email"
                          disabled={status === "executing"}
                          autoComplete="email"
                        />
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
                  Reset-Password
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </AuthCard>
    </div>
  );
};

export default ResetPasswordForm;
