import React from "react";
import { UrlObject } from "url";

import { Color, COLOR_HEX_STRING } from "../Color";
import { CartIcon, ForumIcon, ChatIcon } from "../Icons";

export interface HeaderNavigationProps {
  href: string | UrlObject;
  icon: React.ReactNode;
}

export const HeaderNavigation: HeaderNavigationProps[] = [
  {
    href: "/cart",
    icon: (
      <CartIcon
        htmlColor={COLOR_HEX_STRING[Color.NormalBlue]}
        classNameIcon="h-7 w-7"
      />
    ),
  },
  // {
  //   href: "/ShoppingHistory",
  //   icon: (
  //     <HistoryIcon
  //       htmlColor={COLOR_HEX_STRING[Color.NormalBlue]}
  //       classNameIcon="h-7 w-7"
  //     />
  //   ),
  // },
  {
    href: "/Forum",
    icon: (
      <ForumIcon
        htmlColor={COLOR_HEX_STRING[Color.NormalBlue]}
        classNameIcon="h-7 w-7"
      />
    ),
  },
  {
    href: "/Chat",
    icon: (
      <ChatIcon
        htmlColor={COLOR_HEX_STRING[Color.NormalBlue]}
        classNameIcon="h-7 w-7"
      />
    ),
  },
];
