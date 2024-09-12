"use client";

import React, { useState } from "react";
import Image from "next/image";
import mockEvents from "./_mock_/Mock";

export default function LatestEvent() {
  const [showAllEvents, setShowAllEvents] = useState(false);

  // Show only the first 6 events by default on mobile/tablet
  const eventsToShow = showAllEvents ? mockEvents : mockEvents.slice(0, 6);

  return (
    <div className="flex flex-col w-full px-4 lg:px-10 justify-start items-start">
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-orange-600">
          อีเวนท์ที่ไกล้เข้ามา
        </h1>
      </div>

      {/* Responsive grid for events */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {eventsToShow.slice(0, 12).map((event) => {
          const startDate = event.start ? new Date(event.start) : null;
          const endDate = event.end ? new Date(event.end) : null;
          return (
            <li
              className="flex flex-col w-54 items-center bg-slate-50 border rounded-lg border-gray-200 shadow-md p-4"
              key={event.id}
            >
              <div className=" md:w-[50%] lg:w-[50%] h-auto">
                <img
                  src={event.image}
                  alt=""
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-between h-full mt-2">
                <p className="text-orange-600 font-bold text-lg">
                  {event.title}
                </p>
                <div className="flex flex-col text-xs text-slate-950 gap-1">
                  <label>
                    {startDate && !isNaN(startDate.getTime())
                      ? new Intl.DateTimeFormat("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(startDate)
                      : "Invalid start date"}
                  </label>
                  <label>
                    {endDate && !isNaN(endDate.getTime())
                      ? new Intl.DateTimeFormat("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(endDate)
                      : "Invalid end date"}
                  </label>
                </div>
                <p className="text-red-500 text-xs mt-2">
                  อีก 1 วันก่อนอีเวนท์เริ่ม
                </p>
              </div>
            </li>
          );
        })}
      </div>

      {/* Toggle between "ดูเพิ่มเติม" and "ดูน้อยลง" */}
      <div className="flex w-full justify-center mt-6">
        <button
          onClick={() => setShowAllEvents(!showAllEvents)}
          className="underline hover:text-orange-600 text-sm"
        >
          {showAllEvents ? "ดูน้อยลง" : "ดูเพิ่มเติม"}
        </button>
      </div>
    </div>
  );
}
