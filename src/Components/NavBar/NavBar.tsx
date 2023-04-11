import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "../SearchBar";
import { HeaderNavigation } from "./constants";
import { Avatar } from "../Avatar";
import { AutoComplete } from "../AutoComplete";
import { NonLoginHeaderNav } from "./nonlogin_constants";

export const NavBar = () => {
  const [dataa, setDataa] = useState("");

  //---> nge set apakh usernya dah login ato belom <---
  const [isLoggedIn, setIsLoggedIn] = useState(true); //default state true
  //-----------------------><-------------------------

  return (
    <nav className="sticky top-0 h-fit w-full bg-white shadow-lg">
      <div className="flex px-0 py-1 lg:px-2 lg:py-2">
        <Link href="/" className="self-center lg:self-auto">
          <Image
            src="/Logo-without-text-color-fixed-small.png"
            alt="ShumiShumi Logo"
            width="0"
            height="0"
            sizes="100vw"
            className="h-16 w-24 lg:h-24 lg:w-32"
          />
        </Link>
        <p className="hidden w-44 px-2 py-6 font-sans font-semibold italic text-normal-blue lg:block">
          Make getting into <br />a hobby easier!
        </p>

        {/* SearchBar Component here */}
        <div className="hidden grow self-center px-6 lg:block">
          <AutoComplete
            id="search_navbar"
            name="search_navbar"
            // Contoh pake autoCompleteOnChange
            // autoCompleteOnChange={(e) => {
            //   setDataa(e.target.value);
            //   console.log(e.target.value, "A");
            // }}
          />
        </div>

        <div className="ml-auto self-center">
          {/* Navigation Buttons */}
          <div className="flex ">
            {/*--- Bwt munculin Navigation Buttons nya ---*/}
            {/* {HeaderNavigation.map((item, index) => (
              <Link href={item.href} key={index} className="h-fit w-fit px-2">
                {item.icon}
              </Link>
            ))} */}

            {/*===> CONDITIONAL STATEMENT KALO USER DAH LOGIN/BELOM (By default statement nya gw set ke true) <=== */}
            {/*--- Rubah2 aja lagi nanti ---*/}
            {isLoggedIn
              ? HeaderNavigation.map(
                  (
                    item,
                    index //Kalo user udh login render ini
                  ) => (
                    <Link
                      href={item.href}
                      key={index}
                      className="h-fit w-fit px-2"
                    >
                      {item.icon}
                    </Link>
                  )
                )
              : NonLoginHeaderNav.map(
                  (
                    item,
                    index //Kalo user blm login render ini
                  ) => (
                    <Link
                      href={item.href}
                      key={index}
                      className="h-fit w-fit px-2"
                    >
                      {item.icon}
                    </Link>
                  )
                )}
            {/*Maaf aja kalo caranya rada tolol wkowakoawok ~Seto */}
          </div>
        </div>
        <div className="mx-4 flex self-center">
          {/* User Avatar */}
          {/*===> CONDITIONAL STATEMENT KALO USER DAH LOGIN/BELOM (By default statement nya gw set ke true) <=== */}
          {isLoggedIn ? ( //Klo udh login render ini
            <Avatar
              src="https://yt3.googleusercontent.com/kwT5VgMOSuYmGQif7clzISmM0xUYXdEQEDyZqBVL4_SQ1fTPtCpUj1xJlXtmuq7x9eY48EGrusI=s900-c-k-c0x00ffffff-no-rj"
              alt="harusnya millie"
              rounded
            />
          ) : (
            //Klo blm login render ini
            <>
              <div className="mx-1 rounded-md border border-normal-blue bg-normal-blue">
                <button className="h-8 w-16 px-1 text-bright-white hover:border-bright-blue hover:bg-bright-blue">
                  Login
                </button>
              </div>
              <div className="mx-1 rounded-md border border-normal-blue bg-white hover:border-bright-blue hover:bg-bright-blue">
                <button className="h-8 px-1 text-normal-blue hover:text-white">
                  Register
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* NI DIBAWAH KLO KEKECILAN, pindahin search ke-bawah */}
      <div className="block px-1 lg:hidden">
        {/* <p className="text-white">Ceritanya searchbar klo kecil</p> */}
        <AutoComplete
          id="search_navbar"
          name="search_navbar"
          // Contoh pake autoCompleteOnChange
          // autoCompleteOnChange={(e) => {
          //   setDataa(e.target.value);
          //   console.log(e.target.value, "A");
          // }}
        />
      </div>
    </nav>
  );
};
