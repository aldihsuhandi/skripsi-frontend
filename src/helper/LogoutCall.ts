import axios from "axios";

import { LogoutRequest, LogoutResult } from "@/types/User";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";

export const LogoutCall = async (session: LogoutRequest) => {
  const { data } = await axios.post<LogoutResult>(
    "http://localhost:8080/session/logout",
    session,
    {
      headers: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        sessionId: session.sessionId,
        "Content-Type": "application/json",
        "Accept-Type": "application/json",
      },
    }
  );

  return data;
};
