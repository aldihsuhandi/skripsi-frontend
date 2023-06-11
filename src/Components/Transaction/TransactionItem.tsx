import { ProcessImgBE } from "@/helper";
import { FormatCurrencyIdr } from "@/helper/GeneralHelper/CurrencyHelper";
import { CLIENT_ID, CLIENT_SECRET, HistoryItemSummary } from "@/types";
import { TransactionDetailSummary } from "@/types/Transaction/TransactionQuery";
import axios from "axios";
import { HTMLAttributes, useEffect, useState } from "react";
import { HiBuildingStorefront, HiUserGroup } from "react-icons/hi2";

export interface TransactionItemProps extends HTMLAttributes<HTMLDivElement> {
  detail: TransactionDetailSummary;
}

export const TransactionItem = ({ detail, ...props }: TransactionItemProps) => {
  const [image, setImage] = useState<string | undefined>();
  useEffect(() => {
    async function downloadImage() {
      const images = detail.item.itemImages;
      const response = await ProcessImage({
        imageIdCom: images[0],
      });

      if (response?.status === 200 && response.data.byteLength !== 0) {
        const byteArray = new Uint8Array(response.data);
        const blobs = new Blob([byteArray], { type: "image/jpeg" });
        const imgUrl = URL.createObjectURL(blobs);

        setImage(imgUrl);
      } else {
        setImage(undefined);
      }
    }

    downloadImage();
    if (image) {
      return () => {
        URL.revokeObjectURL(image);
      };
    }
  }, [detail]);

  return (
    <>
      <a
        target="_blank"
        href={`/merchant/${encodeURIComponent(
          detail.item.merchantInfo.username
        )}/item/${detail.item.itemId}`}
        className="flex h-auto w-full flex-row justify-center p-4"
      >
        <img
          className="h-28 w-28 rounded border-2 border-solid p-3"
          src={
            image ??
            "https://i1.sndcdn.com/artworks-dCikqEVyCfTCgdq0-0hSQRQ-t500x500.jpg"
          }
          alt=""
        />
        <div className="flex h-full w-full flex-col items-start justify-start p-3">
          <div className="font-semibold">{detail.item.itemName}</div>
          <div className="text-sm">
            {FormatCurrencyIdr(detail.item.itemPrice)} (x{detail.quantity})
          </div>

          <div>
            <p className="flex font-sans text-sm lg:text-base">
              <HiBuildingStorefront
                style={{
                  height: "1.5em",
                  width: "1.5em",
                  color: "#581C87",
                  paddingRight: "2px",
                }}
              />
              {detail.item.merchantLevel}
            </p>
            <p className="flex font-sans text-sm lg:text-base">
              <HiUserGroup
                style={{
                  height: "1.5em",
                  width: "1.5em",
                  color: "#581C87",
                  paddingRight: "2px",
                }}
              />
              {detail.item.userLevel == undefined
                ? "No Review"
                : detail.item.userLevel}
            </p>
          </div>
        </div>
      </a>
    </>
  );
};

const ProcessImage = async ({ imageIdCom }: { imageIdCom: string }) => {
  const POST_BODY = {
    imageId: imageIdCom,
  };

  try {
    const response = await axios.post(
      "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/image/download",
      POST_BODY,
      {
        headers: {
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          "Accept-Type": "image/jpeg",
        },
        responseType: "arraybuffer",
      }
    );
    return response;
  } catch (error) {
    return null;
  }
};
