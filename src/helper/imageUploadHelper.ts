import { ImageUpload } from "./ImageUploadCall";

export const ReturnArrayImageIdFromArrayFile = async (fileArray: File[]) => {
  let array_image_ids: string[] = [];

  for (let i = 0; i < fileArray.length; i++) {
    const imageIdResult = await ImageUpload({ image: fileArray[i] });
    if (imageIdResult && imageIdResult.data.imageId) {
      array_image_ids = array_image_ids.concat(imageIdResult.data.imageId);
    }
  }

  return array_image_ids;
};
