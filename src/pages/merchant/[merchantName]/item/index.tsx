import { ItemFilterBar } from "@/Components/ItemFilterBar";
import {
  MerchantInfoPage,
  MerchantPageNavigation,
} from "@/Components/MerchantInfo";
import { ProductCard } from "@/Components/ProductCard";
import { SearchBar } from "@/Components/SearchBar";
import { NotFoundWidget } from "@/Components/Widget";
import {
  ItemFilterQuery,
  UserQuery,
  parseNumberUndefined,
  urlFirstString,
} from "@/helper";
import { ItemQueryResult } from "@/types";
import { UserSummary } from "@/types/User";
import { sanitize } from "dompurify";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import styles from "../../../../styles/Paginate.module.css";

export default function MerchantItems() {
  // Di Page ini ntar show Merchant info dan list2 item mereka (singkat)
  // Ntar ada [merchantName]/item yang lbh detailed

  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);
  // Uat Dropwdown filter klo kecil
  const [isOpen, setIsOpen] = useState(false);

  const {
    qMerchant,
    merchantName,
    pMin,
    pMax,
    hob,
    itemCat,
    inLevMerchant,
    inLevUser,
    page,
  } = router.query;
  const [qMerchantString, setqMerchantString] = useState<string>();
  const [currentPage, setCurrentPage] = useState(0);

  const [inputValue, setInputValue] = useState("");

  const [items, setItems] = useState<ItemQueryResult | undefined>();

  const [pageTitle, setPageTitle] = useState("");
  const [merchantData, setMerchantData] = useState<UserSummary | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [merchantEncoded, setMerchantEncoded] = useState<string | undefined>();

  async function getMerchantInfo() {
    const checkMerchantName = urlFirstString(merchantName);
    if (checkMerchantName && !merchantData) {
      const merchantInfo = await UserQuery({
        key: checkMerchantName,
        identifier: "username",
      });

      if (merchantInfo?.resultContext.success) {
        setMerchantData(merchantInfo.userInfo);
      }
    }
  }

  const fetchQueriesName = async () => {
    setqMerchantString(urlFirstString(qMerchant));
    setInputValue(urlFirstString(qMerchant) ?? "");
  };

  const fetchQueriesPage = async () => {
    const tempPage = parseNumberUndefined(urlFirstString(page)) ?? 0;
    setCurrentPage(tempPage === 0 ? 0 : tempPage - 1);
  };

  const initialRenderResult = async () => {
    const pMinNumber = parseNumberUndefined(urlFirstString(pMin));
    const pMaxNumber = parseNumberUndefined(urlFirstString(pMax));

    setIsLoading(true);

    await getMerchantInfo();

    await fetchQueriesName();
    await fetchQueriesPage();
    if (urlFirstString(qMerchant) === qMerchantString && merchantData) {
      const itemQueried = await ItemFilterQuery({
        pageNumber: currentPage + 1,
        numberOfItem: 10, // bisa di ganti2 ntar tpi later
        filters: {
          itemName: qMerchantString || "",
          pMin: pMinNumber,
          pMax: pMaxNumber,
          hob: urlFirstString(hob),
          itemCat: urlFirstString(itemCat),
          inLevMerchant: urlFirstString(inLevMerchant),
          inLevUser: urlFirstString(inLevUser),
          merchantEmail: merchantData.email,
        },
      });

      if (itemQueried) {
        if (itemQueried.resultContext.success) {
          setIsLoading(false);
          setItems(itemQueried);
        }
      }
    }
  };

  useEffect(() => {
    setPageTitle(urlFirstString(merchantName) + " Items");
    setMerchantEncoded(encodeURIComponent(urlFirstString(merchantName)!));

    initialRenderResult();

    // Update screensize klo dirubah
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    router.isReady,
    merchantName,
    merchantData,
    qMerchant,
    qMerchantString,
    page,
  ]);

  function UpdateDiChild(replace_in_parent: ItemQueryResult) {
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
      pathname: `/merchant/${merchantEncoded}/item`,
      query: { qMerchant: inputValue },
    });
  };

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
    router.push({
      pathname: `/merchant/${merchantEncoded}/item`,
      query: {
        ...router.query,
        page: selectedPage.selected + 1,
      },
    });
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="m-0 flex min-h-screen flex-col py-0 lg:mx-auto lg:max-w-screen-lg lg:py-11 xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          {merchantData ? (
            <>
              <MerchantInfoPage data={merchantData} />
              <MerchantPageNavigation merchantName={merchantData.username} />
              <p className="px-3 pt-2 text-sm font-bold lg:text-lg">Products</p>
              <form className="px-3" onSubmit={handleEnter}>
                <SearchBar
                  onChange={handleChange}
                  value={inputValue}
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
                          <ItemFilterBar
                            page={`/merchant/${merchantEncoded}/item`}
                            searchQuery={qMerchantString}
                            setItemQueryResult={UpdateDiChild}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <ItemFilterBar
                      page={`/merchant/${merchantEncoded}/item`}
                      searchQuery={qMerchantString}
                      setItemQueryResult={UpdateDiChild}
                    />
                  )}
                </div>

                {isLoading ? (
                  <>Loading...</>
                ) : (
                  <div className="flex flex-col">
                    <div className="grid grid-cols-2 gap-4 py-2 px-2 lg:grid-cols-5 lg:py-4">
                      {items?.items.length !== 0 && items ? (
                        <>
                          {items.items.map((data) => {
                            return <ProductCard itemData={data} />;
                          })}
                        </>
                      ) : (
                        <>
                          <NotFoundWidget name="item" />
                        </>
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
            </>
          ) : (
            "Merchant not found"
          )}
        </div>
      </main>
    </>
  );
}
