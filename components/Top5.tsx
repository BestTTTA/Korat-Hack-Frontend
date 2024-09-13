"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { EventEntity, EventType } from "@/type/EventType";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import Link from "next/link";

export default function Top5() {
  const [events, setEvents] = useState<EventEntity[]>([]); // Store original events
  const [filteredEvents, setFilteredEvents] = useState<EventEntity[]>([]); // Store filtered events
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [selectedEvent, setSelectedEvent] = useState<EventEntity | null>(null); // State for the selected event
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog open/close

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

  // Handle event click to open the dialog
  const handleEventClick = (event: EventEntity) => {
    setSelectedEvent(event); // Set the selected event
    setIsDialogOpen(true); // Open the dialog
  };

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
          5 อีเวนท์ยอดฮิต
        </span>
      </div>
      <ul className="space-y-4">
        {filteredEvents.length <= 0 && (
          <div className="italic text-center text-gray-400">No Events Present</div>
        )}
        {filteredEvents.slice(0, 5).map((event) => {
          const startDate = event.Start ? new Date(event.Start) : null;
          const endDate = event.End ? new Date(event.End) : null;
          return (
            <li
              className="flex flex-col md:flex-row gap-3 cursor-pointer"
              key={event.ID}
              onClick={() => handleEventClick(event)} // Open dialog on event click
            >
              <div className="w-full md:w-[30%] lg:w-[30%] aspect-[3/4] overflow-hidden rounded-lg relative">
                <Image
                  src={event.Image}
                  alt={event.Title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                  priority={false}
                  placeholder="blur"
                  blurDataURL="/blur.avif"
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

      {/* Dialog for displaying selected event */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black rounded-lg p-0 shadow-lg bg-opacity-60 lg:h-auto border-0 border-black h-[700px] max-w-full w-[80%] md:w-[70%] lg:w-[80%] xl:w-[70%] mx-auto overflow-x-auto scrollbar-hide">
          {selectedEvent && (
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <img
                src={selectedEvent.Image}
                alt={selectedEvent.Title}
                className="w-full lg:w-[50%] h-auto object-cover rounded-lg"
              />
              <div className="flex flex-col p-4 lg:p-8 lg:pl-10 w-full lg:w-[50%]">
                <p className="text-2xl lg:text-4xl font-semibold text-white">
                  {selectedEvent.Title}
                </p>
                <div className="flex items-center mt-4">
                  <FiCalendar size={30} color="white" className="mr-3" />
                  <p className="text-white">
                    <strong className="text-white">เวลาเริ่มงาน: </strong>
                    {new Intl.DateTimeFormat("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(selectedEvent.Start))}
                    <br />
                    <span>
                      {new Intl.DateTimeFormat("th-TH", {
                        hour: "numeric",
                        minute: "numeric",
                      }).format(new Date(selectedEvent.Start))}{" "}
                    </span>
                  </p>
                </div>

                <div className="flex items-center mt-4">
                  <FiMapPin size={30} color="white" className="mr-4" />
                  <Link href={selectedEvent.LocationLink || "#"} className="text-blue-600 underline">
                    สถานที่จัดงาน
                  </Link>
                </div>
                <p className="text-white mt-2">{selectedEvent.Detail || "No description"}</p>
                <div className="flex w-full justify-end mt-2">
                  <button onClick={() => setIsDialogOpen(false)} className="text-white">
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
