"use client";

import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "openai-api-key";
const CHANGE_EVENT = "openai-api-key-change";

function subscribe(callback: () => void) {
  // "storage" fires for other tabs; the custom event covers this tab.
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot() {
  return null;
}

function writeKey(value: string | null) {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, value);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable (private mode, blocked storage)
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useApiKey() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function maskKey(key: string) {
  if (key.length <= 10) return "••••••••";
  return `${key.slice(0, 3)}••••••••${key.slice(-4)}`;
}

export function ApiKeyInput() {
  const savedKey = useApiKey();
  const [draft, setDraft] = useState("");
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const showForm = !savedKey || editing;

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = draft.trim();
    if (!value.startsWith("sk-")) {
      setError("OpenAI API Key 通常以 sk- 開頭，請確認是否貼上完整。");
      return;
    }
    writeKey(value);
    setDraft("");
    setError("");
    setVisible(false);
    setEditing(false);
  }

  function handleClear() {
    writeKey(null);
    setDraft("");
    setEditing(false);
  }

  return (
    <section className="rise rounded-2xl border border-line bg-paper-raised p-5 [animation-delay:80ms] sm:p-6">
      <div className="flex items-center gap-3">
        <StepBadge done={Boolean(savedKey) && !editing}>1</StepBadge>
        <h2 className="text-base font-bold">OpenAI API Key</h2>
      </div>

      {showForm ? (
        <form onSubmit={handleSave} className="mt-4 flex flex-col gap-3">
          <label htmlFor="api-key" className="sr-only">
            OpenAI API Key
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex min-w-0 flex-1">
              <input
                id="api-key"
                type={visible ? "text" : "password"}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setError("");
                }}
                placeholder="sk-..."
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 rounded-xl border border-line bg-paper px-4 py-3 pr-16 font-mono text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-ink focus:ring-4 focus:ring-ink/5"
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute inset-y-1.5 right-1.5 rounded-lg px-3 text-xs text-ink-soft transition hover:bg-paper-sunken hover:text-ink"
              >
                {visible ? "隱藏" : "顯示"}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!draft.trim()}
                className="flex-1 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-pen disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-ink sm:flex-none"
              >
                儲存
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setDraft("");
                    setError("");
                  }}
                  className="rounded-xl px-4 py-3 text-sm text-ink-soft transition hover:bg-paper-sunken"
                >
                  取消
                </button>
              )}
            </div>
          </div>
          {error && <p className="text-sm text-pen">{error}</p>}
          <p className="text-sm leading-6 text-ink-faint">
            🔒 金鑰只存在你這台電腦的瀏覽器裡，我們不會保存。還沒有金鑰？
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-pen decoration-2 underline-offset-4 hover:text-pen"
            >
              到 OpenAI 申請 →
            </a>
          </p>
        </form>
      ) : (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-fix-soft px-3.5 py-2 text-sm text-fix">
            <span aria-hidden>✓</span>
            已儲存
            <code className="truncate font-mono">{maskKey(savedKey)}</code>
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-lg px-3 py-2 text-sm text-ink-soft transition hover:bg-paper-sunken hover:text-ink"
            >
              更換
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg px-3 py-2 text-sm text-pen transition hover:bg-pen-soft"
            >
              清除
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export function StepBadge({
  done,
  children,
}: {
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-medium transition ${
        done ? "bg-fix text-paper" : "border border-ink text-ink"
      }`}
    >
      {done ? "✓" : children}
    </span>
  );
}
