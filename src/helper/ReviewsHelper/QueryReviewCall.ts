import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";
import { QueryReviewRequest, QueryReviewResult } from "@/types/Reviews";

export const QueryReviewCall = async (
  type: string,
  needReview: boolean,
  pageNumber: number
) => {
  const sessionString = CheckExistSessionLocal();
  if (sessionString) {
    const headers = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      sessionId: sessionString,
      "Content-Type": "application/json",
      "Accept-Type": "application/json",
    };

    const config = {
      headers: headers,
    };

    const result = await PostCall<QueryReviewResult>({
      url: "http://localhost:8080/review/query",
      config: config,
      body: {
        type: type,
        needReview: needReview,
        numberOfItem: 10,
        pageNumber: pageNumber,
      },
    });

    if (result) {
      if (!result.resultContext.success) {
        toast.error(
          "There is an error while trying to query your reviews! Please try again later!",
          {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            theme: "colored",
          }
        );
      }
    }

    return result;
  } else {
    toast.error("You need to be logged in to query your reviews!", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
