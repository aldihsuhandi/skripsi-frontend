import { RecommendCall } from "@/helper/RecommendCall";
import { CheckExistSessionLocal } from "@/helper/SessionHelper";
import { ItemSummary } from "@/types";
import { useEffect, useState } from "react";
import { COLOR_HEX_STRING, Color } from "../Color";
import { TrendingIcon } from "../Icons";
import { ProductCard } from "../ProductCard";

export const Recommend = () => {
  const [recommend, setRecommend] = useState<ItemSummary[]>([]);
  const [session, setSession] = useState<String>();

  const recommendationCall = async () => {
    const result = await RecommendCall();
    if (result && result.resultContext.success) {
      setRecommend(result.items);
    }
  };

  useEffect(() => {
    const sessionId = CheckExistSessionLocal();
    if (sessionId) {
      setSession(sessionId);
    }
    recommendationCall();
  }, []);

  if (session) {
    return (
      <div className="m-0 pb-4 lg:mx-auto lg:flex  lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex flex-col px-2 pt-3">
          <p className="flex flex-row text-sm font-bold lg:text-lg">
            <TrendingIcon
              htmlColor={COLOR_HEX_STRING[Color.BrightYellow]}
              classNameIcon="h-7 w-7"
            />
            &ensp;Base on your activites
          </p>
          <div className="grid grid-cols-2 gap-4 py-2 px-2 lg:grid-cols-5 lg:py-4">
            {recommend.map((data) => (
              <ProductCard itemData={data} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};
