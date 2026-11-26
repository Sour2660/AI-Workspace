import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthField from "@/features/auth/components/AuthField";
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/auth.schemas";

const ForgotPasswordPage = () => {
  const [notice, setNotice] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = () => {
    console.info("[auth-ui] password recovery form submitted");
    setNotice(
      "Password recovery is not connected yet. No email has been sent."
    );
  };

  return (
    <div>
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Account recovery
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Forgot your password?
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Enter your work email and we’ll help you get back into your account.
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <AuthField
          id="recovery-email"
          label="Work email"
          error={errors.email?.message}
        >
          <Input
            id="recovery-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "recovery-email-error" : undefined}
            className="h-11 bg-background"
            {...register("email")}
          />
        </AuthField>

        {notice && (
          <p
            className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground"
            role="status"
          >
            {notice}
          </p>
        )}

        <Button type="submit" className="h-11 w-full">
          Send recovery link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
