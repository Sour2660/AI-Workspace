import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  BriefcaseBusiness,
  Camera,
  Check,
  Clock3,
  type LucideIcon,
  MapPin,
  Pencil,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialTasks } from "@/features/task/mock-tasks";
import { useAuthStore } from "@/features/auth/auth.store";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState(user?.name ?? "Workspace member");
  const [email, setEmail] = useState(user?.email ?? "member@example.com");
  const [role, setRole] = useState("Product designer");
  const [location, setLocation] = useState("Remote");
  const [bio, setBio] = useState(
    "I enjoy bringing thoughtful products to life with a collaborative team."
  );
  const [avatar, setAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [notice, setNotice] = useState("");

  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const assignedTasks = initialTasks.filter(
    (task) => task.assignee.name === name
  ).length;
  const activityStats: Array<{
    value: string;
    label: string;
    icon: LucideIcon;
  }> = [
    { value: String(assignedTasks), label: "Tasks assigned", icon: Target },
    { value: "3", label: "Projects", icon: BriefcaseBusiness },
    { value: "4", label: "Team members", icon: Users },
    { value: "82%", label: "Focus score", icon: Sparkles },
  ];
  const profileFields: Array<{
    id: string;
    label: string;
    value: string;
    type: "text" | "email";
    onChange: (value: string) => void;
    required?: boolean;
  }> = [
    { id: "profile-name", label: "Name", value: name, type: "text", onChange: setName, required: true },
    { id: "profile-email", label: "Email", value: email, type: "email", onChange: setEmail, required: true },
    { id: "profile-role", label: "Role", value: role, type: "text", onChange: setRole },
    { id: "profile-location", label: "Location", value: location, type: "text", onChange: setLocation },
  ];

  const uploadAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("Choose an image file for your avatar.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        setNotice("Avatar preview updated locally.");
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
    console.info("[profile-ui] avatar changed in local preview");
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setName(name.trim());
    setEmail(email.trim());
    setIsEditing(false);
    setNotice("Profile changes are saved in this preview only.");
    console.info("[profile-ui] profile updated in local preview");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 p-5 sm:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Your space, your way
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your personal information and preferences.
          </p>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Pencil aria-hidden="true" />
          Edit profile
        </Button>
      </header>

      {notice && (
        <p
          className="rounded-lg border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground"
          role="status"
        >
          {notice}
        </p>
      )}

      <section className="relative overflow-hidden rounded-2xl border bg-card">
        <div className="h-36 bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-400 sm:h-48" />
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:px-8 sm:pb-7">
          <div className="-mt-16 flex items-end gap-4 sm:-mt-20">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt={`${name} avatar`}
                  className="size-24 rounded-2xl border-4 border-card object-cover sm:size-28"
                />
              ) : (
                <div className="grid size-24 place-items-center rounded-2xl border-4 border-card bg-primary text-2xl font-semibold text-primary-foreground sm:size-28">
                  {initials}
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 grid size-9 cursor-pointer place-items-center rounded-full border bg-background shadow-sm hover:bg-muted">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={uploadAvatar}
                  aria-label="Upload profile photo"
                />
                <Camera className="size-4" aria-hidden="true" />
              </label>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-semibold">{name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{role}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5">
              <MapPin className="size-3.5" aria-hidden="true" />
              {location}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5">
              <BriefcaseBusiness className="size-3.5" aria-hidden="true" />
              AI Workspace
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <h2 className="font-semibold">About</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{bio}</p>
            <div className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="mt-1 break-all text-sm font-medium">{email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="mt-1 text-sm font-medium">{role}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Recent activity</h2>
              <span className="text-xs text-muted-foreground">Demo data</span>
            </div>
            <div className="mt-5 space-y-5">
              {[
                ["Updated task status", "Finalize dashboard layout", "Today"],
                ["Reviewed", "Audit keyboard navigation", "Yesterday"],
                ["Completed", "Document API error states", "Nov 23"],
              ].map(([action, subject, time]) => (
                <div key={subject} className="flex gap-3">
                  <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Clock3 className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{action}</span>{" "}
                      <span className="text-muted-foreground">{subject}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <h2 className="font-semibold">Your activity</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {activityStats.map(({ value, label, icon: StatIcon }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-muted/40 p-3"
                  >
                    <StatIcon
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                    <p className="mt-3 text-xl font-semibold">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                  </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <h2 className="font-semibold">Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Product design", "Prototyping", "Design systems", "Research"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-full border bg-muted/20 px-3 py-1.5 text-xs"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </section>
        </aside>
      </div>

      <Dialog.Root open={isEditing} onOpenChange={setIsEditing}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-background p-6 shadow-2xl">
            <Dialog.Title className="text-lg font-semibold">Edit profile</Dialog.Title>
            <form className="mt-5 space-y-4" onSubmit={saveProfile}>
              {profileFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.id} className="text-sm font-medium">
                    {field.label}
                  </label>
                  <Input
                    id={field.id}
                    required={field.required}
                    type={field.type}
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(event.target.value)
                    }
                  />
                </div>
              ))}
              <div className="space-y-2">
                <label htmlFor="profile-bio" className="text-sm font-medium">
                  About
                </label>
                <textarea
                  id="profile-bio"
                  rows={3}
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Check aria-hidden="true" />
                  Save profile
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ProfilePage;
