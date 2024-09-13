"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { EventEntity } from "@/type/EventType";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import Link from "next/link";

export default function LatestEvent() {
  const [events, setEvents] = useState<EventEntity[]>([]); // เก็บเหตุการณ์ต้นฉบับ
  const [showAllEvents, setShowAllEvents] = useState(false); // Toggle state
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [error, setError] = useState<string | null>(null); // สถานะข้อผิดพลาด
  const [selectedEvent, setSelectedEvent] = useState<EventEntity | null>(null); // เก็บเหตุการณ์ที่ถูกเลือก
  const [isDialogOpen, setIsDialogOpen] = useState(false); // สถานะการเปิด/ปิด Dialog

  // ฟังก์ชันสำหรับจัดเรียงเหตุการณ์: Upcoming Events อยู่ด้านบน, Past Events อยู่ด้านล่าง
  const sortEvents = (events: EventEntity[]): EventEntity[] => {
    const now = new Date();
    return events.sort((a, b) => {
      const aEnd = a.End ? new Date(a.End) : new Date(0); // ถ้าไม่มี End ให้ถือว่าเป็น Past Event
      const bEnd = b.End ? new Date(b.End) : new Date(0);

      const aIsUpcoming = aEnd >= now;
      const bIsUpcoming = bEnd >= now;

      if (aIsUpcoming && !bIsUpcoming) return -1; // a อยู่ด้านบน
      if (!aIsUpcoming && bIsUpcoming) return 1; // b อยู่ด้านบน
      // ถ้าอยู่ในกลุ่มเดียวกัน จัดเรียงตามวันที่เริ่มต้นจากเร็วไปช้า
      return new Date(a.Start).getTime() - new Date(b.Start).getTime();
    });
  };

  // ดึงข้อมูลเหตุการณ์จาก API
  const fetchEvents = async () => {
    try {
      const response = await axios.get<{ event_entities: EventEntity[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}event/`
      );

      // จัดเรียงเหตุการณ์โดยเรียกใช้ sortEvents
      const sortedEvents = sortEvents(response.data.event_entities);
      setEvents(sortedEvents); // เก็บเหตุการณ์ที่จัดเรียงแล้ว
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("ไม่สามารถดึงข้อมูลเหตุการณ์ได้"); // ตั้งค่า error หากการร้องขอล้มเหลว
    } finally {
      setLoading(false); // ตั้งค่า loading เป็น false เมื่อการร้องขอเสร็จสิ้น
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // แสดงเฉพาะบางเหตุการณ์หรือทั้งหมดขึ้นอยู่กับ showAllEvents
  const eventsToShow = showAllEvents ? events : events.slice(0, 6);

  // แสดงสถานะการโหลด
  if (loading) {
    return <div>Loading...</div>;
  }

  // แสดงสถานะ error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // ฟังก์ชันจัดการการคลิกเหตุการณ์
  const handleEventClick = (event: EventEntity) => {
    setSelectedEvent(event); // เก็บเหตุการณ์ที่ถูกเลือก
    setIsDialogOpen(true); // เปิด Dialog
  };

  return (
    <div className="w-full p-10">
      <div className="text-3xl font-extrabold pt-8 pb-5 lg:text-left">
        <span>อีเวนท์ที่ไกล้เข้ามา</span>
      </div>

      <ul className="flex flex-wrap gap-4">
        {eventsToShow.length <= 0 && (
          <div className="italic text-center text-gray-400">
            No Events Present
          </div>
        )}

        {eventsToShow.map((event) => {
          const startDate = event.Start ? new Date(event.Start) : null;
          const endDate = event.End ? new Date(event.End) : null;
          let timeInfo = "ไม่สามารถคำนวณเวลาได้";

          if (startDate) {
            const currentTime = new Date().getTime(); 
            const eventTime = startDate.getTime(); 

            const timeDiff = eventTime - currentTime;
            if (timeDiff > 0) {
              const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); 
              if (daysLeft > 0) {
                timeInfo = `อีก ${daysLeft} วันก่อนอีเวนท์เริ่ม`;
              } else {
                const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60)); 
                timeInfo = `อีก ${hoursLeft} ชั่วโมงก่อนอีเวนท์เริ่ม`;
              }
            } else {
              timeInfo = "อีเวนท์นี้ได้เริ่มต้นแล้ว";
            }
          }

          return (
            <li
              className="w-fit flex flex-col gap-3 cursor-pointer"
              key={event.ID}
              onClick={() => handleEventClick(event)} 
            >
              <div className="w-[200px]">
                <div className="w-[200px] aspect-[3/4] overflow-hidden rounded-lg relative">
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
                <div className="flex flex-col mb-8 mt-1">
                  <h3 className="lg:text-xl font-extrabold text-orange-600">
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
                  <p className="text-red-500 text-xs mt-2">{timeInfo}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Dialog สำหรับแสดงรายละเอียดเหตุการณ์ */}
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
                  <Link
                    href={selectedEvent.LocationLink || "#"}
                    className="text-blue-600 underline"
                  >
                    สถานที่จัดงาน
                  </Link>
                </div>
                <p className="text-white mt-2">
                  {selectedEvent.Detail || "No description"}
                </p>
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
