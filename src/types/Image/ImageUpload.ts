/**
 * Di headers:
 *  clientId
 *  clientSecret
 *  sessionId
 */

export interface ImageUploadRequest {
  image: File; //Blob
}

export interface ImageUploadResult {
  resultContext: string;
  imageId: string;
}
