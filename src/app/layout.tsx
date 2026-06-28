import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "woojuLib · 가족 독서 기록",
  description: "온 가족이 함께 만드는 따뜻한 독서 기록 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans">{children}</body>
    </html>
  );
}
