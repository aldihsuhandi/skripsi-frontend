import axios from "axios";

import { UserQueryRequest, UserQueryResult } from "@/types/User";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { toast } from "react-toastify";

export const UserQuery = async (userEmail: UserQueryRequest) => {
  try {
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
  } catch (error) {
    toast.error("Unable to Connect to database, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
