import React, { HTMLAttributes } from "react";
import { HiHeart } from "react-icons/hi";

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  title: string;
  interestLevel: string;
  itemCategory: string;
  hobbyType: string;
  price: number;
}

export const ProductCard = ({
  imageSrc = "https://pbs.twimg.com/profile_images/1619599321912967168/jiaHG8w7_400x400.jpg",
  title,
  interestLevel,
  itemCategory,
  hobbyType,
  price,
  ...props
}: ProductCardProps) => {
  // bla bla
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
            <HiHeart size={20} className="fill-white" />
          </button>
          <span className="pointer-events-none absolute -top-7 right-0 w-max rounded-md p-1 text-sm font-light opacity-0 transition-opacity group-hover:bg-bright-white group-hover:opacity-100">
            Add to Wishlist
          </span>
        </div>
      </div>
    </div>
  );
};
