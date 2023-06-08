import {
  DateToFormattedString,
  TransactionCancel,
  TransactionFinish,
} from "@/helper";
import { FormatCurrencyIdrBigInt } from "@/helper/GeneralHelper/CurrencyHelper";
import { TransactionSummary } from "@/types/Transaction/TransactionQuery";
import router from "next/router";
import { HTMLAttributes } from "react";
import { HiShoppingBag } from "react-icons/hi2";
import { toast } from "react-toastify";
import { DialogConfrim } from "../DialogConfirm";

export interface TransactionCardProps extends HTMLAttributes<HTMLDivElement> {
  trx: TransactionSummary;
}

const getStatusColor = (status: string) => {
  if (status === "ONGOING") {
    return "bg-blue-200 text-blue-600";
  }
  if (status === "WAITING_PAYMENT") {
    return "bg-yellow-200 text-yellow-600";
  }
  if (status === "DONE") {
    return "bg-green-200 text-green-600";
  }
  if (status === "CANCELED") {
    return "bg-red-200 text-red-600";
  }
};

const getStatusStr = (status: string) => {
  if (status === "ONGOING") {
    return "Ongoing";
  }
  if (status === "WAITING_PAYMENT") {
    return "Waiting Payment";
  }
  if (status === "DONE") {
    return "Done";
  }
  if (status === "CANCELED") {
    return "Canceled";
  }
};

export const TransactionCard = ({ trx, ...props }: TransactionCardProps) => {
  const optionalButton = (status: string) => {
    console.log("status optional button: " + status);
    if (status === "ONGOING") {
      return (
        <DialogConfrim
          title="Please inspect your items to make sure it arrives safely"
          trigger={
            <button
              onClick={(e) => e.preventDefault()}
              className="m-1 rounded-md border-2 border-green-600 bg-green-100 p-1.5 text-sm font-semibold text-green-600"
            >
              Finish Transaction
            </button>
          }
          onConfirm={async () => {
            const result = await TransactionFinish(trx.transactionId);
            if (result && result.resultContext.success) {
            } else if (result && !result.resultContext.success) {
              toast.warning(result.resultContext.resultMsg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                theme: "colored",
              });
            }
          }}
        />
      );
    }

    if (status === "WAITING_PAYMENT") {
      return (
        <DialogConfrim
          trigger={
            <button
              onClick={(e) => e.preventDefault()}
              className="mx-1 rounded-md border-2 border-red-600 bg-red-100 p-1.5 text-sm font-semibold text-red-600"
            >
              Cancel Transaction
            </button>
          }
          title="Are you sure want to cancel this transaction?"
          onConfirm={async () => {
            const result = await TransactionCancel(trx.transactionId);
            if (result && result.resultContext.success) {
              router.reload();
            } else if (result && !result.resultContext.success) {
              toast.warning(result.resultContext.resultMsg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                theme: "colored",
              });
            }
          }}
        />
      );
    }
    return <></>;
  };

  return (
    <div className="m-2 w-full rounded-md border-2 border-solid border-gray-100 p-3 shadow-sm">
      <div className="flex flex-row items-center">
        <div className="flex flex-row flex-wrap items-center text-sm">
          <HiShoppingBag className="mr-2 h-5 w-5" />
          <div className="font-semibold">Shopping &ensp;</div>
          <div>{DateToFormattedString(trx.gmtCreate)}&ensp;</div>
          <div
            className={`${getStatusColor(
              trx.status
            )} rounded-sm py-0.5 px-1 text-center  text-xs font-semibold`}
          >
            {getStatusStr(trx.status)}
          </div>
          <div className="text-gray-500">&ensp;{trx.transactionId}</div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-between pt-2 text-sm">
        <div className="w-1/2 md:w-3/4">
          <p className="font-semibold">Payment</p>
          <div className="pt-2">Payment type : {trx.paymentType}</div>
          <div className="pt-1">Payment Number : {trx.paymentCode}</div>
        </div>
        <div className="flex w-1/2 flex-col flex-wrap items-start justify-center border-l-2 border-gray-400 pl-5 md:w-1/4 ">
          <div className="text-gray-600">Total Price</div>
          <div>{FormatCurrencyIdrBigInt(trx.price)}</div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-end pt-2 text-sm">
        {optionalButton(trx.status)}
        <a
          href={`/transaction/${trx.transactionId}`}
          target="_blank"
          className="m-1 justify-center rounded-md border-2 border-blue-500 p-1.5 text-sm font-semibold text-blue-500"
        >
          See Detail
        </a>
      </div>
    </div>
  );
};
