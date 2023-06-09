import { TransactionCard } from "@/Components/Transaction";
import { NotFoundWidget } from "@/Components/Widget";
import {
  urlFirstString,
  parseNumberUndefined,
  TransactionQuery,
} from "@/helper";
import { SessionValidate } from "@/helper/SessionHelper";
import { TransactionQueryResult } from "@/types";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { HiShoppingCart } from "react-icons/hi2";
import ReactPaginate from "react-paginate";
import styles from "../../styles/Paginate.module.css";

export default function transaction() {
  const router = useRouter();

  const { page, qStatus } = router.query;

  const [status, setStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [transactions, setTransactions] = useState<TransactionQueryResult>();

  useEffect(() => {
    const sessionCheck = async () => {
      const isValidSession = await SessionValidate();
      if (!isValidSession) {
        router.push("/login");
      }
    };

    const fetchStatusFromUrl = async () => {
      setStatus(urlFirstString(qStatus) ?? "");
      console.log(status);
    };

    const fetchPageFromUrl = async () => {
      const tempPage = parseNumberUndefined(urlFirstString(page)) ?? 0;
      setCurrentPage(tempPage === 0 ? 0 : tempPage - 1);
      console.log(currentPage);
    };

    if (router.isReady) {
      sessionCheck();
    }

    const transactionQuery = async () => {
      await fetchStatusFromUrl();
      await fetchPageFromUrl();
      const result = await TransactionQuery(status, currentPage + 1);
      setTransactions(result);
    };

    transactionQuery();
  }, [router.isReady, qStatus, page]);

  const changeStatus = (stat: string) => {
    router.push({
      pathname: `/transaction`,
      query: {
        qStatus: stat,
        page: 1,
      },
    });
    setStatus(stat);
    setCurrentPage(0);
  };

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
    router.push({
      pathname: `/transaction`,
      query: {
        ...router.query,
        page: selectedPage.selected + 1,
      },
    });
  };

  const getSelected = (button: string) => {
    return status === button
      ? "bg-blue-200 border-blue-500 text-blue-500"
      : "bg-white border-gray-200 text-gray-500 ";
  };

  const TransactionWidget = () => {
    if (
      transactions &&
      transactions.transactions &&
      transactions.transactions.length != 0
    ) {
      return transactions.transactions.map((data) => (
        <TransactionCard trx={data} />
      ));
    }
    return (
      <>
        <NotFoundWidget name="transaction" />
      </>
    );
  };

  return (
    <>
      <Head>
        <title>ShumiShumi: Transaction History</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="m-0 min-h-screen lg:mx-auto lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl ">
          <div className="flex flex-col p-10">
            <p className="flex flex-row pt-2 pb-5 text-xl font-bold">
              <HiShoppingCart className="mx-1 h-7 w-7" />
              Shopping History
            </p>
            <div className="w-full rounded-lg border-2 border-solid border-gray-200 p-3">
              <div className="flex w-full flex-row flex-wrap items-center pb-2">
                <div className="text-bold pr-3 lg:pr-10">Status</div>
                <button
                  className={`${getSelected(
                    ""
                  )} mx-1 my-1 rounded-lg border-2 border-solid py-1 px-2 md:my-0 `}
                  onClick={() => {
                    changeStatus("");
                  }}
                >
                  All
                </button>
                <button
                  className={`${getSelected(
                    "Waiting Payment"
                  )} mx-1 my-1 rounded-lg border-2 border-solid py-1 px-2 md:my-0 `}
                  onClick={() => {
                    changeStatus("Waiting Payment");
                  }}
                >
                  Waiting Payment
                </button>
                <button
                  className={`${getSelected(
                    "Ongoing"
                  )} mx-1 my-1 rounded-lg border-2 border-solid py-1 px-2 md:my-0 `}
                  onClick={() => {
                    changeStatus("Ongoing");
                  }}
                >
                  Ongoing
                </button>
                <button
                  className={`${getSelected(
                    "Done"
                  )} mx-1 my-1 rounded-lg border-2 border-solid py-1 px-2 md:my-0 `}
                  onClick={() => {
                    changeStatus("Done");
                  }}
                >
                  Done
                </button>
                <button
                  className={`${getSelected(
                    "Canceled"
                  )} mx-1 my-1 rounded-lg border-2 border-solid py-1 px-2 md:my-0 `}
                  onClick={() => {
                    changeStatus("Canceled");
                  }}
                >
                  Canceled
                </button>
                <button
                  className="text-semibold pl-3 underline lg:pl-10"
                  onClick={() => {
                    changeStatus("");
                  }}
                >
                  Reset Filter
                </button>
              </div>
              <div className="flex w-full flex-col items-center justify-center">
                {TransactionWidget()}
              </div>
              <div>
                {transactions && (
                  <ReactPaginate
                    pageCount={transactions.pagingContext.totalPage}
                    onPageChange={handlePageChange}
                    // initialPage={currentPage}
                    forcePage={currentPage}
                    nextLabel=">"
                    previousLabel="<"
                    breakLabel="..."
                    // disableInitialCallback
                    // Stylings
                    containerClassName={styles.pagination}
                    pageLinkClassName={styles.pagelink}
                    activeClassName={styles.active}
                    activeLinkClassName={styles.active}
                    breakClassName={styles.pagelink}
                    previousLinkClassName={styles.pagelink}
                    nextLinkClassName={styles.pagelink}
                    disabledLinkClassName={styles.disabled}
                    renderOnZeroPageCount={null}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
