"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { EventEntity, EventType } from "@/type/EventType";
import Image from "next/image";

export default function Top5() {
  const [events, setEvents] = useState<EventEntity[]>([]); // Store original events
  const [filteredEvents, setFilteredEvents] = useState<EventEntity[]>([]); // Store filtered events
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Function to sort events: Upcoming Events first, Past Events later
  const sortEvents = (events: EventEntity[]): EventEntity[] => {
    const now = new Date();
    return events.sort((a, b) => {
      const aEnd = a.End ? new Date(a.End) : new Date(0); // If no End date, consider as Past Event
      const bEnd = b.End ? new Date(b.End) : new Date(0);

      const aIsUpcoming = aEnd >= now;
      const bIsUpcoming = bEnd >= now;

      if (aIsUpcoming && !bIsUpcoming) return -1; // a comes before b
      if (!aIsUpcoming && bIsUpcoming) return 1; // b comes before a
      // If both are in the same group, sort by Start date ascending
      return new Date(a.Start).getTime() - new Date(b.Start).getTime();
    });
  };

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const response = await axios.get<{ event_entities: EventEntity[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}event/`
      );

      // Sort events by upcoming first, then past
      const sortedEvents = sortEvents(response.data.event_entities);
      setEvents(sortedEvents); // Store sorted events
      setFilteredEvents(sortedEvents); // Initialize filtered events
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("ไม่สามารถดึงข้อมูลเหตุการณ์ได้"); // Set error message
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Filter events based on selected event type
  const filterEvents = (filter: EventType | "all", events: EventEntity[]) => {
    let filtered: EventEntity[];
    if (filter === "all") {
      filtered = events;
    } else {
      filtered = events.filter((event) => event.EventType === filter);
    }
    const sortedFiltered = sortEvents(filtered); // Sort filtered events
    setFilteredEvents(sortedFiltered);
  };

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full lg:w-3/12 px-4 lg:px-0">
      <div className="text-4xl md:text-5xl font-extrabold pt-8 pb-5 text-center lg:text-left">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
          5 อันดับมาแรง
        </span>
      </div>
      <ul className="space-y-4">
        {filteredEvents.length <= 0 && (
          <div className="italic text-center text-gray-400">
            No Events Present
          </div>
        )}
        {filteredEvents.slice(0, 5).map((event) => {
          const startDate = event.Start ? new Date(event.Start) : null;
          const endDate = event.End ? new Date(event.End) : null;
          return (
            <li className="flex flex-col md:flex-row gap-3" key={event.ID}>
              <div className="w-full md:w-[30%] lg:w-[30%] aspect-[3/4] overflow-hidden rounded-lg relative">
                {/* ใช้ <Image /> จาก next/image สำหรับประสิทธิภาพที่ดีขึ้น */}
                <Image
                  src={event.Image}
                  alt={event.Title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                  priority={false} // ตั้งค่าเป็น true สำหรับรูปภาพที่สำคัญที่สุด
                  placeholder="blur" // ใช้ placeholder แบบ blur สำหรับประสบการณ์การโหลดที่ดีขึ้น
                  blurDataURL="/blur.avif" // เพิ่ม blurDataURL ถ้ามี
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
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
