import { APIResultTemplate, Session_Local_Key } from "@/types";
import axios, { AxiosRequestConfig } from "axios";
import Router from "next/router";
import { toast } from "react-toastify";

export const PostCall = async <T extends APIResultTemplate>({
  url,
  config,
  body,
}: {
  url: string;
  config: AxiosRequestConfig;
  body?: any;
}) => {
  try {
    const response = await axios.post<T>(url, body, config);

    // if (data.resultContext.success) {
    //   return data;
    // }

    // if(data.resultContext.resultCode ===)
    switch (response.data.resultContext.resultCode) {
      case "SYSTEM_ERROR":
      case "PARAM_ILLEGAL":
        toast.error("We Encountered a problem...", {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          theme: "colored",
        });
        return undefined;

      case "SESSION_EXPIRED":
        toast.error("Your Session is expired", {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          theme: "colored",
        });
        localStorage.removeItem(Session_Local_Key);
        Router.reload();
        return undefined;
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a non-2xx status code
      toast.error("We encountered a problem with the server", {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        theme: "colored",
      });
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("The System is busy or is offline, please try again later", {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        theme: "colored",
      });
    } else {
      // Something else happened in making the request
      toast.error("The System is busy, please try again later", {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        theme: "colored",
      });
    }
  }
};
