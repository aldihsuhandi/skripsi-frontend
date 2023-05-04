import { SessionInfoCall } from "@/helper/SessionInfoCall";
import { Session_Local_Key } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AutoComplete } from "../AutoComplete";
import { Avatar } from "../Avatar";
import { HeaderNavigation } from "./constants";
import { NonLoginHeaderNav } from "./nonlogin_constants";
import { UserQuery } from "@/helper/UserQueryCall";
import { ImageDownload } from "@/helper/ImageDownloadCall";
import { LogoutCall } from "@/helper/LogoutCall";
import { ProcessImgBE } from "@/helper/ProcessImgBE";
import { UserMenu } from "../UserMenu/UserMenu";
import { UserSummary } from "@/types/User";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HiUser,
  HiBuildingStorefront,
  HiClock,
  HiCog8Tooth,
  HiArrowLeftOnRectangle,
  HiHeart,
} from "react-icons/hi2";

export const NavBar = () => {
  const router = useRouter();
  //---> nge set apakh usernya dah login ato belom <---
  const [isLoggedIn, setIsLoggedIn] = useState(false); //default state true, CW: gw jadiin false ye
  const [userData, setUserData] = useState<UserSummary | undefined>(undefined);

  // useEffect check session
  useEffect(() => {
    const sessionString = localStorage.getItem(Session_Local_Key);
    async function sessionAPI() {
      if (sessionString) {
        // Kalo session ada di local, check validity atau dah expired
        const sessionInfo = await SessionInfoCall({ sessionId: sessionString });
        if (sessionInfo.resultContext.success) {
          // ambil email
          const emailUser = sessionInfo.sessionSummary.email;

          // panggil user/query, uat profilePicutre Id
          const userData = await UserQuery({
            key: emailUser,
            identifier: "email",
          }).then((userData) => {
            setUserData(userData.userInfo);
          });

          // set Logged in
          setIsLoggedIn(true);
        } else if (!sessionInfo.resultContext.success) {
          // Klo gk success, for misal SESSION_EXPIRED, apis dri local yang stale
          localStorage.removeItem(Session_Local_Key);

          router.reload();
        }
      } else {
        // kalo nggak ada, set false di hook `isLoggedIn`
        setIsLoggedIn(false);
      }
    }
    sessionAPI();
  }, []);

  const onLogoutClick = async () => {
    const sessionString = localStorage.getItem(Session_Local_Key);
    if (sessionString) {
      await LogoutCall({ sessionId: sessionString });
    }
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 h-fit w-full bg-white shadow-lg">
      <div className="flex px-0 py-1 lg:px-2 lg:py-2">
        <Link href="/" className="self-center lg:self-center">
          <Image
            src="/Logo-no-text-color-fixed-small.png"
            alt="ShumiShumi Logo"
            width="0"
            height="0"
            sizes="100vw"
            className="h-16 w-16 lg:h-16 lg:w-16"
          />
        </Link>
        <p className="hidden w-44 px-2 py-2 font-sans font-semibold italic text-normal-blue lg:block">
          Make getting into <br />a hobby easier!
        </p>

        {/* AutoComplete (includes SearchBar) Component here */}
        <div className="hidden grow self-center px-6 lg:block">
          <AutoComplete id="search_navbar" name="search_navbar" />
        </div>

        <div className="ml-auto self-center">
          {/* Navigation Buttons */}
          <div className="flex ">
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
          {isLoggedIn && userData ? ( //Klo udh login render ini
            <UserMenu userData={userData} onLogoutClick={onLogoutClick}>
              <Link
                href="#"
                className="flex flex-row items-center hover:bg-bright-blue"
              >
                <HiUser size={15} />
                <span className="px-2">Profile</span>
              </Link>
              <Link
                href="#"
                className="flex flex-row items-center hover:bg-bright-blue"
              >
                <HiBuildingStorefront size={15} />
                <span className="px-2">Be a Merchant</span>
              </Link>
              <Link
                href="/wishlist"
                className="flex flex-row items-center pb-1 hover:bg-bright-blue"
              >
                <HiHeart size={15} />
                <span className="px-2">Wishlist (WIP)</span>
              </Link>
              <hr />
              <Link
                href="#"
                className="flex flex-row items-center pt-1 hover:bg-bright-blue"
              >
                <HiCog8Tooth size={15} />
                <span className="px-2">Settings</span>
              </Link>
              <div className="flex flex-row items-center hover:bg-bright-blue">
                <span>
                  <HiArrowLeftOnRectangle size={15} />
                </span>
                <a onClick={onLogoutClick} className="cursor-pointer px-2">
                  Logout
                </a>
              </div>
            </UserMenu>
          ) : (
            //Klo blm login render ini
            <>
              <div className="mx-1 rounded-md border border-normal-blue bg-normal-blue">
                <Link href="/login">
                  <button className="h-8 w-16 px-1 text-bright-white hover:border-bright-blue hover:bg-bright-blue">
                    Login
                  </button>
                </Link>
              </div>
              <div className="mx-1 rounded-md border border-normal-blue bg-white hover:border-bright-blue hover:bg-bright-blue">
                <Link href="/register">
                  <button className="h-8 px-1 text-normal-blue hover:text-white">
                    Register
                  </button>
                </Link>
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
