import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { UserQueryRequest, UserQueryResult } from "@/types/User";
import { toast } from "react-toastify";
import { PostCall } from "./PostCall";

export const UserQuery = async (userEmail: UserQueryRequest) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const config = {
    headers: headers,
  };

  const result = await PostCall<UserQueryResult>({
    url: "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/user/info",
    config: config,
    body: userEmail,
  });

  if (result) {
    if (!result.resultContext.success) {
      toast.error(
        "There is an error getting your account info, please try again later!",
        {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          theme: "colored",
        }
      );
    }
  }

  return result;
};
