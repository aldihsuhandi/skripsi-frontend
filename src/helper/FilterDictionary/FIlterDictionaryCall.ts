import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import {
  FilterDictionaryRequestBody,
  FilterDictionaryResult,
} from "@/types/FIlterDictionary";

import axios from "axios";
import { toast } from "react-toastify";

export const FilterDictionary = async (
  dictionaryKey: FilterDictionaryRequestBody
) => {
  try {
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
  } catch (e) {
    toast.error("The System is busy, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
