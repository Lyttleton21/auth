"use client";

import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import settings from "@/server/actions/settings";
import SettingsSchema from "@/types/settings-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  session: Session;
}

const SettingsCard = ({ session }: Props) => {
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // console.log(session);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      email: session.user?.email || undefined,
      image: session.user.image || undefined,
      name: session.user?.name || undefined,
      isTwoFactorEnabled: session.user.isTwoFactorEnabled || undefined,
    },
  });

  const { execute, status } = useAction(settings, {
    onSuccess(data) {
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });

  const onSubmitForm = (value: z.infer<typeof SettingsSchema>) => {
    console.log(value);
    execute(value);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update Your Account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={status === "executing"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        className="rounded-full"
                        src={form.getValues("image")!}
                        alt={"user image"}
                        width={42}
                        height={42}
                      />
                    )}
                  </div>
                  <FormControl>
                    <Input
                      type="hidden"
                      placeholder="John Doe"
                      {...field}
                      disabled={status === "executing"}
                    />
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
                    <Input
                      placeholder="abc@gmail.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                      disabled={status === "executing" || session.user.isOAuth}
                    />
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
                      placeholder="*****"
                      type="password"
                      {...field}
                      disabled={status === "executing" || session.user.isOAuth}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*****"
                      type="password"
                      {...field}
                      disabled={status === "executing" || session.user.isOAuth}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Fatcor Authentication</FormLabel>
                  <FormDescription>
                    Enable Two Factor Authentication for your Account
                  </FormDescription>
                  <FormControl>
                    <Switch
                      disabled={status === "executing" || session.user.isOAuth}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              disabled={status === "executing" || avatarUploading}
              type="submit"
            >
              Update your Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
