export const ProcessImgBE = async (imageByte: ArrayBufferLike) => {
  const byteArray = new Uint8Array(imageByte);
  const blobs = new Blob([byteArray], { type: "image/jpeg" });
  const imgUrl = URL.createObjectURL(blobs);

  return imgUrl;
};
