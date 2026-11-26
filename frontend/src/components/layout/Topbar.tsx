import { Menu } from "lucide-react";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b bg-background px-3 text-foreground sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid size-9 shrink-0 place-items-center rounded-lg border text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-4" aria-hidden="true" />
        </button>
        <SearchBar />
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default Topbar;