import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

const Topbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <SearchBar />

      <div className="flex items-center gap-4">
        <NotificationBell />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default Topbar;