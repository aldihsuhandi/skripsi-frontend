import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CommentEditRequest, CommentEditResult } from "@/types/Comment";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const CommentEdit = async ({
  commentId,
  content,
}: CommentEditRequest) => {
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

    const result = await PostCall<CommentEditResult>({
      url: "http://localhost:8080/comment/edit",
      config: config,
      body: {
        commentId: commentId,
        content: content,
      },
    });

    if (result?.resultContext.success) {
      return result;
    } else {
      toast.error(
        "An Error Occured when updating the comment, please try again.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          theme: "colored",
        }
      );
    }
  } else {
    toast.error("You are not even supposed to be able to trigger this...", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
