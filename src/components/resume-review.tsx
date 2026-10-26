"use client";

import { useEffect, useRef, useState } from "react";
import { StepBadge, useApiKey } from "@/components/api-key-input";
import {
  API_KEY_HEADER,
  DIMENSIONS,
  JOB_TYPES,
  MAX_PDF_BYTES,
  findJobType,
  type ResumeReview,
  type ReviewResponse,
  type Suggestion,
} from "@/lib/resume-review";

const LOADING_STEPS = [
  "正在閱讀整份履歷…",
  "比對這個職缺看重的能力…",
  "逐句挑出可以更好的地方…",
  "撰寫改寫建議…",
];

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ResumeReviewForm() {
  const apiKey = useApiKey();
  const [file, setFile] = useState<File | null>(null);
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [review, setReview] = useState<ResumeReview | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const canSubmit = Boolean(apiKey && file && jobType) && !loading;

  useEffect(() => {
    if (review) resultRef.current?.scrollIntoView({ block: "start" });
  }, [review]);

  function pickFile(picked: File | null) {
    setError("");
    if (picked && picked.type !== "application/pdf" && !/\.pdf$/i.test(picked.name)) {
      setError("目前只支援 PDF 檔。");
      return;
    }
    if (picked && picked.size > MAX_PDF_BYTES) {
      setError("檔案太大，請上傳 10MB 以內的 PDF。");
      setFile(null);
      return;
    }
    setFile(picked);
  }

  function clearFile() {
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!apiKey || !file || !jobType) return;

    const body = new FormData();
    body.append("file", file);
    body.append("jobType", jobType);

    setLoading(true);
    setError("");
    setReview(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { [API_KEY_HEADER]: apiKey },
        body,
      });
      const data = (await res.json()) as ReviewResponse;
      if (data.ok) setReview(data.review);
      else setError(data.error);
    } catch {
      setError("連線失敗，請確認網路後再試一次。");
    } finally {
      setLoading(false);
    }
  }

  if (review) {
    return (
      <div ref={resultRef} className="scroll-mt-20">
        <ReviewResult
          review={review}
          jobLabel={findJobType(jobType)?.label ?? ""}
          fileName={file?.name ?? ""}
          onReset={() => setReview(null)}
        />
      </div>
    );
  }

  if (loading) return <LoadingPanel fileName={file?.name ?? ""} />;

  return (
    <form
      onSubmit={handleSubmit}
      className="rise flex flex-col gap-6 rounded-2xl border border-line bg-paper-raised p-5 [animation-delay:160ms] sm:p-6"
    >
      <fieldset>
        <legend className="flex items-center gap-3">
          <StepBadge done={Boolean(file)}>2</StepBadge>
          <span className="text-base font-bold">上傳履歷 PDF</span>
        </legend>

        {file ? (
          <div className="mt-4 flex items-center gap-4 rounded-xl border border-line bg-paper p-4">
            <PdfIcon />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{file.name}</p>
              <p className="mt-0.5 text-sm text-ink-faint">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="shrink-0 rounded-lg px-3 py-2 text-sm text-ink-soft transition hover:bg-paper-sunken hover:text-ink"
            >
              更換
            </button>
          </div>
        ) : (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pickFile(e.dataTransfer.files?.[0] ?? null);
            }}
            className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
              dragging
                ? "border-pen bg-pen-soft"
                : "border-line bg-paper hover:border-ink/40"
            }`}
          >
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              className="sr-only"
            />
            <span className="grid size-12 place-items-center rounded-full border border-line bg-paper-raised text-xl">
              ↑
            </span>
            <span className="mt-4 font-medium">
              <span className="hidden sm:inline">拖曳 PDF 到這裡，或</span>
              <span className="text-pen underline decoration-2 underline-offset-4">
                點擊選擇檔案
              </span>
            </span>
            <span className="mt-1.5 text-sm text-ink-faint">僅限 PDF，10MB 以內</span>
          </label>
        )}
      </fieldset>

      <fieldset>
        <legend className="flex items-center gap-3">
          <StepBadge done={Boolean(jobType)}>3</StepBadge>
          <span className="text-base font-bold">應徵職缺類型</span>
        </legend>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {JOB_TYPES.map((job) => {
            const active = jobType === job.id;
            return (
              <label
                key={job.id}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-center text-sm transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ink/10 ${
                  active
                    ? "border-ink bg-ink font-medium text-paper"
                    : "border-line bg-paper hover:border-ink/40"
                }`}
              >
                <input
                  type="radio"
                  name="jobType"
                  value={job.id}
                  checked={active}
                  onChange={() => setJobType(job.id)}
                  className="sr-only"
                />
                {job.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 border-t border-line pt-6">
        {!apiKey && (
          <p className="text-sm text-pen">↑ 請先在上方儲存 OpenAI API Key。</p>
        )}
        {error && (
          <p className="rounded-xl bg-pen-soft px-4 py-3 text-sm text-pen">{error}</p>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-pen px-7 py-4 text-base font-medium text-white shadow-[0_8px_24px_-8px] shadow-pen/60 transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none sm:w-auto sm:self-start"
        >
          開始健檢
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </form>
  );
}

function PdfIcon() {
  return (
    <span className="relative grid h-12 w-10 shrink-0 place-items-end rounded-md border border-line bg-paper-raised pb-1.5">
      <span className="rounded bg-pen px-1 font-mono text-[9px] font-bold text-white">PDF</span>
    </span>
  );
}

function LoadingPanel({ fileName }: { fileName: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)),
      9000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      aria-live="polite"
      className="rise flex flex-col items-center rounded-2xl border border-line bg-paper-raised px-5 py-12 text-center sm:px-6"
    >
      <div className="relative h-36 w-28 overflow-hidden rounded-lg border border-line bg-paper p-3 shadow-lg shadow-ink/5">
        {[80, 60, 90, 70, 50, 85, 65].map((w, i) => (
          <span
            key={i}
            style={{ width: `${w}%` }}
            className="mb-2.5 block h-1.5 rounded-full bg-line"
          />
        ))}
        <span className="scan absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-pen/0 via-pen/40 to-pen/0" />
      </div>
      <p className="mt-8 font-serif text-xl font-black">AI 正在批改你的履歷</p>
      <p className="mt-2 max-w-full truncate text-sm text-ink-faint">{fileName}</p>
      <ol className="mt-6 flex flex-col gap-2 text-left text-sm">
        {LOADING_STEPS.map((label, i) => (
          <li
            key={label}
            className={`flex items-center gap-2.5 transition ${
              i < step ? "text-fix" : i === step ? "text-ink" : "text-ink-faint/60"
            }`}
          >
            <span className="grid size-4 place-items-center">
              {i < step ? (
                "✓"
              ) : i === step ? (
                <span className="size-2 animate-ping rounded-full bg-pen" />
              ) : (
                <span className="size-1.5 rounded-full bg-current" />
              )}
            </span>
            {label}
          </li>
        ))}
      </ol>
      <p className="mt-6 text-xs text-ink-faint">通常需要 30–60 秒，請不要關閉頁面</p>
    </section>
  );
}

