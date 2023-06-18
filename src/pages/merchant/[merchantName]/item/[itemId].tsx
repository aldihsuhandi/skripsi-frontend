import { COLOR_HEX_STRING, Color } from "@/Components/Color";
import { CommentSection } from "@/Components/CommentSection";
import { DialogConfrim } from "@/Components/DialogConfirm";
import { ChatIcon, ForumIcon } from "@/Components/Icons";
import { ItemImagesMultiple } from "@/Components/ItemImagesMultiple";
import { MerchantInfo } from "@/Components/MerchantInfo";
import {
  CartAdd,
  ItemDelete,
  SessionInfoCall,
  UserQuery,
  WishlistAdd,
  WishlistRemove,
  capitalizeFirstLetter,
  urlFirstString,
} from "@/helper";
import {
  FormatCurrencyIdr,
  FormatCurrencyIdrBigInt,
} from "@/helper/GeneralHelper/CurrencyHelper";
import { ItemDetail } from "@/helper/ItemDetail";
import { ItemDetailResult, Session_Local_Key } from "@/types";
import { UserSummary } from "@/types/User";
import classNames from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import {
  HiHeart,
  HiMinusCircle,
  HiPlusCircle,
  HiShare,
  HiStar,
  HiUserGroup,
} from "react-icons/hi";
import { HiBuildingStorefront } from "react-icons/hi2";
import { toast } from "react-toastify";

