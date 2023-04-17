import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { ImageDownloadRequest, ImageDownloadResult } from "@/types/Image";
import axios from "axios";

export const ImageDownload = async (imageData: ImageDownloadRequest) => {
  const { data } = await axios.post<ImageDownloadResult>(
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

  return data;
};
