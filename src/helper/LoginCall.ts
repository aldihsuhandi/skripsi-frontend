import axios from "axios";

import { LoginRequest, LoginResult } from "@/types/User";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { toast } from "react-toastify";

export const LoginCall = async (formDataSubmitted: LoginRequest) => {
  try {
    const { data } = await axios.post<LoginResult>(
      "http://localhost:8080/user/login",
      formDataSubmitted,
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
    toast.error("Unable to Connect to database, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
