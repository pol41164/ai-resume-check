import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// CJK fonts are split into many unicode-range files; skip preloading them.
const notoSans = Noto_Sans_TC({
  variable: "--font-noto-sans",
  weight: ["400", "500", "700"],
  preload: false,
});

const notoSerif = Noto_Serif_TC({
  variable: "--font-noto-serif",
  weight: ["600", "900"],
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "AI 履歷健檢｜逐句批改你的履歷",
    template: "%s｜AI 履歷健檢",
  },
  description:
    "上傳履歷 PDF、選擇職缺，AI 逐句引用原文、指出問題並給出改寫建議。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
