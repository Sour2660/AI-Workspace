import { Link } from "react-router-dom";
import RegisterForm from "@/features/auth/components/RegisterForm";
import SocialLoginButtons from "@/features/auth/components/SocialLoginButtons";

const RegisterPage = () => (
  <div>
    <div className="mb-7">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Get started
      </p>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Create your account
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Set up your space and bring your team together.
      </p>
    </div>

    <RegisterForm />

    <div className="my-6">
      <SocialLoginButtons />
    </div>

    <p className="text-center text-sm text-muted-foreground">
      Already have an account?{" "}
      <Link
        to="/login"
        className="font-semibold text-primary underline-offset-4 hover:underline"
      >
        Sign in
      </Link>
    </p>
  </div>
);

export default RegisterPage;
