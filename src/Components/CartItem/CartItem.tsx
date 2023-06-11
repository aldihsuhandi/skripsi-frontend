import { CartSelect } from "@/helper";
import { CartPrice } from "@/helper/Cart/CartPriceCall";
import { CartUpdate } from "@/helper/Cart/CartUpdateCall";
import { FormatCurrencyIdr } from "@/helper/GeneralHelper/CurrencyHelper";
import { BE_URL, CLIENT_ID, CLIENT_SECRET, CartSummary } from "@/types";
import axios from "axios";
import classNames from "classnames";
import Link from "next/link";
import { HTMLAttributes, useEffect, useState } from "react";
import { HiMinusCircle, HiPlusCircle, HiTrash } from "react-icons/hi2";

export interface CartItemProps extends HTMLAttributes<HTMLDivElement> {
  cartItemData: CartSummary;
  setUpdateCartPrice: (price_replacement: bigint) => void;
  onDelete: (itemId: string) => void;
}

export const CartItem = ({
  cartItemData,
  setUpdateCartPrice,
  onDelete,
  ...props
}: CartItemProps) => {
  const [image, setImage] = useState<string | undefined>();
  const merchantEncoded = encodeURIComponent(
    cartItemData.itemSummary.merchantInfo.username
  );
  const [quantity, setQuantity] = useState<number>(cartItemData.quantity);
  const [checked, setChecked] = useState<boolean>(cartItemData.selected);
  useEffect(() => {
    async function yeah() {
      const response = await ProcessImage({
        imageIdCom: cartItemData.itemSummary.itemImages[0],
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
    yeah();
    setQuantity(cartItemData.quantity);
    if (image) {
      return () => {
        URL.revokeObjectURL(image);
      };
    }
  }, [cartItemData]);

  function handleKeyDownPreventWords(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    // Allow: backspace, delete, tab, escape, enter, and decimal point
    // TODO: Test lagi yang bener2 perlu di allow dan di ban apa di field number/max-min-price
    if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key === "Tab" ||
      event.key === "Escape" ||
      event.key === "Enter" ||
      event.key === "."
    ) {
      // Allow input
      return;
    }

    if (event.key === " ") {
      event.preventDefault();
    }

    // Ensure that it is a number and stop the keypress
    if (isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  async function handleQuantityChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    let newQuantity = Number(event.target.value);

    if (cartItemData && cartItemData.itemSummary.itemQuantity) {
      const quantity_of_item = cartItemData.itemSummary.itemQuantity;
      if (newQuantity > quantity_of_item) {
        newQuantity = quantity_of_item;
      } else if (newQuantity < 1) {
        newQuantity = 0;
      }
    } else {
      newQuantity = 1;
    }

    setQuantity(newQuantity);
    if (newQuantity !== 0) {
      const updateStatus = await CartUpdate({
        itemId: cartItemData.itemSummary.itemId,
        quantity: newQuantity,
      });
      if (updateStatus?.resultContext.success) {
        const calPrice = await CartPrice();
        if (calPrice?.resultContext.success) {
          setUpdateCartPrice(calPrice.price);
        }
      }
    }
  }

  return (
    <div
      className={classNames(
        "flex min-w-full flex-row rounded border-2 border-solid hover:shadow-lg",
        { "border-normal-white": !checked },
        { "border-green-300": checked }
      )}
      {...props}
    >
      <div className="self-center px-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={async () => {
            const resultSelect = await CartSelect({
              itemIds: [cartItemData.itemSummary.itemId],
              selected: !checked,
            });
            if (resultSelect && resultSelect.resultContext.success) {
              setChecked(resultSelect.selected);
              const priceResponse = await CartPrice();

              if (priceResponse && priceResponse.resultContext) {
                setUpdateCartPrice(priceResponse.price);
              }
            }
          }}
        />
      </div>

      <div className="flex w-full flex-col">
        {/* Image + Item info */}
        <div className="flex flex-row p-2">
          <Link
            href={`/merchant/${merchantEncoded}/item/${cartItemData.itemSummary.itemId}`}
          >
            <img
              className="m-2 h-32 w-32 max-w-none self-center rounded-md object-scale-down lg:h-16 lg:w-16 xl:h-20 xl:w-20 2xl:h-32 2xl:w-32"
              src={image}
              alt={cartItemData.itemSummary.itemName}
            />
          </Link>

          <div>
            <Link
              href={`/merchant/${merchantEncoded}/item/${cartItemData.itemSummary.itemId}`}
            >
              <p className="font-sans text-sm font-semibold lg:text-base xl:text-lg">
                {cartItemData.itemSummary.itemName}
              </p>
            </Link>
            <p className="font-sans text-sm lg:text-base">
              {cartItemData.itemSummary.merchantInfo.username}
            </p>
            <p className="font-sans text-sm lg:text-base">
              {cartItemData.itemSummary.merchantInfo.location?.city}
            </p>
            <p className="font-sans text-sm lg:text-base">
              {FormatCurrencyIdr(cartItemData.itemSummary.itemPrice)}
            </p>
          </div>
        </div>

        {/* Quantity */}
        <div className="self-end px-2 pb-2">
          <div className="item-center flex flex-row">
            <button
              className="mr-8"
              onClick={async () => {
                const deleteResponse = await CartUpdate({
                  itemId: cartItemData.itemSummary.itemId,
                  quantity: 0,
                });
                const priceResponse =
                  deleteResponse && deleteResponse.resultContext.success
                    ? await CartPrice()
                    : undefined;
                if (priceResponse && priceResponse.resultContext) {
                  setUpdateCartPrice(priceResponse.price);
                  onDelete(cartItemData.itemSummary.itemId);
                }
              }}
            >
              <HiTrash size={20} className=" fill-gray-500" />
            </button>
            <HiMinusCircle
              className={classNames("text-normal-blue", {
                "cursor-pointer": quantity > 1,
                "cursor-not-allowed": quantity === 1,
              })}
              style={{ height: "1.5em", width: "1.5em" }}
              onClick={async () => {
                if (quantity > 1) {
                  const updateStatus = await CartUpdate({
                    itemId: cartItemData.itemSummary.itemId,
                    quantity: quantity - 1,
                  });
                  if (updateStatus?.resultContext.success) {
                    const calPrice = await CartPrice();
                    if (calPrice?.resultContext.success) {
                      setUpdateCartPrice(calPrice.price);
                    }
                  }
                  setQuantity(quantity - 1);
                }
              }}
            />
            <input
              value={quantity}
              onKeyDown={handleKeyDownPreventWords}
              onChange={handleQuantityChange}
              className="block min-w-[64px] max-w-[64px] rounded-lg border border-gray-300 bg-white p-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
            <HiPlusCircle
              className={classNames("text-normal-blue", {
                "cursor-pointer":
                  quantity < cartItemData.itemSummary.itemQuantity,
                "cursor-not-allowed":
                  quantity === cartItemData.itemSummary.itemQuantity,
              })}
              style={{ height: "1.5em", width: "1.5em" }}
              onClick={async () => {
                if (quantity < cartItemData.itemSummary.itemQuantity) {
                  const updateStatus = await CartUpdate({
                    itemId: cartItemData.itemSummary.itemId,
                    quantity: quantity + 1,
                  });
                  if (updateStatus?.resultContext.success) {
                    const calPrice = await CartPrice();
                    if (calPrice?.resultContext.success) {
                      setUpdateCartPrice(calPrice.price);
                    }
                  }
                  setQuantity(quantity + 1);
                }
              }}
            />
          </div>
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
