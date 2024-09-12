import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans } from 'next/font/google'
import { Noto_Sans_Thai } from 'next/font/google'

const notosans = Noto_Sans({
  weight: '400',
  subsets: ['latin'],
});
const noto_sans_thai = Noto_Sans_Thai({ weight: '400', subsets: ['thai'] })

export const metadata: Metadata = {
  title: "Calender",
  description: "Thetigerteamacademy(TTTA)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${noto_sans_thai.className}`}>
        {children}
      </body>
    </html>
  );
}
