import { ImageUpload } from "./ImageUploadCall";

/**
 * string[] kalau jalan lancar, kalau ada error return undefined
 * @param fileArray
 * @returns string[] or undefined
 */
export const ReturnArrayImageIdFromArrayFile = async (fileArray: File[]) => {
  let array_image_ids: string[] = [];

  for (let i = 0; i < fileArray.length; i++) {
    const imageIdResult = await ImageUpload({ image: fileArray[i] });
    if (
      imageIdResult &&
      imageIdResult.data.imageId &&
      imageIdResult.data.resultContext.success
    ) {
      array_image_ids = array_image_ids.concat(imageIdResult.data.imageId);
    } else if (!imageIdResult?.data.resultContext.success) {
      return undefined;
    }
  }

  return array_image_ids;
};
