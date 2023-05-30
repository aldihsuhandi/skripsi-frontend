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
import { StringToDateAndBack } from "@/helper";
import Link from "next/link";

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
      <div className="mx-auto min-h-[625px] rounded-lg bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] md:max-w-5xl ">
        <div className="flex flex-col divide-x-0 p-4 sm:flex-row sm:divide-x-2">
          <div className="self-center pr-4">
            <Avatar
              src={image}
              alt="profile-picture"
              className="h-40 w-40 rounded-full md:h-72 md:w-72"
            />

            <div className="flex flex-col justify-center space-y-3 pt-2 sm:pt-56">
              <Link
                href="/UpdateProfile"
                className="flex flex-col items-center rounded-md border bg-normal-blue p-2 shadow-sm hover:bg-bright-blue hover:shadow-md"
              >
                <button className="text-white">Edit Profile</button>
              </Link>
              <button className="rounded-md border bg-red-600 p-2 text-white shadow-sm hover:bg-red-500 hover:shadow-md">
                Delete Account (??)
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-5 p-6">
            <h1 className="text-xl font-medium text-normal-blue">
              Your Personal Data
            </h1>
            <span className="flex flex-row items-center">
              <HiUser size={20} />
              <p className="pl-3 text-lg font-normal">
                Username: {userData.username}
              </p>
            </span>
            <span className="flex flex-row items-center">
              <HiFaceSmile size={20} />
              <p className="pl-3 text-lg font-normal">
                Gender: {userData.gender}
              </p>
            </span>
            <span className="flex flex-row items-center">
              <HiCalendarDays size={20} />
              <p className="pl-3 text-lg font-normal">
                Date of Birth: {StringToDateAndBack(userData.dateOfBirth)}
              </p>
            </span>
            <h1 className="text-xl font-medium text-normal-blue">
              Your Contact
            </h1>
            <span className="flex flex-row items-center">
              <HiMail size={20} />
              <p className="pl-3 text-lg font-normal">
                Email: {userData.email}
              </p>
            </span>
            <span className="flex flex-row items-center">
              <HiPhone size={20} />
              <p className="pl-3 text-lg font-normal">
                Phone: {userData.phoneNumber}
              </p>
            </span>
            <h1 className="text-xl font-medium text-normal-blue">
              Your Location Info
            </h1>
            <span className="flex flex-row items-center">
              <HiHome size={20} />
              <p className="pl-3 text-lg font-normal">Address (WIP)</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
