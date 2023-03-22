import React from "react";
import classNames from "classnames";

export interface AvatarProps {
  src?: string;
  alt?: string;
  rounded?: boolean;
}

export const Avatar = ({ src, alt, rounded }: AvatarProps) => {
  // bla
  return (
    <img
      className={classNames(
        "h-10 w-10",
        { "rounded-full": rounded },
        { rounded: !rounded }
      )}
      src={
        src ??
        "https://pbs.twimg.com/profile_images/1619599321912967168/jiaHG8w7_400x400.jpg"
      }
      alt={alt ?? "no alt provided"}
    />
  );
};
