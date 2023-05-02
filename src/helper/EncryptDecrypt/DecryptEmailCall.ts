import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import {
  DecryptEmailRequestBody,
  DecryptEmailResult,
} from "@/types/EnDecryptEmail";
import axios from "axios";

export const DecryptEmail = async (uuid: DecryptEmailRequestBody) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const { data } = await axios.post<DecryptEmailResult>(
    "http://localhost:8080/user/email/decrypt",
    uuid,
    {
      headers,
    }
  );

  return data;
};
