import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans } from 'next/font/google'
import { Noto_Sans_Thai } from 'next/font/google'
import Head from "next/head";

const notosans = Noto_Sans({
  weight: '400',
  subsets: ['latin'],
});
const noto_sans_thai = Noto_Sans_Thai({ weight: '400', subsets: ['thai'] })

export const metadata: Metadata = {
  title: "Korat Calendar",
  description: "Thetigerteamacademy(TTTA) with Korat Head",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${noto_sans_thai.className}`}>
      <Head>
        <title>Korat Calendar | ปฏิทินงานอีเว้นท์ในโคราช</title>
        <meta
          name="description"
          content="เว็บไซท์ Korat Calendar ใช้เป็นปฏิทินงานอีเว้นท์และกิจกรรมต่างๆ ในโคราช ค้นหางาน event ที่เกิดขึ้นในพื้นที่ง่ายๆ ด้วยเว็บของเรา ไม่ว่าจะเป็นงานเทศกาล งานสาธารณะ หรือกิจกรรมส่วนตัว ทุกข้อมูลอยู่ที่นี่"
        />
        <meta
          property="og:title"
          content="Korat Calendar | ปฏิทินงานอีเว้นท์ในโคราช"
        />
        <meta
          property="og:description"
          content="ติดตามและค้นหางานอีเว้นท์หรือกิจกรรมต่างๆ ในโคราชได้ง่ายๆ บน Korat Calendar ดูรายละเอียดของกิจกรรมและสถานที่จัดงานทั้งหมดในที่เดียว"
        />
        <meta
          property="og:url"
          content="https://korat.calendar.thetigerteamacademy.net"
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="Korat Calendar, ปฏิทินงานโคราช, งานอีเว้นท์โคราช, เทศกาลโคราช, งานอีเว้นท์, กิจกรรมโคราช"
        />
        <meta name="author" content="Korat Calendar Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
        {children}
      </body>
    </html>
  );
}
