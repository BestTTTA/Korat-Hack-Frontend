"use client";

import React, { useState, useEffect, useRef } from "react";
import { EventClickArg, EventApi, EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import thLocale from "@fullcalendar/core/locales/th"; // Import Thai locale
import axios from "axios";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import Top5 from "./Top5";
import { EventType } from "../type/EventType";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import Link from "next/link";

const eventColors: Record<EventType, string> = {
  Festival: "bg-blue-500 border-blue-500",
  ArtandMusic: "bg-yellow-500 border-yellow-500",
  Sport: "bg-green-500 border-green-500",
  Food: "bg-red-500 border-red-500",
  custom: "bg-gray-500 border-gray-500",
};

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventInput[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventInput[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [eventFilter, setEventFilter] = useState<EventType | "all">("all"); 
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  const calendarRef = useRef<FullCalendar | null>(null);


  const fetchEvents = async () => {
    try {
      const response = await axios.get<{ event_entities: any[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}event/`
      );
      const eventsForCalendar: EventInput[] = response.data.event_entities.map((event) => ({
        title: event.Title || "No Title", 
        start: event.Start, 
        end: event.End, 
        extendedProps: {
          ...event,
          eventType: event.EventType || "custom",
        },
      }));

      setCurrentEvents(eventsForCalendar); 
      setFilteredEvents(eventsForCalendar); 
      setLoading(false);
    } catch (err) {
      // console.error("Failed to fetch events:", err);
      setError("Failed to fetch events");
      setLoading(false); // End loading even if there is an error
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch events when the component is mounted
  }, []);

  // Filter events based on selected event type
  const filterEvents = (filter: EventType | "all") => {
    if (filter === "all") {
      setFilteredEvents(currentEvents); // Show all events
    } else {
      const filtered = currentEvents.filter(
        (event) => event.extendedProps?.eventType === filter
      );
      setFilteredEvents(filtered);
    }
  };

  // When event filter is changed, filter the events
  useEffect(() => {
    filterEvents(eventFilter);
  }, [eventFilter, currentEvents]);

  // When an event is clicked, store the event details and open the modal
  const handleEventClick = (selected: EventClickArg) => {
    setSelectedEvent(selected.event); // Store the event details
    setIsDialogOpen(true); // Open the modal
    // console.log(selected);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
    setSelectedEvent(null); // Reset the selected event
  };

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
            <option value="ArtandMusic">Art & Music</option>
            <option value="Sport">Sport</option>
            <option value="Food">Food</option>
          </select>
        </div>

        {/* Calendar Section */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
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
            dayHeaderClassNames={() => "bg-orange-600 text-white font-bold rounded"}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={3}
            events={filteredEvents} 
            eventClick={handleEventClick}
            eventContent={(arg) => (
              <div
                className={`flex flex-col w-full rounded text-white ${eventColors[arg.event.extendedProps.eventType as EventType]}`}
              >
                <div className="flex justify-between items-center">
                  <span>{arg.event.title}</span>
                </div>
              </div>
            )}
            
            dayCellClassNames={() => "h-[120px]"} 
          />
        )}
      </div>

      {/* Events List Section */}
      <Top5 />

      {/* Dialog for showing event details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black rounded-lg p-0 shadow-lg bg-opacity-60 lg:h-auto border-0 border-black h-[700px] max-w-full w-[80%] md:w-[70%] lg:w-[80%] xl:w-[70%] mx-auto overflow-x-auto scrollbar-hide">
          {selectedEvent && (
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <img
                src={selectedEvent.extendedProps.Image}
                alt={selectedEvent.title}
                className="w-full lg:w-[50%] h-auto object-cover rounded-lg"
              />
              <div className=" flex flex-col p-4 lg:p-8 lg:pl-10 w-full lg:w-[50%]">
                <p className="text-2xl lg:text-4xl font-semibold text-white">
                  {selectedEvent.title}
                </p>
                <div className="flex items-center mt-4">
                  <FiCalendar size={30} color="white" className="mr-3" />
                  <p className="text-white">
                    <strong className="text-white">เวลาเริ่มงาน: </strong>
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
                      {/* -{" "}
                      {new Intl.DateTimeFormat("th-TH", {
                        hour: "numeric",
                        minute: "numeric",
                      }).format(selectedEvent.end!)} */}
                    </span>
                  </p>
                </div>

                <div className="flex items-center mt-4">
                  <FiMapPin size={30} color="white" className="mr-4" />
                  <Link
                    href={selectedEvent.extendedProps.LocationLink || "#"}
                    className="text-blue-600 underline "
                  >
                    สถานที่จัดงาน
                  </Link>
                </div>
                <p className="text-white mt-2">
                  {selectedEvent.extendedProps.Detail || "No description"}
                </p>
                <div className="flex w-full justify-end mt-2">
                  <button onClick={handleCloseDialog} className="px-4 py-2 bg-gray-500 text-white rounded">
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
