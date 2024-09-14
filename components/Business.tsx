"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FiMapPin } from "react-icons/fi";
import Link from "next/link";

// กำหนดประเภทของ BusinessEntity
export interface BusinessEntity {
  ID: number;
  Title: string;
  Detail: string;
  Type: string;
  Location: string;
  Image: string;
  PageLink?: string; // ทำให้เป็น optional
}

export default function Business() {
  const [businesses, setBusinesses] = useState<BusinessEntity[]>([]); // เก็บข้อมูลธุรกิจ
  const [showAllBusinesses, setShowAllBusinesses] = useState(false); // Toggle state
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [error, setError] = useState<string | null>(null); // สถานะข้อผิดพลาด
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessEntity | null>(null); // เก็บธุรกิจที่ถูกเลือก
  const [isDialogOpen, setIsDialogOpen] = useState(false); // สถานะการเปิด/ปิด Dialog

  // ดึงข้อมูลธุรกิจจาก API
  const fetchBusinesses = async () => {
    try {
      const response = await axios.get<{ business_entities: BusinessEntity[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}business/` // ตรวจสอบ endpoint ให้ถูกต้อง
      );
      console.log('API response:', response.data); // ตรวจสอบข้อมูลที่ได้
      setBusinesses(response.data.business_entities || []); // ตรวจสอบว่าเป็น array หรือไม่
    } catch (err) {
      console.error("Failed to fetch businesses:", err);
      setError("ไม่สามารถดึงข้อมูลธุรกิจได้"); // ตั้งค่า error หากการร้องขอล้มเหลว
    } finally {
      setLoading(false); // ตั้งค่า loading เป็น false เมื่อการร้องขอเสร็จสิ้น
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // แสดงเฉพาะบางธุรกิจหรือทั้งหมดขึ้นอยู่กับ showAllBusinesses
  const businessesToShow = showAllBusinesses ? businesses : (businesses || []).slice(0, 6);

  // แสดงสถานะการโหลด
  if (loading) {
    return <div>Loading...</div>;
  }

  // แสดงสถานะ error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // ฟังก์ชันจัดการการคลิกธุรกิจ
  const handleBusinessClick = (business: BusinessEntity) => {
    setSelectedBusiness(business); // เก็บธุรกิจที่ถูกเลือก
    setIsDialogOpen(true); // เปิด Dialog
  };

  return (
    <div className="w-full p-10">
      <div className="text-3xl font-extrabold pt-8 pb-5 lg:text-left">
        <span>ธุรกิจชุมชน</span>
      </div>

      <ul className="flex flex-wrap gap-4">
        {businessesToShow.length <= 0 && (
          <div className="italic text-center text-gray-400">
            No Businesses Present
          </div>
        )}

        {businessesToShow.map((business) => (
          <li
            className="w-fit flex flex-col gap-3 cursor-pointer"
            key={business.ID}
            onClick={() => handleBusinessClick(business)}
          >
            <div className="w-[200px]">
              <div className="w-[200px] aspect-[3/4] overflow-hidden rounded-lg relative">
                <Image
                  src={business.Image}
                  alt={business.Title}
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
                  {business.Title}
                </h3>
                <p className="text-xs text-slate-950 mt-1">
                  {business.Type}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Dialog สำหรับแสดงรายละเอียดธุรกิจ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black rounded-lg p-0 shadow-lg bg-opacity-60 lg:h-auto border-0 border-black h-[700px] max-w-full w-[80%] md:w-[70%] lg:w-[80%] xl:w-[70%] mx-auto overflow-x-auto scrollbar-hide">
          {selectedBusiness && (
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <img
                src={selectedBusiness.Image}
                alt={selectedBusiness.Title}
                className="w-full lg:w-[50%] h-auto object-cover rounded-lg"
              />
              <div className="flex flex-col p-4 lg:p-8 lg:pl-10 w-full lg:w-[50%]">
                <p className="text-2xl lg:text-4xl font-semibold text-white">
                  {selectedBusiness.Title}
                </p>
                <div className="flex items-center mt-4">
                  <FiMapPin size={30} color="white" className="mr-4" />
                  <Link
                    href={selectedBusiness.Location || "#"}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ตำแหน่ง
                  </Link>
                </div>
                <p className="text-white mt-2">
                  {selectedBusiness.Detail || "No description"}
                </p>
                {selectedBusiness.PageLink && (
                  <div className="flex items-center mt-4">
                    <Link
                      href={selectedBusiness.PageLink}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ดูเพิ่มเติม
                    </Link>
                  </div>
                )}
                <div className="flex w-full justify-end mt-4">
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
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
          onClick={() => setShowAllBusinesses(!showAllBusinesses)}
          className="underline hover:text-orange-600 text-sm"
        >
          {showAllBusinesses ? "ดูน้อยลง" : "ดูเพิ่มเติม"}
        </button>
      </div>
    </div>
  );
}
