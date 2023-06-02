import { APIResultTemplate } from "../ResultContext";
import { UserSummary } from "../User";

export interface CommentQueryRequest {
  /**
   * POST | COMMENT
   */
  replyTo: string;
  replyId: string;
  pageNumber: number;
  numberOfItem: number;
}

export interface CommentSummary {
  commentId: string;
  content: string;
  commenter: UserSummary;
  upvote: number;
  downvote: number;
  currentUserVote: number;
  gmtCreate: Date;
  gmtModified: Date;
}

export interface CommentPagingContext {
  pageNumber: number;
  numberOfItem: number;
  hasNext: boolean;
  /**
   * Kalo gk muat number, bigint
   */
  totalItem: number;
  totalPage: number;
}

export interface CommentQueryResult extends APIResultTemplate {
  comments: CommentSummary[];
  pagingContext: CommentPagingContext;
}