export default function MerchantItem() {
  // Ini spesific 1 item dari sebuah merchang
  // Product Card redirect kesini
  const router = useRouter();

  const { itemId } = router.query;

  const [userData, setUserData] = useState<UserSummary | undefined>(undefined);
  const [itemIdValid, setItemIdValid] = useState<string>();
  const [itemData, setItemData] = useState<ItemDetailResult | undefined>();
  const [pageTitle, setPageTitle] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [merchantEncoded, setMerchantEncoded] = useState<string | undefined>();

  const [quantityToCart, setQuantityToCart] = useState(1);

  useEffect(() => {
    const fetchItemData = async () => {
      if (itemId) {
        setIsLoading(true);

        const itemDataFetch = await ItemDetail({
          itemId: itemId as string,
        });

        setItemIdValid(urlFirstString(itemId));

        if (itemDataFetch) {
          if (itemDataFetch.resultContext.success) {
            setItemData(itemDataFetch);
            setIsWishlisted(itemDataFetch.item.inWishlist);
            setMerchantEncoded(
              encodeURIComponent(itemDataFetch.item.merchantInfo.username)
            );

            if (itemDataFetch.item) {
              setPageTitle(
                itemDataFetch.item.itemName +
                  " from" +
                  itemDataFetch.item.merchantInfo.username
              );
            }
            setIsLoading(false);
          }
        }
      }
    };

    const fetchUserData = async () => {
      const sessionString = localStorage.getItem(Session_Local_Key);
      if (sessionString) {
        const sessionInfo = await SessionInfoCall({ sessionId: sessionString });
        if (sessionInfo && sessionInfo.resultContext.success) {
          const userData = await UserQuery({
            key: sessionInfo.sessionSummary.email,
            identifier: "email",
          });
          if (userData && userData.resultContext.success) {
            setUserData(userData.userInfo);
          }
        }
      }
    };

    fetchItemData();
    itemId && fetchUserData();
  }, [itemId]);

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

  function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
    let newQuantity = Number(event.target.value);

    if (itemData && itemData.item.itemQuantity) {
      const quantity_of_item = itemData.item.itemQuantity;
      if (newQuantity > quantity_of_item) {
        newQuantity = quantity_of_item;
      } else if (newQuantity < 1) {
        newQuantity = 0;
      }
    } else {
      newQuantity = 1;
    }

    setQuantityToCart(newQuantity);
  }

  const InterestLevelComponent = ({
    logo,
    level,
    description,
  }: {
    logo: ReactNode;
    level: string;
    description: string;
  }) => {
    return (
      <div className="flex flex-col">
        <div className="flex flex-row">
          {logo}{" "}
          <span className="self-right text-xl font-bold text-purple-900">
            {level}
          </span>
        </div>
        <div className="self-right whitespace-pre text-normal-yellow">
          {description}
        </div>
      </div>
    );
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("URL copied to clipboard", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "colored",
      });
    } catch (error) {
      toast.error("Failed to copy URL to clipboard:", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "colored",
      });
    }
  };

  const noop = () => {};

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* <div>{JSON.stringify(itemData)}</div> */}
        {/* If nggak loading dan itemData nggak falsy (undefined gitu2) */}
        {!isLoading && itemData && itemData.item ? (
          <div className="m-0 flex min-h-screen flex-col py-0 lg:mx-auto lg:max-w-screen-lg lg:py-11 xl:max-w-screen-xl 2xl:max-w-screen-2xl">
            {/* 1. Row isi most of the content, kek images, merchant, interest dkk */}
            <div className="mx-auto flex flex-col items-center justify-around px-3 lg:flex-row lg:px-0">
              {/* 1.1. Images */}
              <div className="flex flex-col px-3">
                {/* 1.1.1 Image(s) */}
                <ItemImagesMultiple imageIds={itemData.item.itemImages} />
              </div>
              {/* 1.2. Title, Interest Level, Item Desc, Rating, Cat, Hob, Merchant Info */}
              <div className="flex flex-col px-0 lg:mx-14 lg:w-[900px]">
                {/* 1.2.1 Title */}
                <h3 className="mb-2 text-2xl font-bold">
                  {itemData.item.itemName}
                </h3>
                {/* 1.2.2 Rating (PLACEHOLDER FOR NOW) */}
                <div>
                  <HiStar
                    style={{
                      color: "yellow",
                      display: "inline",
                      height: "1.5em",
                      width: "1.5em",
                    }}
                  />
                  <span className="font-bold">{itemData.item.review} / 5</span>{" "}
                  <br />
                  <span className="font-bold">Overall Product Review</span>
                </div>

                <h1 className="py-3 text-3xl font-bold">
                  {FormatCurrencyIdr(itemData.item.itemPrice)}
                </h1>

                {/* 1.2.3 Category */}
                <h4 className="text-purple-500">
                  Category:{" "}
                  <span className="font-bold">
                    {itemData.item.itemCategory}
                  </span>
                </h4>
                {/* 1.2.4 Hobby */}
                <h4 className="text-bright-cyan">
                  Hobby:{" "}
                  <span className="font-bold">{itemData.item.hobby}</span>
                </h4>
                {/* 1.2.5 Interest Level (Bru Merchant doang) */}
                <div className="grid grid-cols-5 gap-2 pt-4">
                  <InterestLevelComponent
                    logo={
                      <HiBuildingStorefront
                        style={{
                          height: "2em",
                          width: "2em",
                          color: "#581C87",
                          paddingRight: "2px",
                        }}
                      />
                    }
                    level={capitalizeFirstLetter(itemData.item.merchantLevel)}
                    description={"Merchant Rating"}
                  />
                  <InterestLevelComponent
                    logo={
                      <HiUserGroup
                        style={{
                          height: "2em",
                          width: "2em",
                          color: "#581C87",
                          paddingRight: "2px",
                        }}
                      />
                    }
                    level={
                      itemData.item.userLevel === ""
                        ? "No Review"
                        : itemData.item.userLevel
                    }
                    description={"Community Rating"}
                  />
                </div>
                {/* 1.2.6 Item Desc (if any) */}
                <span className="pt-2 font-bold">Description:</span>
                <h5>
                  {itemData.item.itemDescription.length !== 0
                    ? itemData.item.itemDescription
                    : "No Description Given"}
                </h5>
                <MerchantInfo
                  data={itemData.item.merchantInfo}
                  className="pt-4"
                />
              </div>
              {/* 1.3. Quantity/Stock, buttons add to card/wishlist ect */}
              <div className="flex h-fit w-80 flex-col self-center rounded-lg border-2 border-solid border-gray-200 shadow-xl lg:self-start">
                {/* Quantity -- Stock, Button */}
                <div className="m-auto flex flex-col self-center py-2">
                  <span className="self-center">Quantity</span>
                  <div className="item-center flex flex-row self-center">
                    <HiMinusCircle
                      className={classNames("text-normal-blue", {
                        "cursor-pointer": quantityToCart > 1,
                        "cursor-not-allowed": quantityToCart === 1,
                      })}
                      style={{ height: "1.5em", width: "1.5em" }}
                      onClick={() => {
                        if (quantityToCart > 1) {
                          setQuantityToCart(quantityToCart - 1);
                        }
                      }}
                    />
                    <input
                      value={quantityToCart}
                      onKeyDown={handleKeyDownPreventWords}
                      onChange={handleQuantityChange}
                      className="block min-w-[64px] max-w-[64px] rounded-lg border border-gray-300 bg-white p-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <HiPlusCircle
                      className={classNames("text-normal-blue", {
                        "cursor-pointer":
                          quantityToCart < itemData.item.itemQuantity,
                        "cursor-not-allowed":
                          quantityToCart === itemData.item.itemQuantity,
                      })}
                      style={{ height: "1.5em", width: "1.5em" }}
                      onClick={() => {
                        if (quantityToCart < itemData.item.itemQuantity) {
                          setQuantityToCart(quantityToCart + 1);
                        }
                      }}
                    />
                  </div>
                  <span className="self-center">
                    Stock: {itemData.item.itemQuantity}
                  </span>
                </div>
                {/* Total Price */}
                <span className="self-center text-lg font-bold">
                  Total:{" "}
                  {FormatCurrencyIdrBigInt(
                    BigInt(quantityToCart * itemData.item.itemPrice)
                  )}
                </span>
                {/* Add to Cart Button */}
                <div className="px-4 pt-2 pb-1">
                  <button
                    className="w-full rounded bg-normal-blue py-2 px-4 font-bold text-white hover:bg-blue-700 disabled:bg-gray-500 "
                    disabled={quantityToCart === 0}
                    onClick={async (e) => {
                      e.preventDefault();
                      if (itemIdValid) {
                        const addResult = await CartAdd({
                          itemId: itemIdValid,
                          quantity: quantityToCart,
                        });
                        if (addResult && addResult.resultContext.success) {
                          toast.success("Successfully added to cart!", {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            theme: "colored",
                          });
                        }
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
                {/* Update Item Button */}
                {userData?.username === itemData.item.merchantInfo.username && (
                  <>
                    <div className="px-4 pt-1 pb-2">
                      <Link
                        href={`/merchant/${merchantEncoded}/update/${itemData.item.itemId}`}
                      >
                        <button className="w-full rounded bg-normal-green py-2 px-4 font-bold text-white hover:bg-blue-700">
                          Update Item
                        </button>
                      </Link>
                    </div>
                    <div className="px-4 pt-1 pb-2">
                      <DialogConfrim
                        trigger={
                          <button
                            className="w-full rounded bg-normal-red py-2 px-4 font-bold text-white hover:bg-blue-700"
                            type="button"
                            onClick={(e) => e.preventDefault()}
                          >
                            Delete Item
                          </button>
                        }
                        title="Are you sure you want to delete this item?"
                        onConfirm={async () => {
                          const wishlistResult = await ItemDelete({
                            itemId: itemData.item.itemId,
                          });
                          if (wishlistResult) {
                            if (wishlistResult.resultContext.success) {
                              router.push(`/merchant/${merchantEncoded}`);
                            }
                          }
                        }}
                      />
                    </div>
                  </>
                )}
                {/* Buttons, Wishlist, Chat, Forum, Share */}
                <div className="flex flex-row justify-evenly pb-2">
                  {isWishlisted ? (
                    <DialogConfrim
                      trigger={
                        <button
                          className="rounded bg-normal-blue px-1 hover:bg-bright-blue"
                          type="button"
                          onClick={(e) => e.preventDefault()}
                        >
                          <HiHeart
                            style={{ height: "1.7em", width: "1.7em" }}
                            className="fill-red-500"
                          />
                        </button>
                      }
                      title="Are you sure you want to remove from wishlist?"
                      onConfirm={async () => {
                        const wishlistResult = await WishlistRemove({
                          itemId: itemData.item.itemId,
                        });
                        if (wishlistResult) {
                          if (wishlistResult.resultContext.success) {
                            setIsWishlisted(false);
                            toast.success("Successfully deleted!", {
                              position: "top-center",
                              autoClose: 5000,
                              hideProgressBar: false,
                              theme: "colored",
                            });
                          }
                        }
                      }}
                    />
                  ) : (
                    <button
                      className="rounded bg-normal-blue px-1 hover:bg-bright-blue"
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();
                        const wishlistResult = await WishlistAdd({
                          itemId: itemData.item.itemId,
                        });
                        if (wishlistResult) {
                          if (wishlistResult.resultContext.success) {
                            setIsWishlisted(true);
                            toast.success("Successfully added!", {
                              position: "top-center",
                              autoClose: 5000,
                              hideProgressBar: false,
                              theme: "colored",
                            });
                          }
                        }
                      }}
                    >
                      <HiHeart
                        style={{ height: "1.7em", width: "1.7em" }}
                        className="fill-white"
                      />
                    </button>
                  )}
                  <div
                    className="cursor-pointer rounded bg-normal-blue px-1"
                    onClick={isLoading ? noop : handleCopyToClipboard}
                  >
                    <HiShare
                      className="text-white"
                      style={{ height: "1.7em", width: "1.7em" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <CommentSection postId={itemData.item.postId} userData={userData} />
          </div>
        ) : (
          <>Loading...</>
        )}
      </main>
    </>
  );
}
