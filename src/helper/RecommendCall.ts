import {
    CLIENT_ID,
    CLIENT_SECRET
} from "@/types";
import { ItemRecommendationResult } from "@/types/Item/ItemRecommendation";
import { PostCall } from "./PostCall";
import { CheckExistSessionLocal, CheckSessionValid } from "./SessionHelper";

export const RecommendCall = async () => {
    const headers = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      "Content-Type": "application/json",
      "Accept-Type": "application/json",
    };

    const session = CheckExistSessionLocal();
    if (session && (await CheckSessionValid(session))) {
      Object.assign(headers, { sesisonId: session });
    }
    const config = {
      headers: headers,
    };

    const result = await PostCall<ItemRecommendationResult>({
      url: "http://localhost:8080/item/recommend",
      config: config,
      body: {},
    });

    return result;
}