import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <div className="relative flex items-center justify-center h-[300px]">
      {/* Clipped image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('/KORAT-MONOGRAM-file (1)-05.png')`,
        }}
      ></div>
      {/* Overlay text */}
      <div className="relative flex items-center z-10 text-center">
      <Image
        src="/Korat_calendar.png"
        height={200}
        width={200}
        alt="Korat Calendar"
        className="rounded"
      />
        <h1 className="text-white text-4xl lg:text-8xl font-bold">
          KORAT CALENDAR
        </h1>
      </div>

      {/* Optional gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/0 z-[5]"></div>
    </div>
  );
}
