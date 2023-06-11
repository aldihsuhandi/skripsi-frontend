import { BE_URL, CLIENT_ID, CLIENT_SECRET } from "@/types";
import { ImageUploadRequest, ImageUploadResult } from "@/types/Image";
import axios from "axios";
import { toast } from "react-toastify";

export const ImageUpload = async (image: ImageUploadRequest) => {
  try {
    const response = await axios.post<ImageUploadResult>(
      BE_URL + "/image/upload",
      image,
      {
        headers: {
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          "Content-Type": "multipart/form-data",
          "Accept-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error.response.status === 500) {
      toast.error("The Server encountered an unexpected condition", {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        theme: "colored",
      });
    } else {
      toast.error("The System is busy, please try again later", {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        theme: "colored",
      });
    }
  }
};
