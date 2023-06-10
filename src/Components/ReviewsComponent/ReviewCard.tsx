import { ItemQuery } from "@/helper";
import { ItemDetail } from "@/helper/ItemDetail";
import { CLIENT_ID, CLIENT_SECRET, ItemSummary } from "@/types";
import { ReviewSummary } from "@/types/Reviews";
import axios from "axios";
import { get } from "http";
import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes, useState, useEffect } from "react";
import { toast } from "react-toastify";

export interface ReviewCardProps extends HTMLAttributes<HTMLDivElement> {
  reviewData: ReviewSummary;
}

export const ReviewCard = ({ reviewData }: ReviewCardProps) => {
  const router = useRouter();
  const [isReviewed, setIsReviewed] = useState<boolean>(!reviewData.needReview);
  const [itemImage, setItemImage] = useState<string | undefined>();
  const [item, setItem] = useState<ItemSummary | undefined>();
  // const [itemInReview, setItemInReview] = useState<ItemSummary[]>([]);

  const CheckReview = () => {
    if (!item) {
      return <></>;
    }

    if (!isReviewed) {
      return (
        <>
          <button onClick={() => {}}>Click to Review</button>
        </>
      );
    }
    return <></>;
  };

  useEffect(() => {
    async function downloadImage(item: ItemSummary) {
      const images = item.itemImages;
      const response = await ProcessImage({
        imageIdCom: images[0],
      });

      if (response?.status === 200 && response.data.byteLength !== 0) {
        const byteArray = new Uint8Array(response.data);
        const blobs = new Blob([byteArray], { type: "image/jpeg" });
        const imgUrl = URL.createObjectURL(blobs);

        setItemImage(imgUrl);
      } else {
        setItemImage(undefined);
      }
    }

    async function getItemInfo() {
      const getItemId = await ItemDetail({
        itemId: reviewData.itemId,
      });

      if (getItemId && getItemId.resultContext.success) {
        setItem(getItemId.item);
        downloadImage(getItemId.item);
      } else if (getItemId && !getItemId.resultContext.success) {
        toast.warn(getItemId?.resultContext.resultMsg, {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          theme: "colored",
        });
      }
    }
    getItemInfo();
  }, [reviewData]);

  return (
    <div className="p-2">
      <div className="relative flex min-h-fit min-w-full flex-col rounded-md border p-2 shadow-md hover:border-normal-blue">
        <div className="flex flex-row">
          <div className="flex flex-col">
            <img
              className="h-28 w-28 rounded border-2 border-solid p-3"
              src={
                itemImage ??
                "https://i1.sndcdn.com/artworks-dCikqEVyCfTCgdq0-0hSQRQ-t500x500.jpg"
              }
              alt=""
            />
          </div>
          <div className="flex flex-col px-2">
            <p className="pb-4 text-lg font-medium">
              {item ? item.itemName : ""}
            </p>
            {/* <p className="text-base font-normal"></p> */}
          </div>
        </div>
        <div className="absolute bottom-2 right-2">
          <CheckReview></CheckReview>
          {/* <button className="rounded-md border border-normal-blue bg-normal-blue p-1 text-white hover:border-bright-blue hover:bg-bright-blue">
            Click to Review
          </button> */}
        </div>
      </div>
    </div>
  );
};

const ProcessImage = async ({ imageIdCom }: { imageIdCom: string }) => {
  const POST_BODY = {
    imageId: imageIdCom,
  };

  try {
    const response = await axios.post(
      "http://localhost:8080/image/download",
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
