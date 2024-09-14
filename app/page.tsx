import Calendar from "@/components/Calendar";
import LatestEvent from "@/components/LatestEvent";
import Business from "@/components/Business";
import Map from "@/components/Map";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col gap-14">
      <Calendar />
      {/* <Map/> */}
      <LatestEvent />
      <Business />
    </main>
  );
}
