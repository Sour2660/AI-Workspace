import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthField from "@/features/auth/components/AuthField";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/auth.schemas";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = () => {
    console.info("[auth-ui] password reset form submitted");
    setNotice(
      "Password reset is not connected yet. Your password has not changed."
    );
  };

  return (
    <div>
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Secure your account
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Set a new password
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Choose a new password with at least 8 characters.
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <AuthField
          id="reset-password"
          label="New password"
          error={errors.password?.message}
        >
          <div className="relative">
            <Input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "reset-password-error" : undefined}
              className="h-11 bg-background pr-11"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </AuthField>

        <AuthField
          id="reset-confirm-password"
          label="Confirm new password"
          error={errors.confirmPassword?.message}
        >
          <div className="relative">
            <Input
              id="reset-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? "reset-confirm-password-error"
                  : undefined
              }
              className="h-11 bg-background pr-11"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={
                showConfirmPassword
                  ? "Hide password confirmation"
                  : "Show password confirmation"
              }
              aria-pressed={showConfirmPassword}
              onClick={() =>
                setShowConfirmPassword((visible) => !visible)
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
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
          Update password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
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

export default ResetPasswordPage;
