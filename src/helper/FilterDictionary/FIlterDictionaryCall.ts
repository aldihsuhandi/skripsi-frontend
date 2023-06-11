import { BE_URL, CLIENT_ID, CLIENT_SECRET, Session_Local_Key } from "@/types";
import {
  FilterDictionaryRequestBody,
  FilterDictionaryResult,
} from "@/types/FIlterDictionary";

import { PostCall } from "../PostCall";

export const FilterDictionary = async (
  dictionaryKey: FilterDictionaryRequestBody
) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const config = {
    headers: headers,
  };

  const result = await PostCall<FilterDictionaryResult>({
    url: BE_URL + "/dictionary/query",
    config: config,
    body: dictionaryKey,
  });

  return result;
};
