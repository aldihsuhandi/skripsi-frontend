import {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  useEffect,
  useState,
} from "react";

export interface ImagePreviewProps
  //   extends Omit<HTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  //   extends HTMLAttributes<HTMLImageElement> {
  extends Omit<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    "src" | "alt"
  > {
  previewFile: File;
  altMessage: string;
}

export const ImagePreview = ({
  previewFile,
  altMessage,
  ...props
}: ImagePreviewProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  useEffect(() => {
    const picString = URL.createObjectURL(previewFile);
    setImageSrc(picString);

    return () => {
      URL.revokeObjectURL(picString);
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [previewFile]);

  return <img src={imageSrc} alt={altMessage} {...props} />;
};
