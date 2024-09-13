import React, { useEffect, useState } from "react";
import axios from "axios";
import { EventEntity } from "@/type/EventType";
import { EventType } from "@/type/EventType";
import Image from "next/image";

export default function Top5() {
  const [events, setEvents] = useState<EventEntity[]>([]); // Store original events
  const [filteredEvents, setFilteredEvents] = useState<EventEntity[]>([]); // Store filtered events
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const fetchEvents = async () => {
    try {
      const response = await axios.get<{ event_entities: EventEntity[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}event/`
      );
      setEvents(response.data.event_entities); // Store the original events
      setFilteredEvents(response.data.event_entities); // Set fetched events
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to fetch events"); // Set error if the request fails
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  // Filter events based on selected event type
  const filterEvents = (filter: EventType | "all", events: EventEntity[]) => {
    if (filter === "all") {
      setFilteredEvents(events); // Show all events
    } else {
      const filtered = events.filter((event) => event.EventType === filter);
      setFilteredEvents(filtered);
    }
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
              <div className="w-full md:w-[30%] lg:w-[30%] aspect-[3/4] overflow-hidden rounded-lg">
                <img
                  src={event.Image}
                  alt=""
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
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
