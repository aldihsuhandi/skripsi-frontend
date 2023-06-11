import axios from "axios";
import { ForgotPassRequest, ForgotPassResult } from "@/types/User";
import { BE_URL, CLIENT_ID, CLIENT_SECRET } from "@/types";
import { toast } from "react-toastify";

export const ForgotPassCall = async (formDataForgotPass: ForgotPassRequest) => {
  try {
    const { data } = await axios.post<ForgotPassResult>(
      BE_URL + "/user/reset_password",
      formDataForgotPass,
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