function ReviewResult({
  review,
  jobLabel,
  fileName,
  onReset,
}: {
  review: ResumeReview;
  jobLabel: string;
  fileName: string;
  onReset: () => void;
}) {
  const total = DIMENSIONS.reduce(
    (sum, d) => sum + review.dimensions[d.id].suggestions.length,
    0,
  );

  return (
    <section className="flex flex-col gap-6">
      <div className="rise relative overflow-hidden rounded-2xl bg-ink p-6 text-paper sm:p-8">
        <span
          aria-hidden
          className="absolute -right-4 -top-10 font-serif text-[10rem] font-black leading-none text-paper/5"
        >
          評
        </span>
        <div className="relative flex flex-wrap items-center gap-2 text-xs">
          {jobLabel && (
            <span className="rounded-full bg-pen px-3 py-1 font-medium text-white">
              {jobLabel}
            </span>
          )}
          {fileName && (
            <span className="max-w-full truncate rounded-full border border-paper/20 px-3 py-1 text-paper/70">
              {fileName}
            </span>
          )}
        </div>
        <h2 className="relative mt-5 font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
          整體評語
        </h2>
        <p className="relative mt-2 font-serif text-xl font-semibold leading-9 sm:text-2xl sm:leading-10">
          {review.summary}
        </p>
        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-5">
          <p className="text-sm text-paper/70">
            共 <span className="font-serif text-2xl font-black text-paper">{total}</span> 條建議
          </p>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-paper/25 px-4 py-2 text-sm transition hover:bg-paper hover:text-ink"
          >
            ↺ 重新檢查
          </button>
        </div>
      </div>

      <nav
        aria-label="檢查面向"
        className="sticky top-16 z-20 -mx-4 overflow-x-auto bg-paper/90 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:px-3"
      >
        <ul className="flex w-max gap-2 sm:w-auto">
          {DIMENSIONS.map((d) => (
            <li key={d.id}>
              <a
                href={`#dim-${d.id}`}
                className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-paper-raised px-3.5 py-2 text-sm transition hover:border-ink"
              >
                {d.label}
                <span className="rounded-full bg-paper-sunken px-1.5 font-mono text-xs text-ink-soft">
                  {review.dimensions[d.id].suggestions.length}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {DIMENSIONS.map((dim, i) => {
        const { suggestions } = review.dimensions[dim.id];
        return (
          <article
            key={dim.id}
            id={`dim-${dim.id}`}
            className="scroll-mt-36 rounded-2xl border border-line bg-paper-raised p-5 sm:p-7"
          >
            <header className="flex items-start gap-4">
              <span className="font-serif text-4xl font-black leading-none text-pen">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-xl font-black sm:text-2xl">{dim.label}</h3>
                <p className="mt-1 text-sm leading-6 text-ink-faint">{dim.hint}</p>
              </div>
            </header>

            {suggestions.length === 0 ? (
              <p className="mt-6 flex items-center gap-2 rounded-xl bg-fix-soft px-4 py-3 text-sm text-fix">
                <span aria-hidden>✓</span>這個面向沒有明顯問題，保持下去。
              </p>
            ) : (
              <ol className="mt-6 flex flex-col gap-4">
                {suggestions.map((s, j) => (
                  <SuggestionCard key={j} index={j + 1} suggestion={s} />
                ))}
              </ol>
            )}
          </article>
        );
      })}

      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-ink/15 px-6 py-3 text-sm text-ink-soft transition hover:border-ink hover:text-ink"
        >
          ↺ 換一份履歷再檢查
        </button>
      </div>
    </section>
  );
}

function SuggestionCard({ index, suggestion }: { index: number; suggestion: Suggestion }) {
  const [copied, setCopied] = useState(false);

  async function copyFix() {
    try {
      await navigator.clipboard.writeText(suggestion.fix);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context or permission denied).
    }
  }

  return (
    <li className="overflow-hidden rounded-xl border border-line bg-paper">
      <div className="flex gap-3 p-4 sm:p-5">
        <span className="mt-1 font-mono text-xs text-ink-faint">{index}</span>
        <div className="min-w-0 flex-1 space-y-4 break-words">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">原句</p>
            <blockquote className="mt-1.5 leading-8">
              <span className="marker">{suggestion.quote}</span>
            </blockquote>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-pen">問題</p>
            <p className="mt-1.5 leading-7 text-ink-soft">{suggestion.problem}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-fix/20 bg-fix-soft p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-fix">改法</p>
          <button
            type="button"
            onClick={copyFix}
            className="rounded-md px-2 py-1 text-xs text-fix transition hover:bg-fix/10"
          >
            {copied ? "✓ 已複製" : "複製"}
          </button>
        </div>
        <p className="mt-1.5 break-words font-medium leading-7 text-fix">{suggestion.fix}</p>
      </div>
    </li>
  );
}
