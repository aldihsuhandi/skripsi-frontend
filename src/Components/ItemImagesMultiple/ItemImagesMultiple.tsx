import React, { useEffect, useState } from "react";
import { ItemImage } from "../ItemImage/ItemImage";
import { ImageDownload, ProcessImgBE } from "@/helper";

export interface ItemImagesMultipleProps {
  imageIds: string[];
}

export const ItemImagesMultiple = ({ imageIds }: ItemImagesMultipleProps) => {
  const [imageStringReady, setImageStringReady] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    Promise.all(imageIds.map((ids) => processForImageArray(ids))).then(
      (results) => setImageStringReady(results)
    );
  }, []);

  return (
    <>
      {/* The BEEG Image */}
      <div className="relative h-80 w-80 self-center rounded border border-gray-500">
        <ItemImage
          imageSrc={imageStringReady[imageIndex]}
          alt={`item-image-${imageIndex}`}
          height="100%"
          width="100%"
          className="h-full w-full self-center rounded"
        />
      </div>

      {/* The Preview/smol Image */}
      <div className="grid grid-cols-5 gap-2 pt-4">
        {imageStringReady.map((ids, index) => {
          return (
            <div
              key={index}
              className="flex h-16 w-16 cursor-pointer self-center rounded border border-gray-600"
              onClick={() => {
                console.log(ids, "id clicked");
                setImageIndex(index);
              }}
            >
              <ItemImage
                imageSrc={ids}
                alt={`item-image-${index}`}
                height="100%"
                width="100%"
                className="h-full w-full self-center rounded"
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

const processForImageArray = async (imageId: string) => {
  const response = await ImageDownload({ imageId: imageId });
  if (response?.status === 200 && response.data.byteLength !== 0) {
    const imgUrl = await ProcessImgBE(response.data);

    return imgUrl;
  } else {
    return "https://rimatour.com/wp-content/uploads/2017/09/No-image-found.jpg";
  }
};
