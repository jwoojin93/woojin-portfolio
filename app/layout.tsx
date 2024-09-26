import type { Metadata } from "next";
import { Roboto, Rubik_Scribble } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/**
 * roboto font 를 구글에서 가져옵니다.
 */
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--roboto-text",
});

/**
 * rubic scribble font 를 구글에서 가져옵니다.
 */
const rubick = Rubik_Scribble({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--rubick-text",
});

/**
 * motelica font 를 로컬에서 가져옵니다.
 */
const metallica = localFont({
  src: "./metallica.ttf",
  variable: "--metallica-text",
});

/**
 * 메타데이터를 설정합니다
 */
export const metadata: Metadata = {
  title: {
    template: "%s | Woojin's Portfolio",
    default: "Woojin's Portfolio",
  },
  description: "Sell and buy all the things!",
  metadataBase: new URL("https://woojin-portfolio.vercel.app/"), // TODO(Woojin): metadataBase 의 기능 알아보기.
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://woojin-portfolio.vercel.app/",
    title: "Woojin's Portfolio 😊",
    description: "프론트엔드 개발자 정우진의 포트폴리오 웹사이트 입니다",
  },
  verification: {
    google: "eJpF2_QHH6srMdkl5VsVKgIyIFljeBkoD4YpKQ-7C5s",
  },
};

/**
 * 공용 레이아웃을 설정합니다.
 * @param param0
 * @returns
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${rubick.variable} ${metallica.variable} bg-neutral-100 text-black`}
      >
        <header className="fixed top-0 left-0" id="header-portal" />
        <main className="w-full h-full flex justify-center">
          <div className="max-w-[800px] w-full h-full p-5">{children}</div>
        </main>
      </body>
    </html>
  );
}
