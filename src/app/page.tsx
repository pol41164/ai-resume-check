import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { DIMENSIONS, JOB_TYPES } from "@/lib/resume-review";

const STEPS = [
  {
    title: "貼上 OpenAI 金鑰",
    body: "金鑰只存在你自己的瀏覽器，分析時才會轉交給 OpenAI，我們不保存。",
  },
  {
    title: "上傳履歷、選職缺",
    body: "直接丟整份 PDF，不用複製貼上。選好想投的職缺類型，建議才會對準需求。",
  },
  {
    title: "拿到逐句批改",
    body: "每條建議都引用你的原句，說清楚問題在哪，並給出可以直接替換的改寫。",
  },
];

const DIMENSION_MARKS = ["契", "量", "字", "構"];

export default function Landing() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Steps />
        <Dimensions />
        <Sample />
        <Privacy />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="ruled relative overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pb-28">
        <div className="rise">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-raised px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            <span className="size-1.5 rounded-full bg-pen" />
            AI Resume Review
          </p>
          <h1 className="mt-6 font-serif text-[2.6rem] font-black leading-[1.15] tracking-tight sm:text-6xl lg:text-[4.2rem]">
            讓履歷的
            <span className="relative inline-block">
              每一句話
              <svg
                aria-hidden
                viewBox="0 0 300 20"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-pen sm:h-4"
              >
                <path
                  className="draw"
                  d="M4 14 C 70 4, 150 4, 296 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br />
            都站得住腳。
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-ink-soft">
            上傳 PDF、選擇想投的職缺。AI 像資深招募顧問一樣逐句批改：
            <strong className="font-medium text-ink">引用原句、指出問題、直接給你改寫版本</strong>。
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/check"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-pen px-7 py-3.5 text-base font-medium text-white shadow-[0_8px_24px_-8px] shadow-pen/60 transition hover:-translate-y-0.5"
            >
              開始健檢
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#how"
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-7 py-3.5 text-base text-ink-soft transition hover:border-ink hover:text-ink"
            >
              看看怎麼運作
            </a>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              ["4", "大檢查面向"],
              [String(JOB_TYPES.length), "種職缺類型"],
              ["1", "分鐘左右出結果"],
            ].map(([num, label]) => (
              <div key={label}>
                <dt className="font-serif text-3xl font-black">{num}</dt>
                <dd className="mt-1 text-xs text-ink-faint sm:text-sm">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <MockSheet />
      </div>
    </section>
  );
}

