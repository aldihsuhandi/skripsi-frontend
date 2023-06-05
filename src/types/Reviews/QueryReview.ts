import { APIResultTemplate } from "../ResultContext";

// REQUEST

/*
    Headers: 
     - clientId
     - clientSecret
     - sessionId
*/

//Body
export interface QueryReviewRequest {
  type: string;
  needReview: boolean;
  numberOfItem: number;
  pageNumber: number;
}

// RESULT

//Review Paging Context
export interface ReviewPagingContext {
  pageNumber: number;
  numberOfItem: number;
  hasNext: boolean;
  totalItem: number;
  totalPage: number;
}

// Review Summary
export interface ReviewSummary {
  reviewId: string;
  itemId: string;
  review: number;
  images?: FileList;
  interestLevel: string;
  description: string;
  needReview: boolean;
}

export interface QueryReviewResult extends APIResultTemplate {
  reviews: ReviewSummary[];
  pagingContext: ReviewPagingContext;
}
