import axios from "axios";

import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { OtpSendProps, OtpSendResult } from "@/types/Otp";
import { toast } from "react-toastify";

export const OtpSend = async ({ email, otpType }: OtpSendProps) => {
  try {
    const { data } = await axios.post<OtpSendResult>(
      "http://localhost:8080/otp/send",
      {
        email,
        otpType,
      },
      {
        headers: {
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          "Content-Type": "application/json",
          "Accept-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    toast.error("The System is busy, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
