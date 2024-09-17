"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { EventEntity, EventType } from "@/type/EventType";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import Link from "next/link";

// Function to geocode LocationLink into coordinates
const geocodeLocation = async (locationLink: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        locationLink
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.results && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error("Geocoding failed", data);
      return null;
    }
  } catch (err) {
    console.error("Error geocoding location:", err);
    return null;
  }
};

export default function Top5() {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventEntity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get<{ event_entities: EventEntity[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}event/`
      );
      const eventsWithCoords = await Promise.all(
        response.data.event_entities.map(async (event) => {
          // Check if event has LocationLink and fetch coordinates
          if (event.LocationLink) {
            const coords = await geocodeLocation(event.LocationLink);
            if (coords) {
              return { ...event, Latitude: coords.lat, Longitude: coords.lng };
            }
          }
          return event; // Return event without modifying if no LocationLink
        })
      );
      setEvents(eventsWithCoords);
      setFilteredEvents(eventsWithCoords);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("ไม่สามารถดึงข้อมูลเหตุการณ์ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (event: EventEntity) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
              onClick={() => handleEventClick(event)}
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
