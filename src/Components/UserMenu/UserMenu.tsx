import { ImageDownload, ProcessImgBE } from "@/helper";
import { UserSummary } from "@/types/User";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Avatar } from "../Avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import {
  HiUser,
  HiPhone,
  HiBuildingStorefront,
  HiClock,
  HiCog8Tooth,
  HiArrowLeftOnRectangle,
  HiHeart,
} from "react-icons/hi2";

import { HiMail, HiClipboardList } from "react-icons/hi";
import { MerchantApplyCall } from "@/helper/MerchantApplyCall";
import { useRouter } from "next/router";

export interface UserMenuProps {
  userData: UserSummary;
  onLogoutClick: () => Promise<void>;
  children: ReactNode;
}

export const UserMenu = ({
  userData,
  onLogoutClick,
  children,
}: UserMenuProps) => {
  const router = useRouter();
  const [image, setImage] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const [merchantEncoded, setMerchantEncoded] = useState<string | undefined>();
  useEffect(() => {
    async function ProcessImage() {
      if (userData.profilePicture) {
        const response = await ImageDownload({
          imageId: userData.profilePicture,
        });
        if (response?.status === 200 && response.data.byteLength !== 0) {
          const imgUrl = await ProcessImgBE(response.data);

          setImage(imgUrl);
        } else {
          setImage(undefined);
        }
      }
    }
    ProcessImage();
    setMerchantEncoded(encodeURIComponent(userData.username));
  }, [userData.profilePicture]);

  return (
    <div className="relative  flex">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div
            className="cursor-pointer"
            // onMouseEnter={() => setMenuOpen(!menuOpen)}
          >
            <Avatar src={image} alt="profile-picture" rounded />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            // className="absolute right-2 top-10 flex w-52 flex-col rounded-md border border-gray-600 bg-white p-2 py-2"
            className="z-[10000] mr-5 min-w-[380px] rounded-md border-gray-600 bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
            // ref={ref}
            side="bottom"
            sideOffset={5}
          >
            <DropdownMenu.Group className="p-1">
              <DropdownMenu.Item className="rounded-md border p-2 shadow-md hover:shadow-lg">
                <Link
                  href="/UserProfile"
                  className="flex flex-row items-center"
                >
                  <Avatar
                    src={image}
                    alt="profile-picture"
                    className="h-24 w-24 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="flex flex-row items-center px-4 py-1">
                      <HiUser size={12} />
                      <p className="pl-2 text-sm">{userData.username}</p>
                    </span>
                    <span className="flex flex-row items-center px-4 py-1">
                      <HiMail size={12} />
                      <p className="pl-2 text-sm">{userData.email}</p>
                    </span>
                    <span className="flex flex-row items-center px-4 py-1">
                      <HiPhone size={12} />
                      <p className="pl-2 text-sm">{userData.phoneNumber}</p>
                    </span>
                  </div>
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Group>

            <DropdownMenu.Group className="flex w-full flex-col p-1">
              <DropdownMenu.Item className="rounded-md p-2 hover:border hover:shadow-md">
                <Link
                  href={
                    userData.role === "MERCHANT"
                      ? `/merchant/${merchantEncoded}`
                      : "#"
                  }
                  className="flex flex-row items-center"
                >
                  <HiBuildingStorefront size={15} />
                  {userData.role === "MERCHANT" ? (
                    <button>
                      <span className="px-2">Your Merchant Page</span>
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        const re = await MerchantApplyCall();
                        if (re?.resultContext.success) {
                          router.reload();
                        }
                      }}
                    >
                      <span className="px-2">Be a Merchant</span>
                    </button>
                  )}
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="rounded-md p-2 hover:border hover:shadow-md">
                <Link href="/wishlist" className="flex flex-row items-center">
                  <HiHeart size={15} />
                  <span className="px-2">Wishlist</span>
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="rounded-md p-2 hover:border hover:shadow-md">
                <Link
                  href="/ShoppingHistory"
                  className="flex flex-row items-center"
                >
                  <HiClock size={15} />
                  <span className="px-2">Shopping History</span>
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="rounded-md p-2 hover:border hover:shadow-md">
                <Link href="/review" className="flex flex-row items-center">
                  <HiClipboardList size={15} />
                  <span className="px-2">Review</span>
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="group rounded-md p-2 hover:bg-red-500">
                <div
                  className="flex cursor-pointer flex-row items-center"
                  onClick={onLogoutClick}
                  ref={ref}
                >
                  <span>
                    <HiArrowLeftOnRectangle
                      size={15}
                      color="red"
                      className="group-hover:fill-white"
                    />
                  </span>
                  <p className="px-2 text-red-600 group-hover:text-white">
                    Logout
                  </p>
                </div>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            {/* The pop-up menu */}
            {/* {menuOpen && (
              <div
                className="absolute right-2 top-10 flex w-52 flex-col rounded-md border border-gray-600 bg-white p-2 py-2"
                ref={ref}
                onMouseLeave={() => setMenuOpen(false)}
              >
                {children}
              </div>
            )} */}
            <DropdownMenu.Arrow
              className="border-gray-600 fill-white"
              height={8}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* <div className="mx-1 self-center rounded-md border border-normal-blue bg-white hover:border-bright-blue hover:bg-bright-blue">
        <button
          onClick={onLogoutClick}
          className="h-8 px-1 text-xs text-normal-blue hover:text-white"
        >
          Logout
        </button>
      </div> */}
    </div>
  );
};
