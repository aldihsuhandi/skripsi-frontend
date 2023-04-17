import axios from "axios";

import { SessionInfoRequest, SessionInfoResult } from "@/types/User";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";

export const SessionInfoCall = async (sessionIdData: SessionInfoRequest) => {
  const { data } = await axios.post<SessionInfoResult>(
    "http://localhost:8080/session/info",
    sessionIdData,
    {
      headers: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        sessionId: sessionIdData.sessionId,
        "Content-Type": "application/json",
        "Accept-Type": "application/json",
      },
    }
  );

  return data;
};
