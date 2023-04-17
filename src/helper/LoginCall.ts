import axios from "axios";

import { LoginRequest, LoginResult } from "@/types/User";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";

export const LoginCall = async (formDataSubmitted: LoginRequest) => {
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
};
