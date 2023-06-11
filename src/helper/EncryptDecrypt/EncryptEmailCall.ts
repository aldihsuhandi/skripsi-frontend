import { CLIENT_ID, CLIENT_SECRET, Session_Local_Key } from "@/types";
import {
  EncryptEmailRequestBody,
  EncryptEmailResult,
} from "@/types/EnDecryptEmail";
import { PostCall } from "../PostCall";
import { toast } from "react-toastify";

export const EncryptEmail = async (email: EncryptEmailRequestBody) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const config = {
    headers: headers,
  };

  const result = await PostCall<EncryptEmailResult>({
    url: "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/user/email/encrypt",
    config: config,
    body: email,
  });

  if (!result?.resultContext.success) {
    toast.error(
      "We were unable to process activating your account, please try again later!",
      {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        theme: "colored",
      }
    );
  }

  return result;
};
