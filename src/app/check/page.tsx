import type { Metadata } from "next";
import { ApiKeyInput } from "@/components/api-key-input";
import { ResumeReviewForm } from "@/components/resume-review";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "開始健檢",
};

export default function CheckPage() {
  return (
    <>
      <SiteHeader cta={false} />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
          <header className="rise">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-pen">
              Resume check
            </p>
            <h1 className="mt-3 font-serif text-3xl font-black leading-tight sm:text-4xl">
              把履歷交給紅筆。
            </h1>
            <p className="mt-3 leading-7 text-ink-soft">
              上傳 PDF、選擇職缺，AI 會逐句引用原文，告訴你問題在哪、該怎麼改。
            </p>
          </header>
          <ApiKeyInput />
          <ResumeReviewForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
