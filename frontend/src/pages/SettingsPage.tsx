import { useState, type FormEvent } from "react";
import {
  Bell,
  Bot,
  Globe2,
  LockKeyhole,
  Save,
  Settings2,
  ShieldCheck,
  Users,
  WandSparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SettingsSection =
  | "general"
  | "account"
  | "workspace"
  | "notifications"
  | "ai"
  | "security";

const sections: Array<{
  id: SettingsSection;
  label: string;
  icon: typeof Settings2;
}> = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "account", label: "Account", icon: Users },
  { id: "workspace", label: "Workspace", icon: Globe2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai", label: "AI preferences", icon: Bot },
  { id: "security", label: "Security", icon: ShieldCheck },
];

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [section, setSection] = useState<SettingsSection>("general");
  const [notice, setNotice] = useState("");
  const [workspaceName, setWorkspaceName] = useState("AI Workspace");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invites, setInvites] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settings, setSettings] = useState({
    taskAssignments: true,
    mentions: true,
    projectUpdates: false,
    weeklyDigest: true,
    aiSuggestions: true,
    useProjectContext: false,
    twoFactor: false,
  });

  const updateSetting = (key: keyof typeof settings, enabled: boolean) => {
    setSettings((current) => ({ ...current, [key]: enabled }));
  };

  const saveSettings = () => {
    setNotice("Preferences saved in this local preview.");
    console.info("[settings-ui] preferences saved in local preview", {
      section,
    });
  };

  const inviteMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = inviteEmail.trim();
    if (!email) return;
    setInvites((current) => [...current, email]);
    setInviteEmail("");
    setNotice("Invite added to this local preview; no email was sent.");
  };

  const changePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) {
      setNotice("Choose a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setNotice("The passwords don’t match.");
      return;
    }
    setPassword("");
    setConfirmPassword("");
    setNotice("Password change is not connected to the backend yet.");
  };

  const renderToggle = (
    title: string,
    description: string,
    key: keyof typeof settings
  ) => (
    <label
      key={key}
      className="flex cursor-pointer items-start justify-between gap-5 border-b py-4 last:border-0"
    >
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={settings[key]}
        onChange={(event) => updateSetting(key, event.target.checked)}
        className="mt-1 size-4 shrink-0 accent-primary"
      />
    </label>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-7 p-5 sm:p-8">
      <header>
        <p className="mb-2 text-sm font-medium text-primary">
          Make your workspace yours
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your account, workspace, and preferences.
        </p>
      </header>

      {notice && (
        <p
          className="rounded-lg border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground"
          role="status"
        >
          {notice}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <nav
          aria-label="Settings sections"
          className="flex gap-1 overflow-x-auto rounded-2xl border bg-card p-2 lg:block lg:space-y-1 lg:self-start"
        >
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setSection(id)}
              aria-current={section === id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition lg:w-full ${
                section === id
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        <section className="min-w-0 rounded-2xl border bg-card p-5 sm:p-7">
          {section === "general" && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold">General preferences</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set your default appearance and regional preferences.
                </p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="theme-setting" className="text-sm font-medium">
                    Appearance
                  </label>
                  <select
                    id="theme-setting"
                    value={theme ?? "system"}
                    onChange={(event) => setTheme(event.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:max-w-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="language-setting" className="text-sm font-medium">
                      Language
                    </label>
                    <select
                      id="language-setting"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      defaultValue="en"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="timezone-setting" className="text-sm font-medium">
                      Time zone
                    </label>
                    <select
                      id="timezone-setting"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      defaultValue="Asia/Kolkata"
                    >
                      <option value="Asia/Kolkata">India Standard Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {section === "account" && (
            <>
              <h2 className="text-lg font-semibold">Account settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your account details are managed from your profile.
              </p>
              <div className="mt-5 rounded-xl border p-4">
                <p className="text-sm font-medium">Profile information</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Update your name, role, avatar, and personal details.
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    window.location.href = "/profile";
                  }}
                >
                  Open profile
                </Button>
              </div>
            </>
          )}

          {section === "workspace" && (
            <>
              <h2 className="text-lg font-semibold">Workspace settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure workspace information and invite teammates.
              </p>
              <div className="mt-5 space-y-5">
                <div className="space-y-2">
                  <label htmlFor="settings-workspace-name" className="text-sm font-medium">
                    Workspace name
                  </label>
                  <Input
                    id="settings-workspace-name"
                    value={workspaceName}
                    onChange={(event) => setWorkspaceName(event.target.value)}
                    className="sm:max-w-sm"
                  />
                </div>
                <div className="rounded-xl border p-4">
                  <h3 className="flex items-center gap-2 text-sm font-medium">
                    <Users className="size-4 text-primary" aria-hidden="true" />
                    Members
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Invite teammates to collaborate. Invites are not sent in this preview.
                  </p>
                  <form
                    className="mt-4 flex flex-col gap-2 sm:flex-row"
                    onSubmit={inviteMember}
                  >
                    <Input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(event) => setInviteEmail(event.target.value)}
                      placeholder="teammate@company.com"
                      aria-label="Invite member email"
                    />
                    <Button type="submit">Add invite</Button>
                  </form>
                  {invites.length > 0 && (
                    <ul className="mt-4 divide-y rounded-lg border">
                      {invites.map((email) => (
                        <li
                          key={email}
                          className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                        >
                          {email}
                          <span className="text-xs text-muted-foreground">
                            Pending
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}

          {section === "notifications" && (
            <>
              <h2 className="text-lg font-semibold">Notification preferences</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose which workspace updates you want to see.
              </p>
              <div className="mt-4">
                {renderToggle("Task assignments", "When a task is assigned to you.", "taskAssignments")}
                {renderToggle("Mentions", "When someone mentions you in a comment.", "mentions")}
                {renderToggle("Project updates", "Important changes to projects you follow.", "projectUpdates")}
                {renderToggle("Weekly digest", "A summary of activity each week.", "weeklyDigest")}
              </div>
            </>
          )}

          {section === "ai" && (
            <>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-violet-600">
                  <WandSparkles className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">AI preferences</h2>
                  <p className="text-sm text-muted-foreground">
                    Choose how the assistant behaves.
                  </p>
                </div>
              </div>
              <div className="mt-5">
                {renderToggle("Show AI suggestions", "Display suggestions in project and task views.", "aiSuggestions")}
                {renderToggle("Use project context", "Allow the assistant to use project data when integrated.", "useProjectContext")}
              </div>
              <div className="mt-4 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 text-xs leading-5 text-muted-foreground">
                AI actions are preview-only until a model provider is configured.
              </div>
            </>
          )}

          {section === "security" && (
            <>
              <h2 className="text-lg font-semibold">Security</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Protect your account and manage sessions.
              </p>
              <label className="mt-5 flex items-center justify-between gap-4 rounded-xl border p-4">
                <span className="flex items-start gap-3">
                  <LockKeyhole className="mt-0.5 size-4 text-primary" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-medium">Two-factor authentication</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Add an extra verification step when signing in.
                    </span>
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.twoFactor}
                  onChange={(event) => updateSetting("twoFactor", event.target.checked)}
                  className="size-4 accent-primary"
                />
              </label>
              <form className="mt-6 space-y-4 border-t pt-5" onSubmit={changePassword}>
                <div>
                  <h3 className="text-sm font-semibold">Change password</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Password changes are not connected to the backend yet.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="New password"
                    aria-label="New password"
                  />
                  <Input
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm password"
                    aria-label="Confirm password"
                  />
                </div>
                <Button type="submit" variant="outline">
                  <LockKeyhole aria-hidden="true" />
                  Update password
                </Button>
              </form>
            </>
          )}

          <div className="mt-8 flex justify-end border-t pt-5">
            <Button onClick={saveSettings}>
              <Save aria-hidden="true" />
              Save preferences
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
