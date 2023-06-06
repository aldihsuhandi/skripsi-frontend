/**
 * Di headers:
 *  clientId
 *  clientSecret
 *  sessionId
 */

import { ResultContext } from "../ResultContext";

export interface ImageUploadRequest {
  image: File; //Blob
}

export interface ImageUploadResult {
  resultContext: ResultContext;
  imageId: string;
}
