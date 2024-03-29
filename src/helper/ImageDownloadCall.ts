import { BE_URL, CLIENT_ID, CLIENT_SECRET } from "@/types";
import { ImageDownloadRequest } from "@/types/Image";
import axios from "axios";
import { toast } from "react-toastify";

export const ImageDownload = async (imageData: ImageDownloadRequest) => {
  try {
    const response = await axios.post(BE_URL + "/image/download", imageData, {
      headers: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        "Accept-Type": "image/jpeg",
      },
      responseType: "arraybuffer",
    });
    return response;
  } catch (error) {
    toast.error("The System is busy, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
