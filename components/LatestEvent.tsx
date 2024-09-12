"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { EventEntity } from "@/type/EventType";

export default function LatestEvent() {
  const [events, setEvents] = useState<EventEntity[]>([]); // Store original events
  const [showAllEvents, setShowAllEvents] = useState(false); // Toggle state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const response = await axios.get<{ event_entities: EventEntity[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}event/`
      );

      // Sort events by the start date (earliest first)
      const sortedEvents = response.data.event_entities.sort((a, b) => {
        const dateA = new Date(a.Start).getTime();
        const dateB = new Date(b.Start).getTime();
        return dateA - dateB; // Sort by the earliest start date
      });
      setEvents(sortedEvents); // Store sorted events
      console.log(sortedEvents); // For debugging purposes
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to fetch events"); // Set error if the request fails
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Show only the first 6 events by default on mobile/tablet
  const eventsToShow = showAllEvents ? events : events.slice(0, 6);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full border border-red-500 p-10">
      <div className="text-4xl md:text-5xl font-extrabold pt-8 pb-5 text-center lg:text-left">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
          อีเวนท์ที่ไกล้เข้ามา
        </span>
      </div>

      <ul className="space-y-4">
        {eventsToShow.length <= 0 && (
          <div className="italic text-center text-gray-400">No Events Present</div>
        )}

        {eventsToShow.map((event) => {
          const startDate = event.Start ? new Date(event.Start) : null;
          const endDate = event.End ? new Date(event.End) : null;
          let timeInfo = "ไม่สามารถคำนวณเวลาได้";

          // Calculate days or hours left until the event starts
          if (startDate) {
            const currentTime = new Date().getTime(); // Current time
            const eventTime = startDate.getTime(); // Event start time

            const timeDiff = eventTime - currentTime;
            if (timeDiff > 0) {
              const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Calculate days left
              if (daysLeft > 0) {
                timeInfo = `อีก ${daysLeft} วันก่อนอีเวนท์เริ่ม`;
              } else {
                const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60)); // Calculate hours if less than a day
                timeInfo = `อีก ${hoursLeft} ชั่วโมงก่อนอีเวนท์เริ่ม`;
              }
            } else {
              timeInfo = "อีเวนท์นี้ได้เริ่มต้นแล้ว";
            }
          }

          return (
            <li className="flex flex-col md:flex-row gap-3" key={event.ID}>
              <div className="w-full md:w-[30%] lg:w-[30%] aspect-[3/4] overflow-hidden rounded-lg">
                <img
                  src={event.Image}
                  alt={event.Title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex-1 mb-8">
                <h3 className="text-2xl font-extrabold text-orange-600">
                  {event.Title}
                </h3>
                <div className="text-xs text-slate-950 mt-1">
                  <span>
                    {startDate && !isNaN(startDate.getTime())
                      ? new Intl.DateTimeFormat("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(startDate)
                      : "Invalid start date"}
                  </span>
                  <span className="mx-2">-</span>
                  <span>
                    {endDate && !isNaN(endDate.getTime())
                      ? new Intl.DateTimeFormat("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(endDate)
                      : "Invalid end date"}
                  </span>
                </div>
                <p className="text-red-500 text-xs mt-2">
                  {timeInfo}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

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
