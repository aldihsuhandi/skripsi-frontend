import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import {
  DecryptEmailRequestBody,
  DecryptEmailResult,
} from "@/types/EnDecryptEmail";
import axios from "axios";
import { toast } from "react-toastify";

export const DecryptEmail = async (uuid: DecryptEmailRequestBody) => {
  try {
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
  } catch (e) {
    toast.error("Unable to Connect to database, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
