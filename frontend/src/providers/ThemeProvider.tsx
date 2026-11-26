import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

const ThemeProvider = ({ children }: PropsWithChildren) => (
  <NextThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    storageKey="ai-workspace-theme"
  >
    {children}
  </NextThemeProvider>
);

export default ThemeProvider;