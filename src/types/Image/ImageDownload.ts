// Request

/**
 * Di headers:
 *  clientId
 *  clientSecret
 */

export interface ImageDownloadRequest {
  imageId: string;
}

// Result / Response

export type ImageDownloadResult = ArrayBufferLike;
