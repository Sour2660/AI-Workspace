import { useState } from "react";
import { Button } from "@/components/ui/button";

const SocialLoginButtons = () => {
  const [notice, setNotice] = useState("");

  const onUnavailableProvider = (provider: string) => {
    console.info("[auth-ui] social login placeholder selected", { provider });
    setNotice(`${provider} sign-in is not connected yet.`);
  };

  return (
    <div className="space-y-3">
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <p className="relative mx-auto w-fit bg-background px-3 text-xs text-muted-foreground">
          OR CONTINUE WITH
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={() => onUnavailableProvider("Google")}
        >
          <span
            aria-hidden="true"
            className="grid size-5 place-items-center rounded-full border text-[11px] font-semibold"
          >
            G
          </span>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={() => onUnavailableProvider("GitHub")}
        >
          <span
            aria-hidden="true"
            className="grid size-5 place-items-center rounded-full border text-[9px] font-semibold"
          >
            GH
          </span>
          GitHub
        </Button>
      </div>
      {notice && (
        <p className="text-center text-xs text-muted-foreground" role="status">
          {notice}
        </p>
      )}
    </div>
  );
};

export default SocialLoginButtons;
