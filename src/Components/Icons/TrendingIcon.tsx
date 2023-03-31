import React from "react";

export const TrendingIcon = ({
  htmlColor,
  classNameIcon,
}: {
  htmlColor?: string;
  classNameIcon?: string;
}) => {
  return (
    // https://heroicons.com/
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke={htmlColor ?? "currentColor"}
      className={classNameIcon ?? "h-6 w-6"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    </svg>
  );
};
