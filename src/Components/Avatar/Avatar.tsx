import React, { ImgHTMLAttributes } from "react";
import classNames from "classnames";

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  rounded?: boolean;
}

export const Avatar = ({ src, alt, rounded, ...props }: AvatarProps) => {
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
        "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg"
      }
      alt={alt ?? "no alt provided"}
      {...props}
    />
  );
};
