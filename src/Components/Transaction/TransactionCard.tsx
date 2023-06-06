import { DateToFormattedString } from "@/helper";
import { FormatCurrencyIdrBigInt } from "@/helper/GeneralHelper/CurrencyHelper";
import { TransactionSummary } from "@/types/Transaction/TransactionQuery";
import { HTMLAttributes } from "react";
import { HiShoppingBag } from "react-icons/hi2";

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
  return (
    <div className="m-2 w-full rounded-md border-2 border-solid border-gray-100 p-3 shadow-sm">
      <div className="flex flex-row items-center">
        <HiShoppingBag className="mr-2 h-5 w-5" />
        <div className="flex flex-row items-center text-sm">
          <div className="font-semibold">Belanja &ensp;</div>
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
        <div className="w-3/4">
          <p className="font-semibold">Payment</p>
          <div className="pt-2">&emsp;Payment type : {trx.paymentType}</div>
          <div className="pt-1">&emsp;Payment Number : {trx.paymentCode}</div>
        </div>
        <div className="flex w-1/4 flex-col items-start justify-center border-l-2 border-gray-400 pl-5 ">
          <div className="text-gray-600">Total Belanja</div>
          <div>{FormatCurrencyIdrBigInt(trx.price)}</div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-end pt-2 text-sm">
        <a
          href="#"
          className="m-1 rounded-md border-2 border-blue-500 p-1.5 text-sm font-semibold text-blue-500"
        >
          Lihat Detail Transaksi
        </a>
      </div>
    </div>
  );
};
