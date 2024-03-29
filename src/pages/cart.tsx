import { CartItem } from "@/Components/CartItem";
import { CartQuery } from "@/helper";
import { FormatCurrencyIdr, FormatCurrencyIdrBigInt } from "@/helper/GeneralHelper/CurrencyHelper";
import { SessionValidate } from "@/helper/SessionHelper";
import { TransactionCreate } from "@/helper/Transaction";
import { CartQueryResult, CartSummary } from "@/types";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

export default function Cart() {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartPrice, setCartPrice] = useState<bigint>(BigInt(0));
  // uat cek paginContext yang support infinite Scroll
  const [cartLatest, setCartLatest] = useState<CartQueryResult | undefined>();
  const [totalCartItems, setTotalCartItems] = useState<CartSummary[]>([]);
  // Uat tau yang selected yang mana aja
  const [curPage, setCurPage] = useState(2);

  useEffect(() => {
    // Check session, klo nggak valid
    const sessionCheck = async () => {
      const fetchCart = async () => {
        setIsLoading(true);
        const cartQueryItem = await CartQuery({
          pageNumber: 1,
          numberOfItems: 5,
        });

        if (cartQueryItem) {
          if (cartQueryItem.resultContext.success) {
            setIsLoading(false);
            setCartLatest(cartQueryItem);
            setTotalCartItems(totalCartItems.concat(cartQueryItem.carts));
            setCartPrice(cartQueryItem.price);
          }
        }
      };

      const isValidSession = await SessionValidate();
      if (isValidSession) {
        fetchCart();
      } else {
        router.push("/login");
      }
    };

    sessionCheck();
    // Update screensize klo dirubah
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const infiniteCartFetchMore = async () => {
    const cartQueryItem = await CartQuery({
      pageNumber: curPage,
      numberOfItems: 2,
    });

    setCurPage(curPage + 1);

    if (cartQueryItem) {
      if (cartQueryItem.resultContext.success) {
        setIsLoading(false);
        setCartLatest(cartQueryItem);
        setTotalCartItems(totalCartItems.concat(cartQueryItem.carts));
        setCartPrice(cartQueryItem.price);
      }
    }
  };

  function UpdateCartPrice(price_replacement: bigint) {
    setCartPrice(price_replacement);
  }

  const DeleteFromTotal = (itemId: string) => {
    setTotalCartItems((prevItems) => {
      const temp = [...prevItems];
      temp.splice(
        temp.findIndex((e) => e.itemSummary.itemId === itemId),
        1
      );
      return temp;
    });
  };

  const BuyButton = () => {
    return (
      <button
        className="w-full rounded bg-normal-blue px-24 py-2  font-bold text-white hover:bg-blue-700"
        disabled={isLoading || cartPrice === BigInt(0)}
        onClick={async () => {
          const createTransRes = await TransactionCreate();

          if (createTransRes && createTransRes.resultContext.success) {
            router.push({
              pathname: "/transaction/PickPaymentType",
              query: { transId: createTransRes.transactionId },
            });
          } else if (!createTransRes?.resultContext.success) {
            toast.error(
              "Something went wrong when trying to create the transaction",
              {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                theme: "colored",
              }
            );
          }
        }}
      >
        Buy
      </button>
    );
  };

  return (
    <>
      <Head>
        <title>Cart</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="m-0 min-h-screen lg:mx-auto lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          <div className="flex flex-row px-3 pt-2 lg:px-0">
            <p className="ml-2 text-sm font-bold lg:text-lg">Cart</p>
          </div>

          <div className="flex flex-row">
            {isLoading ? (
              <>Loading...</>
            ) : (
              <div className="basis-full px-2 lg:basis-2/3 lg:p-0">
                {cartLatest && totalCartItems ? (
                  <InfiniteScroll
                    dataLength={totalCartItems.length}
                    next={infiniteCartFetchMore}
                    hasMore={cartLatest.pagingContext.hasNext}
                    loader={<h4 className="text-center">Loading...</h4>}
                  >
                    {totalCartItems.map((e) => (
                      <div className="py-2">
                        <CartItem
                          cartItemData={e}
                          setUpdateCartPrice={UpdateCartPrice}
                          onDelete={DeleteFromTotal}
                        />
                      </div>
                    ))}
                  </InfiniteScroll>
                ) : (
                  <>Empty!</>
                )}
              </div>
            )}
            {windowWidth > 1024 ? (
              <div className="m-3 h-fit rounded border-2">
                <div className="py-2 px-8 text-center">
                  <p className="text-lg font-bold">Total Price:</p>
                  <br />
                  {isLoading ? (
                    <>Loading...</>
                  ) : (
                    <>{FormatCurrencyIdrBigInt(cartPrice)}</>
                  )}
                </div>
                <div className="min-w-[64px] px-4 pb-2">
                  <BuyButton />
                </div>
              </div>
            ) : undefined}
          </div>
          {windowWidth < 1024 ? (
            <div className="sticky bottom-0 border-t-4 border-t-normal-white bg-bright-white">
              <div className="py-2 px-8 text-center">
                <p className="text-lg font-bold">Total Price:</p>
                {isLoading ? (
                  <>Loading...</>
                ) : (
                  <>{FormatCurrencyIdrBigInt(cartPrice)}</>
                )}
              </div>
              <div className="min-w-[64px] px-4 pb-2">
                <BuyButton />
              </div>
            </div>
          ) : undefined}
        </div>
      </main>
    </>
  );
}
