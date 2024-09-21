import Calendar from "@/components/Calendar";
import LatestEvent from "@/components/LatestEvent";
import Business from "@/components/Business";
import Map from "@/components/Map";
import TestCache from "@/components/Testcache";
import Map3D from "@/components/Map3D";
import Footer from "@/components/Footer";
import Donate from "@/components/Donate";
export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col gap-14"
    >
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
