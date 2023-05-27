import axios from "axios";
import { ResetPassQueryRequest, ResetPassQueryResult } from "@/types/User";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { toast } from "react-toastify";

export const ResetPassQuery = async ({ uuid }: ResetPassQueryRequest) => {
  try {
    const { data } = await axios.post<ResetPassQueryResult>(
      "http://localhost:8080/user/forgot_password/query",
      {
        uuid,
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
