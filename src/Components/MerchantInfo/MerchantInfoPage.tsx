import { UserSummary } from "@/types/User";
import React, { HTMLAttributes, useEffect, useState } from "react";
import { Avatar } from "../Avatar";
import { ImageDownload, ProcessImgBE } from "@/helper";
import { HiStar } from "react-icons/hi";
import { HiCheck, HiDevicePhoneMobile, HiXMark } from "react-icons/hi2";

export interface MerchantInfoPageProps extends HTMLAttributes<HTMLDivElement> {
  data: UserSummary;
}

export const MerchantInfoPage = ({ data, ...props }: MerchantInfoPageProps) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  useEffect(() => {
    async function getMerchantImage() {
      if (data.profilePicture) {
        const imgUsable = await ImageDownload({
          imageId: data.profilePicture,
        });

        const imgUrl = await ProcessImgBE(imgUsable?.data);

        setImage(imgUrl);
      }
    }
    getMerchantImage();
    if (image) {
      return () => {
        URL.revokeObjectURL(image);
      };
    }
  }, []);
  return (
    <div {...props}>
      <div className="border-grey rounded border-2 border-solid">
        <div className="flex flex-col  lg:flex-row lg:justify-between">
          {/* Section 1. Basic Info, Avatar + Name + City */}
          <div className="flex flex-row p-3">
            <Avatar
              src={image}
              alt="merchantPP"
              rounded
              style={{ height: 80, width: 80 }}
            />
            <div className="flex flex-col px-3">
              <h3 className="text-xl font-bold">{data.username}</h3>
              <h6>{data.location?.city}</h6>
              <div>
                <HiStar
                  style={{
                    color: "yellow",
                    display: "inline",
                    height: "1.5em",
                    width: "1.5em",
                  }}
                />
                {/* msh placeholder */}
                <span className="font-bold">{data.review} / 5</span> <br />
              </div>
            </div>
          </div>
          {/* Section 2. Contact Info */}
          <div className="pt-2 pr-4">
            {/* Bikin bisa copy to clipboard phoneNumber-nya */}
            <p className="font-bold lg:text-center">Contact Info</p>
            <div className="flex flex-row items-center">
              <HiDevicePhoneMobile size={20} /> {data.phoneNumber}
            </div>
            <div>
              <div className="flex flex-row items-center lg:justify-center">
                {data.canWhatsapp ? (
                  <HiCheck size={20} />
                ) : (
                  <HiXMark size={20} />
                )}
                Whatsapp
              </div>
              <div className="flex flex-row items-center lg:justify-center">
                {data.canTelegram ? (
                  <HiCheck size={20} />
                ) : (
                  <HiXMark size={20} />
                )}
                Telegram
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
