import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";
import { CreateReviewRequest, CreateReviewResult } from "@/types/Reviews";

export const CreateReviewCall = async (
  createReviewData: CreateReviewRequest
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

    // console.log(createReviewData);

    const config = {
      headers: headers,
    };

    const result = await PostCall<CreateReviewResult>({
      url: "http://localhost:8080/review/create",
      config: config,
      body: createReviewData,
    });

    if (result) {
      if (!result.resultContext.success) {
        toast.error(
          "There is an error while trying to create a review for your purchased! Please try again later!",
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
    toast.error("You need to be logged in to begin review your purchased!", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
