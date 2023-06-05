import { APIResultTemplate } from "../ResultContext";

// REQUEST

/*
    Headers:
    - clientId
    - clientSecret
    - sessionId
*/

//Body (Request)
export interface CreateReviewRequest {
  reviewId: string;
  review: number;
  images?: FileList;
  description?: string;
  interestLevel: string;
}

// RESULT
export interface CreateReviewResult extends APIResultTemplate {}
