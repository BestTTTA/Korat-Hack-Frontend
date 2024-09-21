"use client";

import { useState } from "react";
import { BiX } from "react-icons/bi";
import Image from "next/image";

export default function Donate() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed donate">
      <div className="fixed bg-orange-500 border bottom-4 right-4 rounded-full w-20 h-20 flex justify-center items-center shadow-lg drop-shadow-lg z-50">
        <button className="hover:scale-105" onClick={toggleDialog}>
          <Image
            src="/output-onlinegiftools.gif"
            alt="Running GIF"
            width={60}
            height={60}
            priority
            unoptimized
          />
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="p-6 bg-white relative w-fit h-96 rounded shadow-md drop-shadow-md ">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 "
              onClick={toggleDialog}
            >
              <BiX size={24} />
            </button>
            <div className="flex flex-col justify-center items-center p-2">
              <h2 className="text-sx font-bold mb-4">
                สนับสนุนค่ากาแฟเราได้ที่ QR Code ด่านล่างนี้เลย
              </h2>
              <Image
                src="/qr-code.png"
                height={300}
                width={200}
                alt="Qr code"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
