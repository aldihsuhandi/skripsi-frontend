import { BE_URL, CLIENT_ID, CLIENT_SECRET, Session_Local_Key } from "@/types";
import { CheckExistSessionLocal } from "./SessionHelper";
import { UpdateProfileRequest, UpdateProfileResult } from "@/types/User";
import { toast } from "react-toastify";
import { PostCall } from "./PostCall";

export const UpdateProfileCall = async (
  formDataUpdate: UpdateProfileRequest
) => {
  const sessionString = CheckExistSessionLocal();
  if (sessionString) {
    const headers = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      sessionId: sessionString,
      "Content-Type": "multipart/form-data",
      "Accept-Type": "application/json",
    };

    const config = {
      headers: headers,
    };

    const result = await PostCall<UpdateProfileResult>({
      url: BE_URL + "/user/update",
      config: config,
      body: formDataUpdate,
    });

    if (result) {
      if (!result.resultContext.success) {
        toast.error(
          "There is an error while trying to update your account info, please try again later!",
          {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            theme: "colored",
          }
        );
      }
    }

    return result;
  } else {
    toast.error("You need to be logged in to edit your profile", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
