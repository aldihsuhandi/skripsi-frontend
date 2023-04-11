import React from "react";
import { UrlObject } from "url";
import { Color, COLOR_HEX_STRING } from "../Color";
import { CartIcon, ForumIcon, ChatIcon } from "../Icons";

export interface NonLoginHeaderProps {
  href: string | UrlObject;
  icon: React.ReactNode;
}

export const NonLoginHeaderNav: NonLoginHeaderProps[] = [
  {
    href: "/ShoppingCart",
    icon: (
      <CartIcon
        htmlColor={COLOR_HEX_STRING[Color.NormalBlue]}
        classNameIcon="h-7 w-7"
      />
    ),
  },
  {
    href: "/Forum",
    icon: (
      <ForumIcon
        htmlColor={COLOR_HEX_STRING[Color.NormalBlue]}
        classNameIcon="h-7 w-7"
      />
    ),
  },
  // {
  //   href: "/Chat",
  //   icon: (
  //     <ChatIcon
  //       htmlColor={COLOR_HEX_STRING[Color.NormalBlue]}
  //       classNameIcon="h-7 w-7"
  //     />
  //   ),
  // },
];
