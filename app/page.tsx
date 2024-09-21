import Calendar from "@/components/Calendar";
import LatestEvent from "@/components/LatestEvent";
import Business from "@/components/Business";
import Map from "@/components/Map";
import Map3D from "@/components/Map3D";
import Footer from "@/components/Footer";
import Donate from "@/components/Donate";
import Head from "next/head";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col gap-14">
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
          property="og:image"
          content="/images/korat-calendar-og-image.jpg"
        />
        <meta
          property="og:url"
          content="https://korat.calendar.thetigerteamacademy.net"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Korat Calendar | ปฏิทินงานอีเว้นท์ในโคราช"
        />
        <meta
          name="twitter:description"
          content="ค้นหางานอีเว้นท์ในโคราชได้ง่ายๆ กับ Korat Calendar รวมข้อมูลงานและกิจกรรมทั้งหมดในโคราช"
        />
        <meta
          name="twitter:image"
          content="/images/korat-calendar-twitter-image.jpg"
        />

        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="Korat Calendar, ปฏิทินงานโคราช, งานอีเว้นท์โคราช, เทศกาลโคราช, งานอีเว้นท์, กิจกรรมโคราช"
        />
        <meta name="author" content="Korat Calendar Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Calendar />
      <Map3D />
      <Map />
      {/* <TestCache/> */}
      <LatestEvent />
      <Business />
      <Footer />
      <Donate />
    </main>
  );
}
