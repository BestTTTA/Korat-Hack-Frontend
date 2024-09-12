import Calendar from "@/components/Calendar";
import LatestEvent from "@/components/LatestEvent";

export default function Home() {
  return (
<main className="min-h-screen bg-white flex flex-col gap-14">
  <Calendar/>
  <LatestEvent/>
</main>
  );
}
