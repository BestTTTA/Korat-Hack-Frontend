import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="flex flex-wrap bg-black p-2">
      <div className="flex justify-center items-center lg:w-fit w-full ">
        <Image
          src="/Tigerlogo.png"
          alt="Tiger logo"
          height={280}
          width={280}
          className="invert"
        />
      </div>
      <div className="flex flex-col flex-auto w-80 p-4">
        <h1 className="text-white text-2xl">Contact Us</h1>
        <Link
          href="https://www.facebook.com/thetigerteamacademy/"
          className="text-white flex items-center p-2 gap-x-2 pt-4"
        >
          <FaFacebookF size={25} color="white" />
          The Tiger Team Academy
        </Link>
        <Link
          href="https://mail.google.com/"
          className="text-white flex items-center p-2 gap-x-2"
        >
          <SiGmail size={22} color="white" />
          thetigerteamacademy@gmail.com
        </Link>
        <Link
          href="tel:0989162690"
          className="text-white flex items-center p-2 gap-x-2"
        >
          <FaPhoneAlt size={20} color="white" />
          098 916 2690
        </Link>
      </div>
      {/* <div className="flex flex-auto justify-center items-center w-80">
        1
      </div>
      <div className="flex flex-auto justify-center items-center w-80">
        1
      </div> */}
    </div>
  );
}
