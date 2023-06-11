import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { LoginRequest, LoginResult } from "@/types/User";
import { PostCall } from "./PostCall";

export const LoginCall = async (formDataSubmitted: LoginRequest) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const config = {
    headers: headers,
  };

  const result = await PostCall<LoginResult>({
    url: "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/user/login",
    config: config,
    body: formDataSubmitted,
  });

  return result;
};
