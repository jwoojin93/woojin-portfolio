import type { Metadata } from "next";
import { Roboto, Rubik_Scribble } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--roboto-text",
});

const rubick = Rubik_Scribble({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--rubick-text",
});

const metallica = localFont({
  src: "./metallica.ttf",
  variable: "--metallica-text",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Woojin's Portfolio",
    default: "Woojin's Portfolio",
  },
  description: "Sell and buy all the things!",
  metadataBase: new URL("https://r3f-nextjs.vercel.app/"), // TODO(Woojin): metadataBase 의 기능 알아보기.
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://r3f-nextjs.vercel.app/",
    title: "R3F & NextJS@13 😊",
    description: "Customize Model with your own style!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${roboto.variable} ${rubick.variable} ${metallica.variable} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
