import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "../SearchBar";
import { HeaderNavigation } from "./constants";
import { Avatar } from "../Avatar";

export const NavBar = () => {
  const [dataa, setDataa] = useState("");
  return (
    <nav className="sticky top-0 h-fit w-full bg-bright-white">
      <div className="flex px-0 lg:px-2">
        <Link href="/" className="self-center lg:self-auto">
          <Image
            src="/ShumiShumiLogo-Smaller.png"
            alt="ShumiShumi Logo"
            width="0"
            height="0"
            sizes="100vw"
            className="h-16 w-24 lg:h-24 lg:w-32"
          />
        </Link>
        <p className="hidden w-44 px-2 py-6 font-sans italic text-normal-blue lg:block">
          make getting into <br />a hobby easier!
        </p>

        {/* SearchBar Component here */}
        <div className="hidden grow self-center px-6 lg:block">
          <form>
            <SearchBar
              id="search_navbar"
              value={dataa}
              name="search_navbar"
              onChange={(e) => {
                setDataa(e.target.value);
              }}
            />
          </form>
        </div>

        <div className="ml-auto self-center">
          {/* Navigation Buttons */}
          <div className="flex ">
            {HeaderNavigation.map((item, index) => (
              <Link href={item.href} key={index} className="h-fit w-fit px-2">
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-4 flex self-center">
          {/* User Avatar */}
          <Avatar
            src="https://yt3.googleusercontent.com/kwT5VgMOSuYmGQif7clzISmM0xUYXdEQEDyZqBVL4_SQ1fTPtCpUj1xJlXtmuq7x9eY48EGrusI=s900-c-k-c0x00ffffff-no-rj"
            alt="harusnya millie"
            rounded
          />
        </div>
      </div>
      {/* NI DIBAWAH KLO KEKECILAN, pindahin search ke-bawah */}
      <div className="block px-1 lg:hidden">
        {/* <p className="text-white">Ceritanya searchbar klo kecil</p> */}
        <form>
          <SearchBar
            id="search_navbar"
            value={dataa}
            name="search_navbar"
            onChange={(e) => {
              setDataa(e.target.value);
            }}
          />
        </form>
      </div>
    </nav>
  );
};
