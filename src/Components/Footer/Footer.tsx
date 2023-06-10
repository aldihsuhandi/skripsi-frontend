import React from "react";

export const Footer = () => {
  return (
    <div className="bottom-0 border-t-2 border-solid border-normal-white">
      <div className="m-0 lg:mx-auto lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex items-center p-0 lg:px-4 lg:py-8">
          {/* © SHUMISHUMI Application <br /> Contents nanti, ni muncul tiap page */}
          <img
            className="h-full w-14 p-1"
            src="/Logo-no-text-color-fixed-small.png"
          />
          <p>© 2023 SHUMISHUMI Application. All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};
