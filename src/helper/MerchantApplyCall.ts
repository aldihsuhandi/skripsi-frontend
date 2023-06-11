import { BE_URL, CLIENT_ID, CLIENT_SECRET } from "@/types";
import { MerchantApplyResult } from "@/types/User";
import { toast } from "react-toastify";
import { PostCall } from "./PostCall";
import { CheckExistSessionLocal } from "./SessionHelper";

export const MerchantApplyCall = async () => {
  const sessionString = CheckExistSessionLocal();
  if (sessionString) {
    const headers = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      "Content-Type": "application/json",
      "Accept-Type": "application/json",
      sessionId: sessionString,
    };

    const config = {
      headers: headers,
    };

    const result = await PostCall<MerchantApplyResult>({
      url: BE_URL + "/user/merchant/apply",
      config: config,
      body: {},
    });
    if (result?.resultContext.success) {
      return result;
    } else {
      toast.error(
        // "An Error Occured when applying to merchant, please try again.\n" +
        result?.resultContext.resultMsg ??
          "Something went wrong when applying to merchant",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          theme: "colored",
        }
      );
    }
    return result;
  } else {
    toast.error("You need to be logged in to apply!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
