import axios from "axios";
import { ResetPassSendRequest, ResetPassSendResult } from "@/types/User";
import { BE_URL, CLIENT_ID, CLIENT_SECRET } from "@/types";
import { toast } from "react-toastify";

export const ResetPassSend = async ({ email }: ResetPassSendRequest) => {
  try {
    const { data } = await axios.post<ResetPassSendResult>(
      BE_URL + "/user/forgot_password/send",
      {
        email,
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
