import { ItemFilterBar } from "@/Components/ItemFilterBar";
import { ProductCard } from "@/Components/ProductCard";
import {
  ItemFilterQuery,
  parseNumberUndefined,
  urlFirstString,
} from "@/helper";
import { ItemQueryResult, ItemSummary } from "@/types";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Search() {
  const router = useRouter();
  // Uat Dropdown filter klo kecil (dibawah lg a.k.a 1024px)
  const [windowWidth, setWindowWidth] = useState(0);
  // Uat Dropwdown filter klo kecil
  const [isOpen, setIsOpen] = useState(false);

  const { q, pMin, pMax, pSort, hob, itemCat, inLevMerchant, inLevUser } =
    router.query;
  const pageTitle = `Search ${urlFirstString(q) ?? ""}`;
  const [qString, setQString] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Uat most recent items, uat ngecheck success ato nggak
  const [items, setItems] = useState<ItemQueryResult | undefined>();
  // Uat total items, uat infinite scroll
  const [totalItems, setTotalItems] = useState<ItemSummary[]>([]);
  // Uat keep track udh page brp, mulai dari 2, karena page 1 di handle useEffect
  const [curPage, setCurPage] = useState(2);

  useEffect(() => {
    const fetchQueriesName = async () => {
      setQString(urlFirstString(q));
    };

    const initialRenderResult = async () => {
      const pMinNumber = parseNumberUndefined(urlFirstString(pMin));
      const pMaxNumber = parseNumberUndefined(urlFirstString(pMax));

      setIsLoading(true);
      await fetchQueriesName();
      if (urlFirstString(q) === qString) {
        const itemQueried = await ItemFilterQuery({
          filters: {
            itemName: qString || "",
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
            setTotalItems(totalItems.concat(itemQueried.items));
          } else {
            // nggak success
            if (itemQueried.resultContext.resultCode === "SESSION_EXPIRED") {
              // Session dah expired
              router.push("/login");
            } else {
              toast.error(
                "We were unable to process your search request, please try again later!",
                {
                  position: "top-center",
                  autoClose: 10000,
                  hideProgressBar: false,
                  theme: "colored",
                }
              );
            }
          }
        }
      }
    };

    if (router.isReady) {
      initialRenderResult();
    }

    // Update screensize klo dirubah
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [router.isReady, q, qString]);

  function UpdateItemsDiChild(replace_items_in_parent: ItemQueryResult) {
    setCurPage(2); // Reset back to default when new filter is applied
    setItems(replace_items_in_parent);
  }

  function UpdateTotalItemsDiChild(
    replace_total_items_in_parent: ItemSummary[]
  ) {
    setCurPage(2); // Reset back to default when new filter is applied
    setTotalItems(replace_total_items_in_parent);
  }

  const infiniteFetchMore = async () => {
    const pMinNumber = parseNumberUndefined(urlFirstString(pMin));
    const pMaxNumber = parseNumberUndefined(urlFirstString(pMax));

    const infiniteItemFetchMore = await ItemFilterQuery({
      pageNumber: curPage,
      numberOfItem: 10,
      filters: {
        itemName: qString || "",
        pMin: pMinNumber,
        pMax: pMaxNumber,
        hob: urlFirstString(hob),
        itemCat: urlFirstString(itemCat),
        inLevMerchant: urlFirstString(inLevMerchant),
        inLevUser: urlFirstString(inLevUser),
      },
    });

    setCurPage(curPage + 1);

    if (infiniteItemFetchMore) {
      if (infiniteItemFetchMore.resultContext.success) {
        setItems(infiniteItemFetchMore);
        setTotalItems(totalItems.concat(infiniteItemFetchMore.items));
      }
    }
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
        <div className="m-0 min-h-screen lg:mx-auto lg:flex lg:max-w-screen-lg  xl:max-w-screen-xl 2xl:max-w-screen-2xl">
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
                    page="search"
                    searchQuery={qString}
                    setItemQueryResult={UpdateItemsDiChild}
                    setTotalItemQueryResult={UpdateTotalItemsDiChild}
                  />
                </div>
              )}
            </div>
          ) : (
            <ItemFilterBar
              page="search"
              searchQuery={qString}
              setItemQueryResult={UpdateItemsDiChild}
              setTotalItemQueryResult={UpdateTotalItemsDiChild}
            />
          )}
          <div>
            <button onClick={() => console.log(curPage, "curPage")}>
              curPage
            </button>
            {isLoading ? (
              <>Loading Placeholder</>
            ) : (
              <>
                {renderResult({
                  items: items,
                  totalItems: totalItems,
                  fetchMore: infiniteFetchMore,
                })}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

const renderResult = ({
  items,
  totalItems,
  fetchMore,
}: {
  items: ItemQueryResult | undefined;
  totalItems: ItemSummary[];
  fetchMore: () => void;
}) => {
  if (items) {
    if (items.resultContext.success) {
      if (totalItems.length !== 0) {
        return (
          <>
            {RenderItems({
              items: items,
              totalItems: totalItems,
              fetchMore: fetchMore,
            })}
          </>
        );
      } else {
        return <>Result is Empty!</>;
      }
    } else {
      <>An Error Occured!</>;
    }
  } else {
    <>Encoutered a Problem</>;
  }
};

const RenderItems = ({
  items,
  totalItems,
  fetchMore,
}: {
  items: ItemQueryResult;
  totalItems: ItemSummary[];
  fetchMore: () => void;
}) => {
  return (
    <InfiniteScroll
      dataLength={totalItems.length}
      next={fetchMore}
      hasMore={items.pagingContext.hasNext}
      loader={<h4 className="text-center">Loading...</h4>}
    >
      <div className="grid grid-cols-2 gap-4 py-2 px-2 lg:grid-cols-5 lg:py-4">
        {totalItems.map((data) => (
          <ProductCard itemData={data} />
        ))}
      </div>
    </InfiniteScroll>
  );
};
