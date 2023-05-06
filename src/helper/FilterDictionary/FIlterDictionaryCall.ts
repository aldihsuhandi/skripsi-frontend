import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import {
  FilterDictionaryRequestBody,
  FilterDictionaryResult,
} from "@/types/FIlterDictionary";

import axios from "axios";

export const FilterDictionary = async (
  dictionaryKey: FilterDictionaryRequestBody
) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const { data } = await axios.post<FilterDictionaryResult>(
    "http://localhost:8080/dictionary/query",
    dictionaryKey,
    {
      headers,
    }
  );

  return data;
};
