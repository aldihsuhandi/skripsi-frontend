import { ImageDownload, ProcessImgBE } from "@/helper";
import React, { ImgHTMLAttributes, useEffect, useState } from "react";

export interface ItemImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  imageId?: string;
  imageSrc?: string;
}

export const ItemImage = ({ imageId, imageSrc, ...props }: ItemImageProps) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  useEffect(() => {
    async function ProcessImage() {
      if (imageId) {
        const response = await ImageDownload({ imageId: imageId });
        if (response?.status === 200 && response.data.byteLength !== 0) {
          const imgUrl = await ProcessImgBE(response.data);

          setImage(imgUrl);
        } else {
          setImage(undefined);
        }
      }
    }
    ProcessImage();
  }, [imageId]);

  return (
    <img
      src={imageSrc ?? image}
      alt="item-image"
      className="object-scale-down"
      {...props}
    />
  );
};
