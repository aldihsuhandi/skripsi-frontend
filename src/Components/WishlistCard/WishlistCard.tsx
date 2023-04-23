import React, { HTMLAttributes } from "react";
import { HiShoppingCart, HiTrash } from "react-icons/hi";

export interface WishlistCardProps extends HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  title: string;
  interestLevel: string;
  itemCategory: string;
  hobbyType: string;
  price: number;
}

export const WishlistCard = ({
  imageSrc = "https://i.imgur.com/HYCmY98.jpeg",
  title,
  interestLevel,
  itemCategory,
  hobbyType,
  price,
  ...props
}: WishlistCardProps) => {
  return (
    <div
      //utk sementara hover -> cursor pointer (biar inget aja, ntar pas 1 cardnya dipencet, langsung di redirect ke item page nya)
      className="h-fit w-fit cursor-pointer rounded-lg border-2 border-solid border-normal-white hover:shadow-lg"
      {...props}
    >
      <div className="flex flex-col p-3">
        <img className="rounded-md" src={imageSrc} alt="WishlistCardImage" />
        <p className="font-sans text-sm font-semibold lg:text-xl">{title}</p>
        <p className="font-sans text-sm lg:text-lg">{interestLevel}</p>
        <p className="font-sans text-sm lg:text-lg">{itemCategory}</p>
        <p className="font-sans text-sm lg:text-lg">{hobbyType}</p>
        <p className="font-sans text-sm lg:text-lg">
          Rp. {price.toLocaleString()}
        </p>
      </div>
      <div className="flex flex-row justify-end gap-2 p-3">
        <div className="group relative w-max">
          <button
            className="rounded-full bg-normal-blue p-2 hover:bg-bright-blue"
            type="button"
          >
            <HiShoppingCart size={20} className="fill-white" />
          </button>
          <span className="pointer-events-none absolute -top-7 right-0 w-max rounded-md p-1 text-sm font-light opacity-0 transition-opacity group-hover:bg-bright-white group-hover:opacity-100">
            Add to Cart
          </span>
        </div>
        <div className="group relative w-max">
          <button
            className="rounded-full bg-red-500 p-2 hover:bg-red-400"
            type="button"
          >
            <HiTrash size={20} className="fill-white" />
          </button>
          <span className="pointer-events-none absolute -top-7 left-0 w-max rounded-md p-1 text-sm font-light opacity-0 transition-opacity group-hover:bg-bright-white group-hover:opacity-100">
            Remove Item
          </span>
        </div>
      </div>
      {/*===> Yg ini kgk jadi :v <===*/}
      {/* <div className="flex flex-row p-2">
        <img
          className="h-full w-32 rounded-md"
          src={imageSrc}
          alt="WishlistCardImage"
        />
        <div className="flex flex-col justify-center p-2">
          <p className="font-sans text-sm lg:text-lg">{title}</p>
          <p className="font-sans text-sm lg:text-lg">{interestLevel}</p>
          <p className="font-sans text-sm lg:text-lg">
            Rp. {price.toLocaleString()}
          </p>
        </div>
        <div className="ml-auto mr-2 flex items-center">
          <div className="flex flex-col gap-2">
            <div className="rounded-md bg-normal-blue p-1 text-center">
              <button className="text-white">Add to Cart</button>
            </div>
            <div className="rounded-md bg-bright-white p-1 text-center">
              <button className="text-normal-blue">Visit Item Page</button>
            </div>
            <div className="rounded-md bg-red-500 p-1 text-center">
              <button className="text-white">Remove Item</button>
            </div>
          </div>
        </div>
      </div> */}
      {/*===> Yg ini kgk jadi :v <===*/}
    </div>
  );
};
