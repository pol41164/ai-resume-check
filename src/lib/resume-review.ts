import { z } from "zod";

// Shared by the API route and the frontend: the job types the user can pick,
// the fixed review dimensions, and the response shape the model must follow.

export const JOB_TYPES = [
  { id: "software-engineer", label: "軟體工程師" },
  { id: "data", label: "資料分析 / 資料科學" },
  { id: "product-manager", label: "產品經理" },
  { id: "designer", label: "UI / UX 設計" },
  { id: "marketing", label: "行銷" },
  { id: "sales", label: "業務" },
  { id: "hr", label: "人資" },
  { id: "finance", label: "財務 / 會計" },
  { id: "admin", label: "行政 / 管理" },
] as const;

export type JobTypeId = (typeof JOB_TYPES)[number]["id"];

export function findJobType(id: string) {
  return JOB_TYPES.find((job) => job.id === id);
}

// Order here is the render order. Labels live in code, not in the model
// output, so the frontend headings never drift.
export const DIMENSIONS = [
  {
    id: "relevance",
    label: "職缺契合度",
    hint: "經歷與技能是否對準這個職缺要的能力與關鍵字",
  },
  {
    id: "impact",
    label: "成果量化",
    hint: "是否用數字、規模、結果呈現貢獻，而不只是列出職責",
  },
  {
    id: "wording",
    label: "用字與表達",
    hint: "句子是否精簡、主動、具體，有沒有空泛或重複的詞",
  },
  {
    id: "structure",
    label: "結構與重點",
    hint: "段落順序、篇幅分配、重點是否一眼可見",
  },
] as const;

export type DimensionId = (typeof DIMENSIONS)[number]["id"];

const suggestionSchema = z.object({
  quote: z
    .string()
    .describe("履歷中的原句，必須逐字照抄，不可改寫、翻譯或摘要"),
  problem: z.string().describe("這句話的問題，具體說明為什麼不夠好"),
  fix: z
    .string()
    .describe("具體改法；能直接改寫時，給出可替換原句的完整改寫版本"),
});

const dimensionSchema = z.object({
  suggestions: z
    .array(suggestionSchema)
    .describe("此面向的建議，依重要性排序；沒有問題時可為空陣列"),
});

export const reviewSchema = z.object({
  summary: z.string().describe("針對此職缺的整體評語，2 到 3 句"),
  dimensions: z.object(
    Object.fromEntries(
      DIMENSIONS.map((d) => [d.id, dimensionSchema.describe(d.hint)]),
    ) as Record<DimensionId, typeof dimensionSchema>,
  ),
});

export type ResumeReview = z.infer<typeof reviewSchema>;
export type Suggestion = z.infer<typeof suggestionSchema>;

export type ReviewResponse =
  | { ok: true; review: ResumeReview }
  | { ok: false; error: string };

export const MAX_PDF_BYTES = 10 * 1024 * 1024;
export const API_KEY_HEADER = "x-openai-key";
