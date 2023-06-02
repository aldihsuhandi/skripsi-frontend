import { CLIENT_ID, CLIENT_SECRET, Session_Local_Key } from "@/types";
import { CommentCreateRequest, CommentCreateResult } from "@/types/Comment";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const CommentCreate = async ({
  content,
  replyTo,
  replyId,
}: CommentCreateRequest) => {
  const sessionString = CheckExistSessionLocal();
  if (sessionString) {
    const headers = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      "Content-Type": "application/json",
      "Accept-Type": "application/json",
      sessionId: sessionString,
    };

    const config = {
      headers: headers,
    };

    const result = await PostCall<CommentCreateResult>({
      url: "http://localhost:8080/comment/create",
      config: config,
      body: {
        content: content,
        replyTo: replyTo,
        replyId: replyId,
      },
    });
    console.log(result);
    if (result?.resultContext.success) {
      return result;
    } else {
      toast.error(
        "An Error Occured when creating the comment, please try again.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          theme: "colored",
        }
      );
    }
  } else {
    toast.error("You need to be logged in to comment!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
