import axios from "axios";

import { RegisterResult, RegisterRequest } from "@/types/User";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";

export const RegisterPOST = async (formDataSubmitted: RegisterRequest) => {
  const { data } = await axios.post<RegisterResult>(
    "http://localhost:8080/user/register",
    formDataSubmitted,
    {
      headers: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        "Content-Type": "multipart/form-data",
        "Accept-Type": "application/json",
      },
    }
  );

  return data;
};
