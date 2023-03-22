import React from "react";
import { UrlObject } from "url";

import { CartIcon } from "../Icons/CartIcon";
import { HistoryIcon } from "../Icons/HistoryIcon";
import { ForumIcon } from "../Icons/ForumIcon";
import { ChatIcon } from "../Icons/ChatIcon";
import { Color, COLOR_HEX_STRING } from "../Color";

export interface HeaderNavigationProps {
  href: string | UrlObject;
  icon: React.ReactNode;
}

export const HeaderNavigation: HeaderNavigationProps[] = [
  {
    href: "/ShoppingCart",
    icon: (
      <CartIcon
        htmlColor={COLOR_HEX_STRING[Color.Purple]}
        classNameIcon="h-7 w-7"
      />
    ),
  },
  {
    href: "/ShoppingHistory",
    icon: (
      <HistoryIcon
        htmlColor={COLOR_HEX_STRING[Color.Purple]}
        classNameIcon="h-7 w-7"
      />
    ),
  },
  {
    href: "/Forum",
    icon: (
      <ForumIcon
        htmlColor={COLOR_HEX_STRING[Color.Purple]}
        classNameIcon="h-7 w-7"
      />
    ),
  },
  {
    href: "/Chat",
    icon: (
      <ChatIcon
        htmlColor={COLOR_HEX_STRING[Color.Purple]}
        classNameIcon="h-7 w-7"
      />
    ),
  },
];
