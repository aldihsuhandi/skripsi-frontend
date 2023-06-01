import { APIResultTemplate } from "../ResultContext";

export interface CommentDeleteRequest {
  commentId: string;
}

export interface CommentDeleteResult extends APIResultTemplate {}
