import axios from "axios";

import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { OtpSendProps, OtpSendResult } from "@/types/Otp";

export const OtpSend = async ({ email, otpType }: OtpSendProps) => {
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
};
