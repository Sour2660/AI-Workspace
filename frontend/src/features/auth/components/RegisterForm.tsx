import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import {
  getAuthErrorMessage,
  logAuthFailure,
} from "@/features/auth/auth.utils";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/features/auth/auth.schemas";
import AuthField from "@/features/auth/components/AuthField";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { register: createAccount } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    console.info("[auth-ui] registration submitted");
    setFormError("");

    try {
      await createAccount({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      console.info("[auth-ui] registration succeeded");
      navigate("/", { replace: true });
    } catch (error) {
      logAuthFailure("registration", error);
      setFormError(
        getAuthErrorMessage(error, "Unable to create your account. Try again.")
      );
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <AuthField
        id="register-name"
        label="Full name"
        error={errors.name?.message}
      >
        <Input
          id="register-name"
          autoComplete="name"
          placeholder="Alex Morgan"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "register-name-error" : undefined}
          className="h-11 bg-background"
          {...register("name")}
        />
      </AuthField>

      <AuthField
        id="register-email"
        label="Work email"
        error={errors.email?.message}
      >
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          className="h-11 bg-background"
          {...register("email")}
        />
      </AuthField>

      <AuthField
        id="register-password"
        label="Password"
        error={errors.password?.message}
      >
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "register-password-error" : undefined
            }
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
        id="register-confirm-password"
        label="Confirm password"
        error={errors.confirmPassword?.message}
      >
        <div className="relative">
          <Input
            id="register-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword
                ? "register-confirm-password-error"
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
            onClick={() => setShowConfirmPassword((visible) => !visible)}
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </AuthField>

      {formError && (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
          role="alert"
        >
          {formError}
        </p>
      )}

      <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
        {isSubmitting && (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        )}
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
