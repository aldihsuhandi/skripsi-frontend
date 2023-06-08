import { PagingContext } from "../Item";
import { APIResultTemplate } from "../ResultContext";
// import { UserRole } from "../User";

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

// Review Summary
export interface ReviewSummary {
  reviewId: string;
  itemId: string;
  review: number;
  images?: string[];
  interestLevel: string;
  description: string;
  needReview: boolean;
}

export interface QueryReviewResult extends APIResultTemplate {
  reviews: ReviewSummary[];
  pagingContext: PagingContext;
}
