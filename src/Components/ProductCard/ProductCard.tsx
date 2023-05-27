import { WishlistAdd } from "@/helper";
import { CLIENT_ID, CLIENT_SECRET, ItemSummary } from "@/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes, useEffect, useState } from "react";
import { HiHeart } from "react-icons/hi";
import { toast } from "react-toastify";

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  itemData: ItemSummary;
}

export const ProductCard = ({ itemData, ...props }: ProductCardProps) => {
  const router = useRouter();
  const [image, setImage] = useState<string | undefined>();
  const [merchantEncoded, setMerchantEncoded] = useState<string | undefined>();
  useEffect(() => {
    async function yeah() {
      const response = await ProcessImage({
        imageIdCom: itemData.itemImages[0],
      });
      if (response?.status === 200 && response.data.byteLength !== 0) {
        const byteArray = new Uint8Array(response.data);
        const blobs = new Blob([byteArray], { type: "image/jpeg" });
        const imgUrl = URL.createObjectURL(blobs);

        setMerchantEncoded(encodeURIComponent(itemData.merchantInfo.username));
        setImage(imgUrl);
      } else {
        setImage(undefined);
      }
    }
    yeah();
  }, [itemData]);
  return (
    <Link href={`/merchant/${merchantEncoded}/item/${itemData.itemId}`}>
      <div
        className="flex h-full w-full flex-col rounded-lg border-2 border-solid border-normal-white hover:shadow-lg"
        {...props}
      >
        <div className="flex flex-col p-3">
          <img
            className="h-60 w-60 self-center rounded-md object-scale-down lg:h-32 xl:h-40 2xl:h-60"
            src={
              image ??
              "https://i1.sndcdn.com/artworks-dCikqEVyCfTCgdq0-0hSQRQ-t500x500.jpg"
            }
            alt="ProductCardImage"
          />
          <p className="font-sans text-sm font-semibold lg:text-base xl:text-lg">
            {itemData.itemName}
          </p>
          <p className="font-sans text-sm lg:text-base">
            {itemData.merchantLevel}
          </p>
          <p className="font-sans text-sm lg:text-base">
            {itemData.itemCategory}
          </p>
          <p className="font-sans text-sm lg:text-base">{itemData.hobby}</p>
          <p className="font-sans text-sm lg:text-base">
            Rp. {itemData.itemPrice.toLocaleString()}
          </p>
        </div>
        <div className="mt-auto flex flex-row justify-end gap-2 p-3">
          <div className="group w-max">
            <button
              className="rounded-full bg-normal-blue p-2 hover:bg-bright-blue"
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                const wishlistResult = await WishlistAdd({
                  itemId: itemData.itemId,
                });
                if (wishlistResult) {
                  if (wishlistResult.resultContext.success) {
                    toast.success("Successfully added!", {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      theme: "colored",
                    });
                  }
                }
              }}
            >
              <HiHeart size={20} className="fill-white" />
            </button>
            <span className="pointer-events-none absolute -top-7 right-0 w-max rounded-md p-1 text-sm font-light opacity-0 transition-opacity group-hover:bg-bright-white group-hover:opacity-100">
              Add to Wishlist
            </span>
          </div>
        </div>
      </div>
    </Link>
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
