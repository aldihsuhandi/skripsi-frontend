import { UserSummary } from "@/types/User";
import React, { HTMLAttributes, useEffect, useState } from "react";
import { Avatar } from "../Avatar";
import { ImageDownload, ProcessImgBE } from "@/helper";
import { HiStar } from "react-icons/hi";
import Link from "next/link";

export interface MerchantInfoProps extends HTMLAttributes<HTMLDivElement> {
  data: UserSummary;
}

export const MerchantInfo = ({ data, ...props }: MerchantInfoProps) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [merchantEncoded, setMerchantEncoded] = useState<string | undefined>();
  useEffect(() => {
    async function getMerchantImage() {
      if (data.profilePicture) {
        const imgUsable = await ImageDownload({
          imageId: data.profilePicture,
        });

        const imgUrl = await ProcessImgBE(imgUsable?.data);

        setImage(imgUrl);
      }
      setMerchantEncoded(encodeURIComponent(data.username));
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
      <div className="border-grey rounded border-t-2 border-solid">
        <div className="flex flex-row items-center p-3">
          {/* Avatar */}
          <Link href={`/merchant/${merchantEncoded}`}>
            <Avatar
              src={image}
              alt="merchantPP"
              rounded
              style={{ height: 80, width: 80 }}
            />
          </Link>
          <div className="flex flex-col px-3">
            <h6>Merchant</h6>
            <h3 className="text-xl font-bold">{data.username}</h3>
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
      </div>
    </div>
  );
};
