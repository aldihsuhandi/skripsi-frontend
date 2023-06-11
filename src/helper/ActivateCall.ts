import { BE_URL, CLIENT_ID, CLIENT_SECRET } from "@/types";
import { ActivateRequest, ActivateResult } from "@/types/User";
import { PostCall } from "./PostCall";

export const ActivateCall = async (data_Activate: ActivateRequest) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const config = {
    headers: headers,
  };

  const result = await PostCall<ActivateResult>({
    url: BE_URL + "/user/activate",
    config: config,
    body: data_Activate,
  });

  return result;
};
