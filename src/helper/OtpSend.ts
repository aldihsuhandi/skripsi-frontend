import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { OtpSendProps, OtpSendResult } from "@/types/Otp";
import { toast } from "react-toastify";
import { PostCall } from "./PostCall";

export const OtpSend = async ({ email, otpType }: OtpSendProps) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const config = {
    headers: headers,
  };

  const result = await PostCall<OtpSendResult>({
    url: "http://localhost:8080/otp/send",
    config: config,
    body: {
      email,
      otpType,
    },
  });

  if (result) {
    if (result.resultContext.success) {
      return result;
    } else if (
      !result?.resultContext.success &&
      result?.resultContext.resultCode === "USER_NOT_FOUND"
    ) {
      toast.error("No user found with that specific email", {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        theme: "colored",
      });
    }
  }
};
