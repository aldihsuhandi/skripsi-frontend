import { APIResultTemplate } from "../ResultContext";

//Form Values
export interface CreateReviewFormValues {
  review: number;
  images?: File[];
  description?: string;
  interestLevel: string;
}

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
  images?: string[];
  description?: string;
  interestLevel: string;
}

// RESULT
export interface CreateReviewResult extends APIResultTemplate {}
