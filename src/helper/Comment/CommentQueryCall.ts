import { CLIENT_ID, CLIENT_SECRET, Session_Local_Key } from "@/types";
import { CommentQueryRequest, CommentQueryResult } from "@/types/Comment";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";

export const CommentQuery = async ({
  replyTo,
  replyId,
  pageNumber,
  numberOfItem,
}: CommentQueryRequest) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const sessionString = localStorage.getItem(Session_Local_Key);
  if (sessionString) {
    Object.assign(headers, { sessionId: sessionString });
  }

  const config = {
    headers: headers,
  };

  const result = await PostCall<CommentQueryResult>({
    url: "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/comment/query",
    config: config,
    body: {
      replyTo: replyTo,
      replyId: replyId,
      pageNumber: pageNumber ? pageNumber : undefined,
      numberOfItem: numberOfItem ? numberOfItem : undefined,
    },
  });

  if (result?.resultContext.success) {
    return result;
  } else {
    toast.error(
      "An Error Occured when fetching comments data, please try again.",
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "colored",
      }
    );
  }
};
