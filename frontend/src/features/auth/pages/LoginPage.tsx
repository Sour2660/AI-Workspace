import { Link } from "react-router-dom";
import LoginForm from "@/features/auth/components/LoginForm";
import SocialLoginButtons from "@/features/auth/components/SocialLoginButtons";

const LoginPage = () => (
  <div>
    <div className="mb-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Welcome back
      </p>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Sign in to your workspace
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Pick up where your team left off.
      </p>
    </div>

    <LoginForm />

    <div className="my-6">
      <SocialLoginButtons />
    </div>

    <p className="text-center text-sm text-muted-foreground">
      New to AI Workspace?{" "}
      <Link
        to="/register"
        className="font-semibold text-primary underline-offset-4 hover:underline"
      >
        Create an account
      </Link>
    </p>
  </div>
);

export default LoginPage;