function MockSheet() {
  return (
    <div className="rise relative mx-auto w-full max-w-md [animation-delay:150ms] lg:max-w-none">
      <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-2xl border border-line bg-paper-sunken" />
      <div className="relative -rotate-1 rounded-2xl border border-line bg-paper-raised p-6 shadow-xl shadow-ink/5 sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="font-serif text-2xl font-black">王小明</p>
            <p className="mt-1 text-sm text-ink-faint">行銷專員 · 3 年經驗</p>
          </div>
          <span className="shrink-0 rotate-6 rounded-md border-2 border-pen px-2 py-1 font-serif text-sm font-black text-pen">
            已批改
          </span>
        </div>

        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          工作經歷
        </p>
        <ul className="mt-3 space-y-4 text-[15px] leading-7">
          <li>
            <span className="pen-strike text-ink-soft">負責公司社群經營與貼文發布</span>
            <span className="mt-2 block rounded-lg bg-fix-soft px-3 py-2 text-sm leading-6 text-fix">
              經營 IG 與 FB 粉專，半年內追蹤數成長 X%，單篇最高觸及 X 萬
            </span>
          </li>
          <li className="relative">
            <span className="pen-wavy">協助處理各種行銷相關事務</span>
            <span className="mt-2 flex items-start gap-2 text-sm leading-6 text-pen">
              <span aria-hidden className="mt-0.5 font-serif font-black">↳</span>
              太空泛，招募者看不出你實際做了什麼
            </span>
          </li>
          <li className="text-ink-soft">規劃年度品牌活動，帶領 3 人小組執行</li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-dashed border-line pt-5">
          {DIMENSIONS.map((d) => (
            <span
              key={d.id}
              className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft"
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHead({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pen">{kicker}</p>
      <h2 className="mt-3 font-serif text-3xl font-black leading-tight sm:text-4xl">
        {title}
      </h2>
      {body && <p className="mt-4 text-base leading-7 text-ink-soft sm:text-lg">{body}</p>}
    </div>
  );
}

function Steps() {
  return (
    <section id="how" className="scroll-mt-16 border-b border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHead kicker="How it works" title="三個步驟，一分鐘拿到批改。" />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="bg-paper-raised p-7 sm:p-8">
              <span className="font-serif text-5xl font-black text-pen/90">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 leading-7 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Dimensions() {
  return (
    <section className="border-b border-line bg-paper-sunken/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHead
          kicker="What we check"
          title="從招募者的四個視角，檢查每一句話。"
          body="不是籠統的「寫得不錯」，而是針對你想投的職缺，指出具體要改的地方。"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {DIMENSIONS.map((d, i) => (
            <article
              key={d.id}
              className="group relative overflow-hidden rounded-2xl border border-line bg-paper-raised p-7 transition hover:-translate-y-1 hover:border-ink/30 hover:shadow-lg hover:shadow-ink/5"
            >
              <span
                aria-hidden
                className="absolute -right-3 -top-6 font-serif text-[7rem] font-black leading-none text-paper-sunken transition group-hover:text-pen-soft"
              >
                {DIMENSION_MARKS[i]}
              </span>
              <p className="relative font-mono text-xs text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="relative mt-3 font-serif text-2xl font-black">{d.label}</h3>
              <p className="relative mt-3 leading-7 text-ink-soft">{d.hint}</p>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <p className="text-sm text-ink-faint">支援的職缺類型</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {JOB_TYPES.map((job) => (
              <span
                key={job.id}
                className="rounded-full border border-line bg-paper-raised px-3.5 py-1.5 text-sm"
              >
                {job.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Sample() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:py-28">
        <SectionHead
          kicker="Every suggestion"
          title="每一條建議，都有原句、問題、改法。"
          body="原句逐字引用，你一眼就知道是哪一段；改法盡量給出完整句子，複製就能換上。沒有的數字會用 X 標出，不會幫你捏造。"
        />
        <article className="rounded-2xl border border-line bg-paper-raised p-6 shadow-xl shadow-ink/5 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-pen-soft px-3 py-1 text-xs font-medium text-pen">
              成果量化
            </span>
            <span className="font-mono text-xs text-ink-faint">範例</span>
          </div>
          <SampleRow label="原句" tone="ink">
            <span className="marker">負責新產品上市的行銷企劃</span>
          </SampleRow>
          <SampleRow label="問題" tone="pen">
            只描述職責，沒有呈現規模或成果。行銷職缺的招募者會想知道你帶來多少效益。
          </SampleRow>
          <SampleRow label="改法" tone="fix">
            主導新品上市整合行銷，統籌 X 個通路，上市首月銷售額達 X 萬，超出目標 X%。
          </SampleRow>
        </article>
      </div>
    </section>
  );
}

function SampleRow({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "ink" | "pen" | "fix";
  children: React.ReactNode;
}) {
  const color = { ink: "text-ink-faint", pen: "text-pen", fix: "text-fix" }[tone];
  return (
    <div className="mt-5 grid gap-1.5 border-t border-line pt-5 sm:grid-cols-[4rem_1fr] sm:gap-4">
      <p className={`font-mono text-xs font-medium uppercase tracking-widest ${color}`}>
        {label}
      </p>
      <p className={`leading-7 ${tone === "fix" ? "font-medium text-fix" : ""}`}>{children}</p>
    </div>
  );
}

function Privacy() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-8 rounded-3xl bg-ink p-8 text-paper sm:p-12 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
          <span className="grid size-16 place-items-center rounded-2xl border border-paper/20 text-3xl">
            🔒
          </span>
          <div>
            <h2 className="font-serif text-2xl font-black sm:text-3xl">你的資料，只屬於你。</h2>
            <p className="mt-3 max-w-2xl leading-7 text-paper/70">
              API 金鑰只存在你這台電腦的瀏覽器裡。履歷與金鑰在分析當下轉交給 OpenAI，
              我們的伺服器不會留存任何一份。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="ruled">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <h2 className="font-serif text-4xl font-black leading-tight sm:text-5xl">
          下一次投遞前，
          <br className="sm:hidden" />
          先讓 AI 改一遍。
        </h2>
        <p className="mt-5 max-w-md text-ink-soft">準備好你的履歷 PDF，大約一分鐘就能看到結果。</p>
        <Link
          href="/check"
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-pen px-8 py-4 text-base font-medium text-white shadow-[0_8px_24px_-8px] shadow-pen/60 transition hover:-translate-y-0.5"
        >
          開始健檢
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}
