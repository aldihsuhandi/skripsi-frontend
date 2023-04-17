import axios from "axios";

import { UserQueryRequest, UserQueryResult } from "@/types/User";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";

export const UserQuery = async (userEmail: UserQueryRequest) => {
  const { data } = await axios.post<UserQueryResult>(
    "http://localhost:8080/user/info",
    userEmail,
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
