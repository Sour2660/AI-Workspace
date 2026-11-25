import type { ReactNode } from "react";

interface AuthFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

const AuthField = ({ id, label, error, children }: AuthFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
        {error}
      </p>
    )}
  </div>
);

export default AuthField;
