import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CommentDeleteRequest, CommentDeleteResult } from "@/types/Comment";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const CommentDelete = async ({ commentId }: CommentDeleteRequest) => {
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

    const result = await PostCall<CommentDeleteResult>({
      url: "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/comment/delete",
      config: config,
      body: {
        commentId: commentId,
      },
    });

    if (result?.resultContext.success) {
      return result;
    } else {
      toast.error(
        "An Error Occured when deleting the comment, please try again.",
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
