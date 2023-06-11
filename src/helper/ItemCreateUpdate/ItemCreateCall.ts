import {
  CLIENT_ID,
  CLIENT_SECRET,
  ItemCreateRequest,
  ItemCreateResult,
} from "@/types";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const ItemCreate = async ({
  itemName,
  itemPrice,
  itemDescription,
  itemQuantity,
  categoryName,
  hobbyName,
  merchantInterestLevel,
  itemImages,
}: ItemCreateRequest) => {
  const sessionString = CheckExistSessionLocal();
  if (sessionString) {
    const headers = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      "Content-Type": "application/json",
      "Accept-Type": "application/json",
      sessionId: sessionString,
    };

    const config = {
      headers: headers,
    };

    const result = await PostCall<ItemCreateResult>({
      url: "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/item/create",
      config: config,
      body: {
        itemName: itemName,
        itemPrice: itemPrice,
        itemDescription: itemDescription,
        itemQuantity: itemQuantity,
        categoryName: categoryName,
        hobbyName: hobbyName,
        merchantInterestLevel: merchantInterestLevel,
        itemImages: itemImages,
      },
    });
    console.log(result);
    if (result?.resultContext.success) {
      return result;
    } else {
      toast.error(
        "An Error Occured when creating the item, please try again.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          theme: "colored",
        }
      );
    }
  } else {
    toast.error("You need to be logged in to create items!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
