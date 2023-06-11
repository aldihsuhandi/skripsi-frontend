import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import {
  DecryptEmailRequestBody,
  DecryptEmailResult,
} from "@/types/EnDecryptEmail";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";

export const DecryptEmail = async (uuid: DecryptEmailRequestBody) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const config = {
    headers: headers,
  };

  const result = await PostCall<DecryptEmailResult>({
    url: "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/user/email/decrypt",
    config: config,
    body: uuid,
  });

  if (!result?.resultContext.success) {
    toast.error(
      "There seem to be a problem... please leave this page try again later!",
      {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: true,
        theme: "colored",
      }
    );
  }

  return result;
};
