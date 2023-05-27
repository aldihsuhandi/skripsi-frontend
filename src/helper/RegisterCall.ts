import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { RegisterRequest, RegisterResult } from "@/types/User";
import { PostCall } from "./PostCall";

export const RegisterPOST = async (formDataSubmitted: RegisterRequest) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "multipart/form-data",
    "Accept-Type": "application/json",
  };

  const config = {
    headers: headers,
  };

  const result = await PostCall<RegisterResult>({
    url: "http://localhost:8080/user/register",
    config: config,
    body: formDataSubmitted,
  });

  return result;
};
