import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span className="relative grid size-8 place-items-center rounded-md border border-ink bg-paper-raised font-serif text-sm font-black">
        履
        <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-pen transition-transform group-hover:scale-125" />
      </span>
      <span className="font-serif text-base font-black tracking-wide">
        履歷健檢
      </span>
    </Link>
  );
}

export function SiteHeader({ cta = true }: { cta?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        {cta && (
          <Link
            href="/check"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-pen"
          >
            開始健檢
          </Link>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Logo />
        <p>履歷與金鑰都不會保存在我們的伺服器上。</p>
      </div>
    </footer>
  );
}
