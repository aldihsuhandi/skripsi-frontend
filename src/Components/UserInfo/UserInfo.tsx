import { ImageDownload, ProcessImgBE } from "@/helper";
import { UserSummary } from "@/types/User";
import { HTMLAttributes, useEffect, useState } from "react";
import { Avatar } from "../Avatar";
import {
  HiUser,
  HiPhone,
  HiHome,
  HiFaceSmile,
  HiCalendarDays,
  HiArrowLeftOnRectangle,
} from "react-icons/hi2";

import { HiMail } from "react-icons/hi";

export interface UserInfoProps extends HTMLAttributes<HTMLDivElement> {
  userData: UserSummary;
}

export const UserInfo = ({ userData, ...props }: UserInfoProps) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  useEffect(() => {
    async function getUserImage() {
      if (userData.profilePicture) {
        const usableImg = await ImageDownload({
          imageId: userData.profilePicture,
        });
        if (usableImg?.status === 200 && usableImg.data.byteLength !== 0) {
          const imgToUse = await ProcessImgBE(usableImg.data);

          setImage(imgToUse);
        } else {
          setImage(undefined);
        }
      }
    }
    getUserImage();
  }, [userData.profilePicture]);

  return (
    <div className="mx-auto sm:p-6 md:p-12">
      <div className="min-w-lg mx-auto min-h-[575px] max-w-4xl rounded-lg bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
        <div className="flex flex-row divide-x-2 p-4">
          <div className="pr-4">
            <Avatar
              src={image}
              alt="profile-picture"
              className="h-64 w-64 rounded-full"
            />

            <div className="flex flex-col justify-center space-y-3 pt-32">
              <button className="rounded-md border bg-normal-blue p-2 text-white shadow-sm hover:bg-bright-blue hover:shadow-md">
                Edit Profile
              </button>
              <button className="rounded-md border border-normal-blue p-2 text-normal-blue shadow-sm hover:bg-normal-blue hover:text-white hover:shadow-md">
                Change Password
              </button>
              <button className="rounded-md border bg-red-600 p-2 text-white shadow-sm hover:bg-red-500 hover:shadow-md">
                Delete Account
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-5 p-4">
            <h1 className="text-2xl font-medium text-normal-blue">
              Your Personal Data
            </h1>
            <span className="flex flex-row items-center">
              <HiUser size={20} />
              <p className="pl-3 text-lg font-semibold">
                Username: {userData.username}
              </p>
            </span>
            <span className="flex flex-row items-center">
              <HiMail size={20} />
              <p className="pl-3 text-lg font-semibold">
                Email: {userData.email}
              </p>
            </span>
            <span className="flex flex-row items-center">
              <HiPhone size={20} />
              <p className="pl-3 text-lg font-semibold">
                Phone: {userData.phoneNumber}
              </p>
            </span>
            <span className="flex flex-row items-center">
              <HiFaceSmile size={20} />
              <p className="pl-3 text-lg font-semibold">GENDER (WIP)</p>
            </span>
            <span className="flex flex-row items-center">
              <HiHome size={20} />
              <p className="pl-3 text-lg font-semibold">ADRRESS (WIP)</p>
            </span>
            <span className="flex flex-row items-center">
              <HiCalendarDays size={20} />
              <p className="pl-3 text-lg font-semibold">DOB (WIP)</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
