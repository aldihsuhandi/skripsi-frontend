import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { ImageDownloadRequest } from "@/types/Image";
import axios from "axios";

export const ImageDownload = async (imageData: ImageDownloadRequest) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/image/download",
      imageData,
      {
        headers: {
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          "Accept-Type": "image/jpeg",
        },
        responseType: "arraybuffer",
      }
    );
    return response;
  } catch (error) {
    return null;
  }
};
