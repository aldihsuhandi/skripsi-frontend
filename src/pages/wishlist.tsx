import { SearchBar } from "@/Components/SearchBar";
import { WishlistCard } from "@/Components/WishlistCard";
import { WishlistFilterBar } from "@/Components/WishlistFilterBar";
import {
  WishlistQuery,
  parseNumberUndefined,
  return0ifNan,
  urlFirstString,
} from "@/helper";
import { SessionValidate } from "@/helper/SessionHelper";
import { WishlistQueryResult } from "@/types/Wishlist";
import { sanitize } from "dompurify";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import styles from "../styles/Paginate.module.css";

export default function Wishlist() {
  const router = useRouter();
  // Uat Dropdown filter klo kecil (dibawah lg a.k.a 1024px)
  const [windowWidth, setWindowWidth] = useState(0);
  // Uat Dropwdown filter klo kecil
  const [isOpen, setIsOpen] = useState(false);

  const {
    qWish,
    pMin,
    pMax,
    pSort,
    hob,
    itemCat,
    inLevMerchant,
    inLevUser,
    page,
  } = router.query;
  const [qWishString, setqWishString] = useState<string>();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [inputValue, setInputValue] = useState("");

  const [items, setItems] = useState<WishlistQueryResult | undefined>();

  useEffect(() => {
    // Check session, klo nggak valid
    const sessionCheck = async () => {
      const isValidSession = await SessionValidate();
      if (isValidSession) {
        initialRenderResult();
      } else {
        router.push("/login");
      }
    };

    if (router.isReady) {
      sessionCheck();
    }

    const fetchQueriesName = async () => {
      setqWishString(urlFirstString(qWish));
    };

    const fetchQueriesPage = async () => {
      const tempPage = parseNumberUndefined(urlFirstString(page)) ?? 0;
      setCurrentPage(tempPage === 0 ? 0 : tempPage - 1);
    };

    const initialRenderResult = async () => {
      const pMinNumber = parseNumberUndefined(urlFirstString(pMin));
      const pMaxNumber = parseNumberUndefined(urlFirstString(pMax));

      setIsLoading(true);
      await fetchQueriesName();
      await fetchQueriesPage();
      if (
        urlFirstString(qWish) === qWishString
        // && urlFirstString(page) == page
      ) {
        const itemQueried = await WishlistQuery({
          pageNumber: currentPage + 1,
          numberOfItem: 10, // bisa di ganti2 ntar tpi later
          filters: {
            itemName: qWishString || "",
            pMin: pMinNumber,
            pMax: pMaxNumber,
            hob: urlFirstString(hob),
            itemCat: urlFirstString(itemCat),
            inLevMerchant: urlFirstString(inLevMerchant),
            inLevUser: urlFirstString(inLevUser),
          },
        });

        if (itemQueried) {
          if (itemQueried.resultContext.success) {
            setIsLoading(false);
            setItems(itemQueried);
          } else if (
            itemQueried.resultContext.resultCode === "SESSION_EXPIRED"
          ) {
            router.push("/login");
          } else {
            toast.error("An Unexpected error occured", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              theme: "colored",
            });
          }
        }
      }
    };

    // Update screensize klo dirubah
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [router.isReady, qWish, qWishString, page]);

  function UpdateDiChild(replace_in_parent: WishlistQueryResult) {
    setItems(replace_in_parent);
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const unsanitized = event.target.value;
    const value = sanitize(unsanitized);
    setInputValue(value);
  };

  const handleEnter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push({
      pathname: `/wishlist`,
      query: { qWish: inputValue },
    });
  };

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
    router.push({
      pathname: `/wishlist`,
      query: {
        ...router.query,
        page: selectedPage.selected + 1,
      },
    });
  };

  return (
    <>
      <Head>
        <title>Wishlist Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="m-0 min-h-screen lg:mx-auto lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          <p className="px-3 pt-2 text-sm font-bold lg:text-lg">Wishlist</p>
          <form className="px-3" onSubmit={handleEnter}>
            <SearchBar
              onChange={handleChange}
              value={qWishString ?? inputValue}
              autoComplete="off"
            />
          </form>
          <div className="lg:flex">
            <div className="flex min-w-[20%] flex-col pt-3 lg:basis-1/5">
              {windowWidth <= 1024 ? (
                // Dropdown wrapper
                <div className="mx-4 mt-4 mb-3 ">
                  {/* Dropdown "button"  */}
                  <div
                    className="cursor-pointer rounded bg-normal-blue"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <div className="flex items-center justify-center px-5 py-2 text-white">
                      Filters
                    </div>
                  </div>
                  {/* Content, filters */}
                  {isOpen && (
                    <div className="pt-4">
                      <WishlistFilterBar
                        page="wishlist"
                        searchQuery={qWishString}
                        setQueryResult={UpdateDiChild}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <WishlistFilterBar
                  page="wishlist"
                  searchQuery={qWishString}
                  setQueryResult={UpdateDiChild}
                />
              )}
            </div>

            {isLoading ? (
              <>Loading Placeholder</>
            ) : (
              <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-4 py-2 px-2 lg:grid-cols-5 lg:py-4">
                  {items?.wishlistItems.length !== 0 && items ? (
                    <>
                      {items.wishlistItems.map((data) => {
                        return <WishlistCard itemData={data} />;
                      })}
                    </>
                  ) : (
                    <>KOSONG PLACEHOLDER</>
                  )}
                </div>
                {items && (
                  <ReactPaginate
                    pageCount={items.pagingContext.totalPage}
                    onPageChange={handlePageClick}
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
            )}
          </div>
        </div>
      </main>
    </>
  );
}
