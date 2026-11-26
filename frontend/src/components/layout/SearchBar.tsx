import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  CheckCircle2,
  Command,
  FolderKanban,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { navigation } from "@/constants/navigation";
import { initialTasks, mockProjects } from "@/features/task/mock-tasks";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  icon: typeof Search;
}

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const results = useMemo(() => {
    const searchable: SearchResult[] = [
      ...navigation.map((item) => ({
        id: `page-${item.path}`,
        title: item.title,
        subtitle: "Page",
        path: item.path,
        icon: item.icon,
      })),
      ...mockProjects.map((project) => ({
        id: project.id,
        title: project.name,
        subtitle: "Project",
        path: `/projects?search=${encodeURIComponent(project.name)}`,
        icon: FolderKanban,
      })),
      ...initialTasks.map((task) => ({
        id: task.id,
        title: task.title,
        subtitle: `${task.project.name} · Task`,
        path: `/tasks?search=${encodeURIComponent(task.title)}`,
        icon: CheckCircle2,
      })),
    ];
    const trimmedQuery = query.trim().toLocaleLowerCase();
    return searchable
      .filter(
        (item) =>
          !trimmedQuery ||
          item.title.toLocaleLowerCase().includes(trimmedQuery) ||
          item.subtitle.toLocaleLowerCase().includes(trimmedQuery)
      )
      .slice(0, 10);
  }, [query]);

  const goTo = (path: string) => {
    console.info("[search-ui] navigated from command palette");
    navigate(path);
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((current) =>
        results.length ? (current + 1) % results.length : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((current) =>
        results.length ? (current - 1 + results.length) % results.length : 0
      );
    } else if (event.key === "Enter" && results[selectedIndex]) {
      event.preventDefault();
      goTo(results[selectedIndex].path);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-full max-w-xl items-center gap-3 rounded-xl border bg-muted/40 px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
        aria-label="Open search and command palette"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">Search anything...</span>
        <kbd className="hidden items-center gap-1 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:inline-flex">
          <Command className="size-3" aria-hidden="true" /> K
        </kbd>
      </button>

      <Dialog.Root
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setQuery("");
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-slate-950/45 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-[18vh] z-[60] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border bg-background shadow-2xl focus:outline-none">
            <Dialog.Title className="sr-only">Search and commands</Dialog.Title>
            <Dialog.Description className="sr-only">
              Search pages, projects, and tasks.
            </Dialog.Description>
            <div className="flex items-center gap-3 border-b px-4">
              <Search
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, projects, and tasks..."
                aria-label="Search pages, projects, and tasks"
                className="h-14 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label="Close search"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2" role="listbox" aria-label="Search results">
              {results.length ? (
                results.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      role="option"
                      aria-selected={selectedIndex === index}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => goTo(item.path)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        selectedIndex === index ? "bg-muted" : "hover:bg-muted/70"
                      }`}
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">{item.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{item.subtitle}</span>
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No matching pages or work items.
                </p>
              )}
            </div>
            <p className="border-t px-4 py-2 text-[11px] text-muted-foreground">
              <kbd className="rounded border px-1">↑</kbd>{" "}
              <kbd className="rounded border px-1">↓</kbd> browse ·{" "}
              <kbd className="rounded border px-1">Enter</kbd> open ·{" "}
              <kbd className="rounded border px-1">Esc</kbd> close
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default SearchBar;
