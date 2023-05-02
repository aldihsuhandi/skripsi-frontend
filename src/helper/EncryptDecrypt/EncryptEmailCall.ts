import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import {
  EncryptEmailRequestBody,
  EncryptEmailResult,
} from "@/types/EnDecryptEmail";
import axios from "axios";

export const EncryptEmail = async (email: EncryptEmailRequestBody) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const { data } = await axios.post<EncryptEmailResult>(
    "http://localhost:8080/user/email/encrypt",
    email,
    {
      headers,
    }
  );

  return data;
};
