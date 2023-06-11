import { BE_URL, CLIENT_ID, CLIENT_SECRET, Session_Local_Key } from "@/types";
import { SessionInfoRequest, SessionInfoResult } from "@/types/User";
import { PostCall } from "./PostCall";

export const SessionInfoCall = async (sessionIdData: SessionInfoRequest) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    sessionId: sessionIdData.sessionId,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const config = {
    headers: headers,
  };

  const result = await PostCall<SessionInfoResult>({
    url: BE_URL + "/session/info",
    config: config,
    body: sessionIdData,
  });

  if (
    !result?.resultContext.success &&
    result?.resultContext.resultCode === "SESSION_EXPIRED"
  ) {
    localStorage.removeItem(Session_Local_Key);
  }

  return result;
};
