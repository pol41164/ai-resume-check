import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import {
  API_KEY_HEADER,
  DIMENSIONS,
  MAX_PDF_BYTES,
  findJobType,
  reviewSchema,
  type ReviewResponse,
} from "@/lib/resume-review";

const MODEL = "gpt-5.5";

// Reading a whole PDF and writing structured feedback can take a while.
export const maxDuration = 120;

function fail(status: number, error: string) {
  return Response.json({ ok: false, error } satisfies ReviewResponse, {
    status,
  });
}

function buildInstructions(jobLabel: string) {
  const dimensionLines = DIMENSIONS.map(
    (d) => `- ${d.id}（${d.label}）：${d.hint}`,
  ).join("\n");

  return `你是資深招募顧問，正在幫求職者優化應徵「${jobLabel}」職缺的履歷。

請閱讀附件中的整份履歷 PDF，從以下面向給出優化建議：
${dimensionLines}

規則：
1. 每一條建議的 quote 必須是履歷中真實存在的原句，逐字照抄（含原本的語言與標點），不可改寫、翻譯或拼湊。若問題是「缺少某內容」，quote 填最相關的原句。
2. problem 要具體說明問題，並連結到「${jobLabel}」這個職缺的需求。
3. fix 要可直接執行；能改寫時給出完整改寫句。原句沒有的數字請用「X」等佔位符，不可捏造事實。
4. 每個面向給 0 到 5 條，依重要性排序；同一句話不要在不同面向重複出現。
5. 全部用繁體中文回覆（quote 除外，保持原文）。`;
}

export async function POST(request: Request) {
  const apiKey = request.headers.get(API_KEY_HEADER)?.trim();
  if (!apiKey) return fail(401, "缺少 OpenAI API Key，請先在上方儲存金鑰。");

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "請用表單上傳履歷檔案。");
  }

  const file = form.get("file");
  const job = findJobType(String(form.get("jobType") ?? ""));

  if (!(file instanceof File) || file.size === 0) {
    return fail(400, "請上傳履歷 PDF。");
  }
  if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
    return fail(400, "目前只支援 PDF 檔。");
  }
  if (file.size > MAX_PDF_BYTES) {
    return fail(413, "檔案太大，請上傳 10MB 以內的 PDF。");
  }
  if (!job) return fail(400, "請選擇職缺類型。");

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const client = new OpenAI({ apiKey });

  try {
    const response = await client.responses.parse({
      model: MODEL,
      instructions: buildInstructions(job.label),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              filename: file.name || "resume.pdf",
              file_data: `data:application/pdf;base64,${base64}`,
            },
            {
              type: "input_text",
              text: `請針對「${job.label}」職缺檢查這份履歷。`,
            },
          ],
        },
      ],
      text: { format: zodTextFormat(reviewSchema, "resume_review") },
    });

    const review = response.output_parsed;
    if (!review) return fail(502, "AI 沒有回傳可用的結果，請再試一次。");

    return Response.json({ ok: true, review } satisfies ReviewResponse);
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401) return fail(401, "API Key 無效，請確認後重新儲存。");
      if (err.status === 429) {
        return fail(429, "OpenAI 額度不足或請求太頻繁，請稍後再試。");
      }
      if (err.status === 400) {
        return fail(400, "OpenAI 無法讀取這份 PDF，請確認檔案沒有加密或損壞。");
      }
    }
    console.error("[api/review]", err);
    return fail(502, "呼叫 OpenAI 時發生錯誤，請稍後再試。");
  }
}
