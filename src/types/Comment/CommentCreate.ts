import { APIResultTemplate } from "../ResultContext";

export interface CommentCreateRequest {
  content: string;
  /**
   * POST | COMMENT
   */
  replyTo: string;
  replyId: string;
}

export interface CommentCreateResult extends APIResultTemplate {
  commentId: string;
}
