export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export interface SavedDocument {
  id: string;
  title: string;
  createdAt: number;
}

export interface Artifact {
  id: string;
  title: string;
  createdAt: number;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  documents: SavedDocument[];
  artifacts: Artifact[];
}

const STORAGE_KEY = "shine.chatHistory.v1";
const UPDATE_EVENT = "shine.chatHistory.updated";

let memoryFallback: ChatSession[] = [];

function notifyUpdated() {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // Ignore dispatch failures.
  }
}

function safeNow() {
  return Date.now();
}

function safeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${safeNow()}-${Math.random().toString(16).slice(2)}`;
}

function readAll(): ChatSession[] {
  if (typeof window === "undefined") return memoryFallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as ChatSession[];
  } catch {
    return memoryFallback;
  }
}

function writeAll(sessions: ChatSession[]) {
  if (typeof window === "undefined") {
    memoryFallback = sessions;
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    notifyUpdated();
  } catch {
    memoryFallback = sessions;
  }
}

function deriveTitleFromText(text: string) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return "New chat";
  return trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed;
}

export function listChats(): ChatSession[] {
  const sessions = readAll();
  return [...sessions].sort((a, b) => (b?.updatedAt ?? 0) - (a?.updatedAt ?? 0));
}

export function getChat(chatId: string): ChatSession | null {
  const sessions = readAll();
  return sessions.find((s) => s.id === chatId) ?? null;
}

export function createChatFromPrompt(prompt: string): string {
  const now = safeNow();
  const sessionId = safeId();
  const messageId = safeId();

  const session: ChatSession = {
    id: sessionId,
    title: deriveTitleFromText(prompt),
    createdAt: now,
    updatedAt: now,
    messages: prompt.trim()
      ? [
          {
            id: messageId,
            role: "user",
            content: prompt,
            createdAt: now,
          },
        ]
      : [],
    documents: [],
    artifacts: [],
  };

  const sessions = readAll();
  writeAll([session, ...sessions]);
  return sessionId;
}

export function createEmptyChat(): string {
  const now = safeNow();
  const sessionId = safeId();

  const session: ChatSession = {
    id: sessionId,
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
    documents: [],
    artifacts: [],
  };

  const sessions = readAll();
  writeAll([session, ...sessions]);
  return sessionId;
}

export function appendMessage(chatId: string, role: ChatRole, content: string) {
  const sessions = readAll();
  const now = safeNow();
  const nextSessions = sessions.map((session) => {
    if (session.id !== chatId) return session;
    const nextMessage: ChatMessage = {
      id: safeId(),
      role,
      content,
      createdAt: now,
    };

    const nextTitle =
      session.title?.trim() && session.title !== "New chat"
        ? session.title
        : role === "user"
          ? deriveTitleFromText(content)
          : session.title;

    return {
      ...session,
      title: nextTitle,
      updatedAt: now,
      messages: [...(session.messages ?? []), nextMessage],
    };
  });

  writeAll(nextSessions);
}

export function addDocument(chatId: string, title: string) {
  const sessions = readAll();
  const now = safeNow();
  const cleanTitle = title.trim() || "Untitled document";

  const nextSessions = sessions.map((session) => {
    if (session.id !== chatId) return session;
    return {
      ...session,
      updatedAt: now,
      documents: [
        ...(session.documents ?? []),
        { id: safeId(), title: cleanTitle, createdAt: now },
      ],
    };
  });

  writeAll(nextSessions);
}

export function addArtifact(chatId: string, title: string) {
  const sessions = readAll();
  const now = safeNow();
  const cleanTitle = title.trim() || "Artifact";

  const nextSessions = sessions.map((session) => {
    if (session.id !== chatId) return session;
    const alreadyExists = (session.artifacts ?? []).some(
      (artifact) => artifact.title.toLowerCase() === cleanTitle.toLowerCase()
    );
    if (alreadyExists) return session;
    return {
      ...session,
      updatedAt: now,
      artifacts: [
        ...(session.artifacts ?? []),
        { id: safeId(), title: cleanTitle, createdAt: now },
      ],
    };
  });

  writeAll(nextSessions);
}

export function onChatHistoryUpdated(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => listener();
  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

