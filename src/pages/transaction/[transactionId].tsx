import { DialogConfrim } from "@/Components/DialogConfirm";
import { TransactionItem } from "@/Components/Transaction/TransactionItem";
import {
  DateToFormattedString,
  TransactionCancel,
  TransactionFinish,
  urlFirstString,
} from "@/helper";
import { FormatCurrencyIdrBigInt } from "@/helper/GeneralHelper/CurrencyHelper";
import { TransactionDetail } from "@/helper/Transaction/TransactionQueryCall";
import {
  TransactionDetailSummary,
  TransactionSummary,
} from "@/types/Transaction/TransactionQuery";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  HiOutlineReceiptTax,
  HiOutlineShoppingBag,
  HiShoppingBag,
} from "react-icons/hi";
import { toast } from "react-toastify";

export default function TransactionDetailPage() {
  const router = useRouter();
  const { transactionId } = router.query;
  const [transaction, setTransaction] = useState<TransactionSummary>();

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

  const OptionalButton = () => {
    if (!transaction) {
      return <></>;
    }

    if (transaction.status === "WAITING_PAYMENT") {
      return (
        <>
          <button className="mx-1 rounded-md border-2 border-yellow-600 bg-yellow-100 p-1.5 text-sm font-semibold text-yellow-600">
            Check Payment Status
          </button>
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
              const result = await TransactionCancel(transaction.transactionId);
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
        </>
      );
    }

    if (transaction.status === "ONGOING") {
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
            const result = await TransactionFinish(transaction.transactionId);
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
    return <></>;
  };

  const MerchantItems = () => {
    if (!transaction) {
      return <></>;
    }

    return (
      <>
        {Object.entries(transaction.details).map(([merchantName, value]) => (
          <div key={merchantName} className="flex w-full flex-col">
            <div className="flex flex-row items-center pb-3">
              <HiOutlineShoppingBag className="mr-2 h-5 w-5" />
              <p>{merchantName}</p>
            </div>
            {value.map((data: TransactionDetailSummary) => {
              return (
                <div className="flex w-full flex-row items-center">
                  <TransactionItem key={data.item.itemId} detail={data} />
                </div>
              );
            })}
          </div>
        ))}
      </>
    );
  };

  useEffect(() => {
    const trxQuery = async () => {
      const trxId = urlFirstString(transactionId);
      if (!trxId) {
        return;
      }

      const result = await TransactionDetail(trxId);
      if (result && result.resultContext.success) {
        setTransaction(result.transaction);
      } else if (result) {
        let msg = "The System is busy, please try again later";
        if (result.resultContext.resultCode === "USER_INVALID") {
          msg = "You don't have permission to view this!";
        } else if (
          result.resultContext.resultCode === "TRANSACTION_NOT_FOUND"
        ) {
          msg = "Transaction detail doesn't exist in our system!";
        }

        toast.warning(msg, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    };

    if (transactionId) {
      trxQuery();
    }
  }, [transactionId]);

  if (!transaction) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>ShumiShumi: Transaction Detail</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="m-0 min-h-screen lg:mx-auto lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl ">
        <div className="flex flex-col p-10">
          <p className="flex flex-row pt-2 pb-5 text-xl font-bold">
            <HiShoppingBag className="mx-1 h-7 w-7" />
            Shopping detail
          </p>

          <div className="my-1 w-full rounded-lg border-2 border-solid border-gray-200 p-4">
            <div className="flex flex-col justify-between md:flex-row md:items-center">
              <div className="flex flex-col md:flex-row">
                <div className="w-48 text-gray-500">Invoice</div>
                <div>:&ensp;{transaction.transactionId}</div>
              </div>
              <div
                className={`${getStatusColor(
                  transaction.status
                )} rounded-sm py-1 px-2 text-center  text-sm font-semibold`}
              >
                {getStatusStr(transaction.status)}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row">
                <div className="w-48 text-gray-500">Shopping Date</div>
                <div>:&ensp;{DateToFormattedString(transaction.gmtCreate)}</div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-end">
              <OptionalButton />
            </div>
          </div>

          <div className="my-1 w-full rounded-lg border-2 border-solid border-gray-200 p-4">
            <div className="flex w-full flex-col">
              <div className="text-md flex flex-row items-center font-semibold">
                <HiOutlineReceiptTax className="h-7 w-7" /> Payment Detail
              </div>

              <div className="flex w-full flex-col items-center justify-start md:flex-row md:justify-between">
                <div className="md:w-3/4">
                  <div className="pt-2">
                    &ensp;&ensp;Payment type : {transaction.paymentType}
                  </div>
                  <div className="pt-1">
                    &ensp;&ensp;Payment Number : {transaction.paymentCode}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center border-l-2 border-gray-400 pl-5 md:w-1/4 md:items-start ">
                  <div className="text-gray-600">Total Price</div>
                  <div>{FormatCurrencyIdrBigInt(transaction.price)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-1 w-full rounded-lg border-2 border-solid border-gray-200 p-4">
            <MerchantItems />
          </div>
        </div>
      </div>
    </>
  );
}
