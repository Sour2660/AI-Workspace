import {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import dayjs from "dayjs";
import {
  Download,
  File,
  FileImage,
  FileText,
  Folder,
  FolderOpen,
  Grid2X2,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Share2,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type DocumentFilter = "all" | "recent" | "shared" | "favorites";

interface WorkspaceDocument {
  id: string;
  name: string;
  folder: string;
  type: string;
  size: number;
  updatedAt: string;
  shared: boolean;
  favorite: boolean;
  content: string;
  previewData?: string;
  file?: File;
}

const initialDocuments: WorkspaceDocument[] = [
  {
    id: "doc-1",
    name: "Product requirements.md",
    folder: "Product",
    type: "text/markdown",
    size: 12400,
    updatedAt: "2026-11-25T13:00:00.000Z",
    shared: true,
    favorite: true,
    content:
      "# Product requirements\n\nA clear home for the work teams do together.\n\n## Goals\n- Bring projects and tasks into one workspace\n- Make progress visible\n- Keep collaboration focused",
  },
  {
    id: "doc-2",
    name: "Brand guidelines.pdf",
    folder: "Design",
    type: "application/pdf",
    size: 2480000,
    updatedAt: "2026-11-24T10:30:00.000Z",
    shared: true,
    favorite: false,
    content: "PDF preview is a placeholder in this local UI.",
  },
  {
    id: "doc-3",
    name: "Sprint notes.txt",
    folder: "Product",
    type: "text/plain",
    size: 8300,
    updatedAt: "2026-11-22T09:10:00.000Z",
    shared: false,
    favorite: false,
    content:
      "Sprint notes\n\n- Polish task states\n- Review keyboard navigation\n- Prepare the next release",
  },
  {
    id: "doc-4",
    name: "Dashboard concept.png",
    folder: "Design",
    type: "image/png",
    size: 956000,
    updatedAt: "2026-11-20T15:45:00.000Z",
    shared: false,
    favorite: true,
    content: "Image preview is unavailable for this sample.",
  },
  {
    id: "doc-5",
    name: "Team handbook.docx",
    folder: "Shared",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 38400,
    updatedAt: "2026-11-18T08:00:00.000Z",
    shared: true,
    favorite: false,
    content: "Document preview is not available for this file type.",
  },
];

const initialFolders = ["All files", "Product", "Design", "Shared"];

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const documentIcon = (type: string) => {
  if (type.startsWith("image/")) return FileImage;
  if (type.includes("pdf") || type.startsWith("text/")) return FileText;
  return File;
};

const DocumentIcon = ({ type, className }: { type: string; className: string }) => {
  return createElement(documentIcon(type), {
    className,
    "aria-hidden": true,
  });
};

const DocumentsPage = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [folders, setFolders] = useState(initialFolders);
  const [filter, setFilter] = useState<DocumentFilter>("all");
  const [folder, setFolder] = useState("All files");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [preview, setPreview] = useState<WorkspaceDocument | null>(null);
  const pdfPreviewUrl = useRef<string | null>(null);
  const [activePdfPreviewUrl, setActivePdfPreviewUrl] = useState<string | null>(
    null
  );
  const [renameTarget, setRenameTarget] = useState<WorkspaceDocument | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<WorkspaceDocument | null>(null);
  const [uploadNotice, setUploadNotice] = useState("");
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(
    () => () => {
      if (pdfPreviewUrl.current) URL.revokeObjectURL(pdfPreviewUrl.current);
    },
    []
  );

  const closePreview = () => {
    if (pdfPreviewUrl.current) {
      URL.revokeObjectURL(pdfPreviewUrl.current);
      pdfPreviewUrl.current = null;
    }
    setActivePdfPreviewUrl(null);
    setPreview(null);
  };

  const openPreview = (document: WorkspaceDocument) => {
    closePreview();
    if (document.type === "application/pdf" && document.file) {
      const url = URL.createObjectURL(document.file);
      pdfPreviewUrl.current = url;
      setActivePdfPreviewUrl(url);
    }
    setPreview(document);
  };

  const visibleDocuments = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return documents
      .filter((document) => {
        const matchesFolder =
          folder === "All files" || document.folder === folder;
        const matchesFilter =
          filter === "all" ||
          (filter === "recent" &&
            dayjs().diff(dayjs(document.updatedAt), "day") <= 7) ||
          (filter === "shared" && document.shared) ||
          (filter === "favorites" && document.favorite);
        const matchesQuery =
          !query ||
          document.name.toLocaleLowerCase().includes(query) ||
          document.folder.toLocaleLowerCase().includes(query);
        return matchesFolder && matchesFilter && matchesQuery;
      })
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }, [documents, filter, folder, search]);

  const uploadFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (!selectedFiles.length) return;

    selectedFiles.forEach((file) => {
      const addFile = (content = "", previewData?: string) => {
        setDocuments((current) => [
          {
            id: `doc-${crypto.randomUUID()}`,
            name: file.name,
            folder: folder === "All files" ? "Product" : folder,
            type: file.type || "application/octet-stream",
            size: file.size,
            updatedAt: new Date().toISOString(),
            shared: false,
            favorite: false,
            content:
              content ||
              "This file is stored only in the current browser session.",
            previewData,
            file,
          },
          ...current,
        ]);
      };

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () =>
          addFile("", typeof reader.result === "string" ? reader.result : undefined);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("text/")) {
        const reader = new FileReader();
        reader.onload = () =>
          addFile(typeof reader.result === "string" ? reader.result : "");
        reader.readAsText(file);
      } else {
        addFile();
      }
    });

    setUploadNotice(
      `${selectedFiles.length} ${selectedFiles.length === 1 ? "file" : "files"} added to this local preview.`
    );
    event.target.value = "";
    console.info("[documents-ui] files added to local preview", {
      count: selectedFiles.length,
    });
  };

  const downloadDocument = (document: WorkspaceDocument) => {
    const blob = document.file
      ? new Blob([document.file], { type: document.type })
      : new Blob([document.content], { type: document.type });
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = document.name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const saveRename = () => {
    if (!renameTarget || !renameValue.trim()) return;
    setDocuments((current) =>
      current.map((document) =>
        document.id === renameTarget.id
          ? { ...document, name: renameValue.trim() }
          : document
      )
    );
    setRenameTarget(null);
    console.info("[documents-ui] file renamed in local preview");
  };

  const deleteDocument = () => {
    if (!deleteTarget) return;
    setDocuments((current) =>
      current.filter((document) => document.id !== deleteTarget.id)
    );
    setPreview((current) =>
      current?.id === deleteTarget.id ? null : current
    );
    if (preview?.id === deleteTarget.id) closePreview();
    setDeleteTarget(null);
    console.info("[documents-ui] file removed from local preview");
  };

  const toggleFavorite = (documentId: string) => {
    setDocuments((current) =>
      current.map((document) =>
        document.id === documentId
          ? { ...document, favorite: !document.favorite }
          : document
      )
    );
  };

  const renderDocument = (document: WorkspaceDocument) => {
    return (
      <article
        key={document.id}
        className={`group rounded-2xl border bg-card transition hover:shadow-md ${
          view === "list"
            ? "flex items-center gap-3 p-3 sm:gap-4 sm:px-5"
            : "p-4"
        }`}
      >
        {view === "grid" && (
          <button
            type="button"
            onClick={() => openPreview(document)}
            className="mb-4 grid h-36 w-full place-items-center overflow-hidden rounded-xl bg-muted/50 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Preview ${document.name}`}
          >
            {document.previewData ? (
              <img
                src={document.previewData}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <DocumentIcon
                type={document.type}
                className="size-10 opacity-70"
              />
            )}
          </button>
        )}
        {view === "list" && (
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <DocumentIcon type={document.type} className="size-5" />
          </span>
        )}
        <button
          type="button"
          onClick={() => openPreview(document)}
          className={`min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            view === "list" ? "flex-1" : "block w-full"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">{document.name}</span>
            {document.favorite && (
              <Star
                className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
                aria-label="Favorite"
              />
            )}
          </span>
          <span className="mt-1 block truncate text-xs text-muted-foreground">
            {document.folder} · {formatSize(document.size)}
          </span>
          {view === "list" && (
            <span className="mt-1 block text-xs text-muted-foreground">
              Updated {dayjs(document.updatedAt).format("MMM D, YYYY")}
            </span>
          )}
        </button>
        {view === "grid" && (
          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">
              {dayjs(document.updatedAt).format("MMM D, YYYY")}
            </span>
            {document.shared && (
              <Share2
                className="size-3.5 text-muted-foreground"
                aria-label="Shared"
              />
            )}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={`Actions for ${document.name}`}
            >
              <MoreHorizontal className="size-4" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => openPreview(document)}>
              <FolderOpen aria-hidden="true" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => downloadDocument(document)}>
              <Download aria-hidden="true" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setRenameTarget(document);
                setRenameValue(document.name);
              }}
            >
              <Pencil aria-hidden="true" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toggleFavorite(document.id)}>
              <Star aria-hidden="true" />
              {document.favorite ? "Remove favorite" : "Add favorite"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => setDeleteTarget(document)}
            >
              <Trash2 aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </article>
    );
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-7 p-5 sm:p-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Everything in its place
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Documents
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse and share your team’s files · Local preview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              className="sr-only"
              onChange={uploadFiles}
              aria-label="Upload files"
            />
            <span className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-sm hover:bg-muted focus-within:ring-2 focus-within:ring-ring">
              <Upload className="size-4" aria-hidden="true" />
              Upload
            </span>
          </label>
          <Button
            onClick={() => setFolderDialogOpen(true)}
          >
            <Plus aria-hidden="true" />
            New folder
          </Button>
        </div>
      </header>

      {uploadNotice && (
        <div
          role="status"
          className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground"
        >
          {uploadNotice}
          <button
            type="button"
            onClick={() => setUploadNotice("")}
            className="rounded p-1 hover:bg-muted"
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-2xl border bg-card p-3">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Folders
          </p>
          <nav aria-label="Document folders" className="space-y-1">
            {folders.map((folderName) => {
              const count =
                folderName === "All files"
                  ? documents.length
                  : documents.filter((document) =>
                      folderName === "Shared"
                        ? document.shared
                        : document.folder === folderName
                    ).length;
              const FolderIcon = folderName === folder ? FolderOpen : Folder;
              return (
                <button
                  type="button"
                  key={folderName}
                  onClick={() => setFolder(folderName)}
                  aria-current={folderName === folder ? "page" : undefined}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
                    folderName === folder
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <FolderIcon className="size-4" aria-hidden="true" />
                  <span className="flex-1 text-left">{folderName}</span>
                  <span className="text-xs">{count}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-5 border-t pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Collections
            </p>
            {(
              [
                ["all", "All files"],
                ["recent", "Recent"],
                ["shared", "Shared with me"],
                ["favorites", "Favorites"],
              ] as const
            ).map(([value, label]) => (
              <button
                type="button"
                key={value}
                onClick={() => setFilter(value)}
                className={`mt-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
                  filter === value
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0 space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">{folder}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {visibleDocuments.length} files
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative min-w-0 flex-1 sm:w-64">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search files..."
                  aria-label="Search files"
                  className="h-9 bg-background pl-9"
                />
              </label>
              <div className="flex rounded-lg border p-0.5">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`grid size-8 place-items-center rounded ${
                    view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                >
                  <Grid2X2 className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`grid size-8 place-items-center rounded ${
                    view === "list" ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                  aria-label="List view"
                  aria-pressed={view === "list"}
                >
                  <List className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {visibleDocuments.length ? (
            <div
              className={
                view === "grid"
                  ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  : "space-y-2"
              }
            >
              {visibleDocuments.map(renderDocument)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
              <FileText className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
              <h3 className="mt-4 font-semibold">No files found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another folder or upload a file to get started.
              </p>
            </div>
          )}
        </section>
      </div>

      <Sheet open={Boolean(preview)} onOpenChange={(open) => !open && closePreview()}>
        {preview && (
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
            <SheetHeader className="border-b pb-5 pr-8 text-left">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <DocumentIcon type={preview.type} className="size-5" />
              </span>
              <SheetTitle className="mt-3 break-all">{preview.name}</SheetTitle>
              <SheetDescription>
                {preview.folder} · {formatSize(preview.size)} · Updated{" "}
                {dayjs(preview.updatedAt).format("MMM D, YYYY")}
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              {preview.previewData ? (
                <img
                  src={preview.previewData}
                  alt={preview.name}
                  className="max-h-[65vh] w-full rounded-xl border object-contain"
                />
              ) : preview.type === "application/pdf" && activePdfPreviewUrl ? (
                <iframe
                  src={activePdfPreviewUrl}
                  title={`Preview of ${preview.name}`}
                  className="h-[65vh] w-full rounded-xl border"
                />
              ) : preview.type.startsWith("text/") ? (
                <pre className="max-h-[65vh] overflow-auto whitespace-pre-wrap rounded-xl border bg-muted/30 p-5 text-sm leading-6">
                  {preview.content}
                </pre>
              ) : (
                <div className="rounded-xl border border-dashed px-6 py-16 text-center">
                  <DocumentIcon
                    type={preview.type}
                    className="mx-auto size-10 text-muted-foreground"
                  />
                  <p className="mt-4 font-medium">Preview isn’t available</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This file type can be downloaded from the file menu.
                  </p>
                </div>
              )}
              <div className="mt-5 flex justify-end">
                <Button variant="outline" onClick={() => downloadDocument(preview)}>
                  <Download aria-hidden="true" />
                  Download
                </Button>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>

      <Dialog.Root
        open={Boolean(renameTarget)}
        onOpenChange={(open) => !open && setRenameTarget(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl">
            <Dialog.Title className="font-semibold">Rename file</Dialog.Title>
            <label htmlFor="rename-document" className="mt-4 block text-sm font-medium">
              File name
            </label>
            <Input
              id="rename-document"
              autoFocus
              className="mt-2"
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
            />
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRenameTarget(null)}>
                Cancel
              </Button>
              <Button onClick={saveRename} disabled={!renameValue.trim()}>
                Save name
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl">
            <Dialog.Title className="font-semibold">Delete this file?</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-muted-foreground">
              {deleteTarget?.name} will be removed from this local preview.
            </Dialog.Description>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={deleteDocument}>
                <Trash2 aria-hidden="true" />
                Delete
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl">
            <Dialog.Title className="font-semibold">Create a folder</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-muted-foreground">
              Folders are kept in this local preview.
            </Dialog.Description>
            <form
              className="mt-4"
              onSubmit={(event) => {
                event.preventDefault();
                const cleanName = newFolderName.trim();
                if (!cleanName || folders.includes(cleanName)) return;
                setFolders((current) => [...current, cleanName]);
                setFolder(cleanName);
                setNewFolderName("");
                setFolderDialogOpen(false);
              }}
            >
              <label htmlFor="new-folder-name" className="text-sm font-medium">
                Folder name
              </label>
              <Input
                id="new-folder-name"
                autoFocus
                className="mt-2"
                value={newFolderName}
                onChange={(event) => setNewFolderName(event.target.value)}
                placeholder="e.g. Research"
                required
              />
              <div className="mt-5 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFolderDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!newFolderName.trim()}>
                  Create folder
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default DocumentsPage;
