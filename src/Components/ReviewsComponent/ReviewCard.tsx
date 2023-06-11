import { ItemQuery } from "@/helper";
import { ItemDetail } from "@/helper/ItemDetail";
import { BE_URL, CLIENT_ID, CLIENT_SECRET, ItemSummary } from "@/types";
import { ReviewSummary } from "@/types/Reviews";
import axios from "axios";
import { get } from "http";
import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MultipleReviewImages } from "./MultipleReviewImages";
import { HiStar } from "react-icons/hi";

export interface ReviewCardProps extends HTMLAttributes<HTMLDivElement> {
  reviewData: ReviewSummary;
}

export const ReviewCard = ({ reviewData }: ReviewCardProps) => {
  const router = useRouter();
  const [isReviewed, setIsReviewed] = useState<boolean>(!reviewData.needReview);
  const [itemImage, setItemImage] = useState<string | undefined>();
  // const [reviewImgs, setReviewImgs] = useState<>
  const [item, setItem] = useState<ItemSummary | undefined>();
  // const [itemInReview, setItemInReview] = useState<ItemSummary[]>([]);

  const CheckReview = () => {
    if (!item) {
      return <></>;
    }

    if (!isReviewed) {
      return (
        <>
          <a
            href={`/review/create/${reviewData.reviewId}`}
            className="m-1 justify-center rounded-md border-2 border-blue-500 p-1.5 text-sm font-semibold text-blue-500"
          >
            Click to Review
          </a>
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

  const RenderImages = () => {
    if (!reviewData.images || reviewData.images.length == 0) {
      return <></>;
    }
    return (
      <>
        <MultipleReviewImages imageIds={reviewData.images} />
      </>
    );
  };

  return (
    <div className="p-2">
      <div className="relative flex min-h-fit min-w-full flex-col rounded-md border p-2 shadow-md hover:border-normal-blue">
        <div className="flex flex-row">
          <div className="flex flex-col">
            <img
              className="h-48 w-48 rounded border-2 border-solid p-3"
              src={
                itemImage ??
                "https://i1.sndcdn.com/artworks-dCikqEVyCfTCgdq0-0hSQRQ-t500x500.jpg"
              }
              alt=""
            />
          </div>
          <div className="flex flex-col px-2">
            <div className="pb-4 text-lg font-medium">
              <p>{item ? item.itemName : ""}</p>
              <p className="text-sm text-gray-400">
                {item ? item.merchantInfo.username : ""}
              </p>
              <p className="flex flex-row text-base">
                {reviewData.interestLevel}{" "}
                {reviewData.needReview ? (
                  <></>
                ) : (
                  <>
                    {" "}
                    <span className="flex flex-row items-center pl-3">
                      {reviewData.review}
                      <HiStar size={15} className="fill-yellow-500" />
                    </span>{" "}
                  </>
                )}
              </p>
              <p className="text-base font-light">{reviewData.description}</p>
              {RenderImages()}
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2">
          <CheckReview></CheckReview>
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
    const response = await axios.post(BE_URL + "/image/download", POST_BODY, {
      headers: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        "Accept-Type": "image/jpeg",
      },
      responseType: "arraybuffer",
    });
    return response;
  } catch (error) {
    return null;
  }
};
