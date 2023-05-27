import { CLIENT_ID, CLIENT_SECRET, Session_Local_Key } from "@/types";
import { LogoutRequest, LogoutResult } from "@/types/User";
import { PostCall } from "./PostCall";

export const LogoutCall = async (session: LogoutRequest) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    sessionId: session.sessionId,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const config = {
    headers: headers,
  };

  const result = await PostCall<LogoutResult>({
    url: "http://localhost:8080/session/logout",
    config: config,
    body: session,
  });

  if (result && result.resultContext.success) {
    localStorage.removeItem(Session_Local_Key);
  }

  return result;
};
