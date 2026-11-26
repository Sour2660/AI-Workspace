import { useState, type FormEvent } from "react";
import {
  Bot,
  Check,
  Copy,
  Menu,
  Plus,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
}

const suggestions = [
  "Summarize my project progress",
  "Help me break down a feature",
  "Draft a project update",
];

const AssistantPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const messages =
    conversations.find((conversation) => conversation.id === activeConversationId)
      ?.messages ?? [];

  const sendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isTyping) {
      return;
    }

    console.info("[assistant-ui] prompt submitted to local preview");
    const conversationId =
      activeConversationId || `conversation-${crypto.randomUUID()}`;
    const userMessage: ChatMessage = {
      id: `message-${crypto.randomUUID()}`,
      role: "user",
      content: trimmed,
    };
    setConversations((current) => {
      const existing = current.find(
        (conversation) => conversation.id === conversationId
      );
      if (!existing) {
        return [
          {
            id: conversationId,
            title: trimmed.slice(0, 40),
            messages: [userMessage],
          },
          ...current,
        ];
      }
      return current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              title:
                conversation.title === "New conversation"
                  ? trimmed.slice(0, 40)
                  : conversation.title,
              messages: [...conversation.messages, userMessage],
            }
          : conversation
      );
    });
    setActiveConversationId(conversationId);
    setPrompt("");
    setIsTyping(true);

    window.setTimeout(() => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  {
                    id: `reply-${crypto.randomUUID()}`,
                    role: "assistant",
                    content:
                      "I’m a UI preview right now, so I can’t access your workspace data yet. Once the AI service is connected, I’ll be able to help with this request.",
                  },
                ],
              }
            : conversation
        )
      );
      setIsTyping(false);
    }, 850);
  };

  const startConversation = () => {
    const id = `conversation-${crypto.randomUUID()}`;
    setConversations((current) => [
      { id, title: "New conversation", messages: [] },
      ...current,
    ]);
    setActiveConversationId(id);
    setSidebarOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(prompt);
  };

  const copyMessage = async (message: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(""), 1500);
    } catch (error) {
      console.error("[assistant-ui] unable to copy message", {
        message: error instanceof Error ? error.message : "Clipboard unavailable",
      });
    }
  };

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] overflow-hidden sm:-m-6">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          aria-label="Close conversation history"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`${
          sidebarOpen ? "fixed inset-y-16 left-0 z-40 flex" : "hidden"
        } w-72 shrink-0 flex-col border-r bg-muted/20 p-4 lg:static lg:flex`}
      >
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={startConversation}
        >
          <Plus aria-hidden="true" />
          New conversation
        </Button>
        <p className="mb-2 mt-7 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Recent conversations
        </p>
        <div className="space-y-1">
          {conversations.length ? conversations.map((conversation) => (
              <button
                type="button"
                key={conversation.id}
                onClick={() => {
                  setActiveConversationId(conversation.id);
                  setSidebarOpen(false);
                }}
                aria-current={activeConversationId === conversation.id ? "page" : undefined}
                className={`w-full truncate rounded-lg px-3 py-2.5 text-left text-sm hover:bg-muted hover:text-foreground ${
                  activeConversationId === conversation.id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {conversation.title}
              </button>
            )) : (
              <p className="px-3 py-2 text-xs leading-5 text-muted-foreground">
                Your recent conversations will appear here.
              </p>
            )}
        </div>
        <div className="mt-auto rounded-xl border bg-background p-3">
          <p className="flex items-center gap-2 text-xs font-medium">
            <Sparkles className="size-3.5 text-violet-500" aria-hidden="true" />
            AI preview
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Replies are sample UI content and aren’t generated by a model.
          </p>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b px-4 sm:px-6">
          <button
            type="button"
            className="grid size-8 place-items-center rounded-lg border text-muted-foreground lg:hidden"
            aria-label="Open conversation history"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-4" aria-hidden="true" />
          </button>
          <span className="grid size-8 place-items-center rounded-lg bg-violet-500/10 text-violet-600">
            <Bot className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">AI Assistant</p>
            <p className="text-[11px] text-muted-foreground">
              Workspace copilot · Preview
            </p>
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto">
          {messages.length === 0 ? (
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-10">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-blue-500/15 text-violet-600">
                <WandSparkles className="size-6" aria-hidden="true" />
              </div>
              <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
                What can I help you with?
              </h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Ask for a project summary, plan, or a fresh idea.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {suggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-xl border bg-card p-4 text-left text-sm transition hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Sparkles
                      className="mb-3 size-4 text-violet-500"
                      aria-hidden="true"
                    />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl flex-1 space-y-7 px-5 py-8">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "assistant" && (
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-500/10 text-violet-600">
                      <Bot className="size-4" aria-hidden="true" />
                    </span>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border bg-card"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.role === "assistant" && (
                      <button
                        type="button"
                        onClick={() => void copyMessage(message)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {copiedId === message.id ? (
                          <Check className="size-3.5" aria-hidden="true" />
                        ) : (
                          <Copy className="size-3.5" aria-hidden="true" />
                        )}
                        {copiedId === message.id ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                </article>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="grid size-8 place-items-center rounded-lg bg-violet-500/10 text-violet-600">
                    <Bot className="size-4" aria-hidden="true" />
                  </span>
                  <span className="animate-pulse">Thinking…</span>
                </div>
              )}
            </div>
          )}

          <div className="sticky bottom-0 border-t bg-background/95 px-4 py-4 backdrop-blur sm:px-6">
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/40"
            >
              <label htmlFor="assistant-prompt" className="sr-only">
                Ask the AI assistant
              </label>
              <Input
                id="assistant-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Message AI Workspace..."
                className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!prompt.trim() || isTyping}
                aria-label="Send message"
              >
                <Send className="size-4" aria-hidden="true" />
              </Button>
            </form>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              AI replies are placeholders. Don’t include sensitive information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssistantPage;
