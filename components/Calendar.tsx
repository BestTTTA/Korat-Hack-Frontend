"use client";

import React, { useState, useEffect, useRef } from "react";
import { EventClickArg, EventApi } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import thLocale from "@fullcalendar/core/locales/th"; // Import Thai locale
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Top5 from "./Top5";
import mockEvents from "./_mock_/Mock";
import Image from "next/image";
import { EventType } from "../type/EventType";
import { FiCalendar } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";
import Link from "next/link";

const eventColors: Record<EventType, string> = {
  Festival: "bg-blue-500 border-blue-500",
  ArtandMusic: "bg-yellow-500 border-yellow-500",
  Sport: "bg-green-500 border-green-500",
  Food: "bg-red-500 border-red-500",
  custom: "bg-gray-500 border-gray-500",
};

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents); // Store filtered events
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [eventFilter, setEventFilter] = useState<EventType | "all">("all"); // Filter state
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null); // Store clicked event details

  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  // When an event is clicked, store the event details and open the modal
  const handleEventClick = (selected: EventClickArg) => {
    setSelectedEvent(selected.event); // Store the event details
    setIsDialogOpen(true); // Open the modal
    console.log(selected);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
    setSelectedEvent(null); // Reset the selected event
  };

  // Filter events based on selected event type
  const filterEvents = (filter: EventType | "all") => {
    if (filter === "all") {
      setFilteredEvents(mockEvents); // Show all events
    } else {
      const filtered = mockEvents.filter((event) => event.eventType === filter);
      setFilteredEvents(filtered);
    }
  };

  // When event filter is changed, filter the events
  useEffect(() => {
    filterEvents(eventFilter);
  }, [eventFilter]);

  return (
    <div className="flex flex-col lg:flex-row w-full px-4 lg:px-10 justify-start items-start gap-8">
      {/* Filter Section */}
      <div className="w-full lg:w-9/12 mt-8">
        <div className="mb-4">
          <label htmlFor="filter" className="text-xl font-semibold mb-2">
            ประเภทของงานอีเวนท์:
          </label>
          <select
            id="filter"
            className="ml-2 p-2 border border-gray-300 rounded-lg"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value as EventType)}
          >
            <option value="all">ทั้งหมด</option>
            <option value="Festival">Festival</option>
            <option value="ArtandMusic">ArtandMusic</option>
            <option value="Sport">Sport</option>
            <option value="Food">Food</option>
          </select>
        </div>

        {/* Calendar Section */}
        <FullCalendar
          ref={calendarRef}
          contentHeight={"auto"} // Makes sure the calendar adjusts its content height dynamically
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          locale={thLocale}
          moreLinkText={(num) => `+${num} เพิ่มเติม`}
          headerToolbar={{
            right: "today prev,next",
            center: "title",
            left: "",
          }}
          dayHeaderClassNames={() => {
            return "bg-orange-600 text-white font-bold rounded";
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={3}
          events={filteredEvents}
          eventClick={handleEventClick}
          eventContent={(arg) => {
            return (
              <div
                className={`flex w-full rounded items-center overflow-hidden text-[10px] p-1 text-white ${
                  eventColors[arg.event.extendedProps.eventType as EventType]
                }`}
              >
                <span>{arg.event.title}</span>
              </div>
            );
          }}
          dayCellClassNames={() => {
            return "h-[120px]"; 
          }}
        />
      </div>

      {/* Events List Section */}
      <Top5 />

      {/* Dialog for showing event details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black rounded-lg p-0 shadow-lg bg-opacity-60 border-0 border-black max-w-full w-[80%] md:w-[90%] lg:w-[90%] xl:w-[80%] mx-auto">
          {selectedEvent && (
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <img
                src={selectedEvent.extendedProps.image}
                alt=""
                className="w-full lg:w-[50%] h-auto object-cover rounded-lg"
              />
              <div className=" flex flex-col p-4 lg:p-8 lg:pl-10 w-full lg:w-[50%]">
                <p className="text-4xl font-semibold text-white">
                  {selectedEvent.title}
                </p>
                <div className="flex items-center mt-4">
                  <FiCalendar size={30} color="white" className="mr-3" />
                  <p className="text-white">
                    <strong className="text-white">เวลาเรื่มงาน: </strong>
                    {new Intl.DateTimeFormat("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(selectedEvent.start!)}
                    <br />
                    <span>
                      {new Intl.DateTimeFormat("th-TH", {
                        hour: "numeric",
                        minute: "numeric",
                      }).format(selectedEvent.start!)}{" "}
                      -{" "}
                      {new Intl.DateTimeFormat("th-TH", {
                        hour: "numeric",
                        minute: "numeric",
                      }).format(selectedEvent.end!)}
                    </span>
                  </p>
                </div>

                <div className="flex items-center mt-4">
                  <FiMapPin size={30} color="white" className="mr-4" />
                  <Link
                    href={selectedEvent.extendedProps.location_link}
                    className="text-blue-600 underline "
                  >
                    สถานที่จัดงาน
                  </Link>
                </div>
                <p className="text-white mt-2 h-60 overflow-x-auto scrollbar-hide">
                  {selectedEvent.extendedProps.detail || "No description"}
                </p>
                <div className="flex w-full justify-end mt-2">
                  <button onClick={handleCloseDialog} className="text-white">
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
};

export default Calendar;
