import React, { HTMLAttributes } from "react";

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  title: string;
  interestLevel: string; // Unsure ntar string ato nggak, bisa diganti
  price: number;
}

export const ProductCard = ({
  imageSrc = "https://pbs.twimg.com/profile_images/1619599321912967168/jiaHG8w7_400x400.jpg",
  title,
  interestLevel,
  price,
  ...props
}: ProductCardProps) => {
  // bla bla
  return (
    // gw taro h-fit w-fit doa bisa langsung nyesuain ama grid ntar...
    <div
      className="h-fit w-fit rounded-lg border-2 border-solid border-normal-white"
      {...props}
    >
      <div className="flex flex-col p-2">
        <img src={imageSrc} alt="ProductCardImage" />
        <p className="font-sans text-sm lg:text-lg">{title}</p>
        <p className="font-sans text-sm lg:text-lg">{interestLevel}</p>
        <p className="font-sans text-sm lg:text-lg">
          Rp. {price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
