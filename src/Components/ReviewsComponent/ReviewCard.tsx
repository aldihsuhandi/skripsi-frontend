import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

export const ReviewCard = () => {
  return (
    <div className="p-2">
      <div className="relative flex min-h-fit min-w-full flex-col rounded-md border p-2 shadow-md">
        <h1 className="pb-2 text-base font-semibold">Daftar Produk</h1>
        <div className="flex flex-row">
          <div className="flex flex-col">
            <img
              src="https://i.imgur.com/uWxcO3M.png"
              alt=""
              className="h-40 w-40 rounded-md"
            />
          </div>
          <div className="flex flex-col px-2">
            <p className="pb-4 text-lg font-medium">
              [ Product's Name Goes Here ]
            </p>
            <p className="text-base font-normal">Has Not been Reviewed Yet</p>
          </div>
        </div>
        <div className="absolute bottom-2 right-2">
          <button className="rounded-md border border-normal-blue bg-normal-blue p-1 text-white hover:border-bright-blue hover:bg-bright-blue">
            Click to Review
          </button>
        </div>
      </div>
    </div>
  );
};
