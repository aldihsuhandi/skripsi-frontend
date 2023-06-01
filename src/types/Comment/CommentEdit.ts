import { APIResultTemplate } from "../ResultContext";

export interface CommentEditRequest {
  commentId: string;
  content: string;
}

export interface CommentEditResult extends APIResultTemplate {}
