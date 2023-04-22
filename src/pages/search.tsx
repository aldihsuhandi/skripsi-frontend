import { ItemFilterBar } from "@/Components/ItemFilterBar";
import {
  ItemFilterQuery,
  parseNumberUndefined,
  urlFirstString,
} from "@/helper";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Search() {
  const router = useRouter();

  const { q, pMin, pMax, pSort, hob, itemCat, inLev } = router.query;
  const pageTitle = `Search ${urlFirstString(q) ?? ""}`;
  const [qString, setQString] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [testChildUpdate, setTestChildUpdate] = useState("Blom");

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
          itemName: qString || "",
          pMin: pMinNumber,
          pMax: pMaxNumber,
          hob: urlFirstString(hob),
          itemCat: urlFirstString(itemCat),
          inLev: urlFirstString(inLev),
        });
        setIsLoading(false);
        setTestChildUpdate(JSON.stringify(itemQueried.items));
      }
    };

    if (router.isReady) {
      initialRenderResult();
    }
  }, [router.isReady, q, qString]);

  function UpdateDiChild(replace_in_parent: string) {
    console.log("trigered", "yeah");
    setTestChildUpdate(replace_in_parent);
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="m-0 flex h-screen flex-col lg:mx-auto lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          <div>QUERY: {q} DUAR QUERY</div>
          <ItemFilterBar
            page="search"
            searchQuery={qString}
            setQueryResult={UpdateDiChild}
          />
          {isLoading ? <>Loading Placeholder</> : <>{testChildUpdate}</>}
        </div>
      </main>
    </>
  );
}
