import { ImagePreview } from "@/Components/ImagePreview";
import { ReturnArrayImageIdFromArrayFile, urlFirstString } from "@/helper";
import { FilterDictionary } from "@/helper/FilterDictionary/FIlterDictionaryCall";
import { FormatCurrencyIdr } from "@/helper/GeneralHelper/CurrencyHelper";
import { CreateReviewCall, DetailReviewCall } from "@/helper/ReviewsHelper";
import { CLIENT_ID, CLIENT_SECRET, ItemSummary } from "@/types";
import { CreateReviewFormValues } from "@/types/Reviews";
import axios from "axios";
import { Field, FieldArray, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { HiFolderAdd } from "react-icons/hi";
import {
  HiArrowLeftOnRectangle,
  HiBuildingStorefront,
  HiUserGroup,
  HiXCircle,
} from "react-icons/hi2";
import { toast } from "react-toastify";
import * as Yup from "yup";
import styles from "../../../styles/Form.module.css";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const initialValues: CreateReviewFormValues = {
  review: 1,
  interestLevel: "",
  description: "",
  images: [],
};

const CreateReviewSchema = Yup.object().shape({
  review: Yup.number()
    .required("Please Give it a Rating between 1 to 5")
    .min(1, "Minimum Rating That You Can Give is One!")
    .max(5, "Maximum Rating That You Can Give is Five!"),

  interestLevel: Yup.string().required("Interest Level is Required!"),

  description: Yup.string().notRequired(),

  images: Yup.mixed<File[]>()
    .notRequired()
    .test("fileSize", "One of the file exceeds the 2MB limit", (value) => {
      if (value && value?.length > 0) {
        for (let i = 0; i < value.length; i++) {
          if (value[i].size > 5242880) {
            return false;
          }
        }
      }
      return true;
    })
    .test(
      "fileType",
      "One of the file has unsupported file format",
      (value) => {
        if (value && value.length > 0) {
          for (let i = 0; i < value.length; i++) {
            if (
              value[i].type != "image/png" &&
              value[i].type != "image/jpg" &&
              value[i].type != "image/jpeg"
            ) {
              return false;
            }
          }
        }
        return true;
      }
    )
    .test("arrayLength", "Maximum is 10 images!", (value) => {
      if (value && value.length < 10) {
        return true;
      } else {
        return false;
      }
    }),
});

export default function CreateReview() {
  const router = useRouter();
  const { reviewId } = router.query;
  const [currentRevId, setCurrentRevId] = useState<string>("");
  const imgRef = useRef<HTMLInputElement>(null);
  const [item, setItem] = useState<ItemSummary>();
  const [itemImg, setItemImg] = useState<string>();
  const [interestLvl, setInterestLvl] = useState<string[]>([]);

  useEffect(() => {
    const tempRevId = urlFirstString(reviewId);
    if (tempRevId && !currentRevId) {
      setCurrentRevId(tempRevId);
    }

    async function downloadImage() {
      if (!item) {
        return;
      }
      console.log("download image: ");
      const images = item.itemImages;
      const response = await ProcessImage({
        imageIdCom: images[0],
      });

      if (response?.status === 200 && response.data.byteLength !== 0) {
        const byteArray = new Uint8Array(response.data);
        const blobs = new Blob([byteArray], { type: "image/jpeg" });
        const imgUrl = URL.createObjectURL(blobs);

        setItemImg(imgUrl);
      } else {
        setItemImg(undefined);
      }
    }

    async function getDictionaries() {
      const inList = await FilterDictionary({
        dictionaryKey: "INTEREST_LEVEL",
      });

      inList?.resultContext.success
        ? setInterestLvl(inList.dictionaries)
        : setInterestLvl([
            "There was an error fetching this data, try refreshing or try again later.",
          ]);
    }

    const itemQuery = async () => {
      if (currentRevId && !item) {
        const result = await DetailReviewCall(currentRevId);
        if (result && result.resultContext.success) {
          setItem(result.item);
        } else if (result) {
          let msg = "The System is busy, please try again later";
          if (result.resultContext.resultCode === "USER_INVALID") {
            msg = "You don't have permission to view this!";
          }
          toast.warning(msg, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };
    itemQuery();
    getDictionaries();
    if (item) {
      downloadImage();
    }
  }, [router.isReady, currentRevId, item]);

  const ItemReviewWidget = () => {
    if (!item) {
      return <></>;
    }
    return (
      <a
        target="_blank"
        href={`/merchant/${encodeURIComponent(
          item.merchantInfo.username
        )}/item/${item.itemId}`}
        className="flex h-auto w-full flex-row justify-center p-4"
      >
        <img
          className="h-28 w-28 rounded border-2 border-solid p-3"
          src={
            itemImg ??
            "https://i1.sndcdn.com/artworks-dCikqEVyCfTCgdq0-0hSQRQ-t500x500.jpg"
          }
          alt=""
        />
        <div className="flex h-full w-full flex-col items-start justify-start p-3">
          <div className="font-semibold">{item.itemName}</div>
          <div className="text-sm">{FormatCurrencyIdr(item.itemPrice)}</div>

          <div>
            <p className="flex font-sans text-sm lg:text-base">
              <HiBuildingStorefront
                style={{
                  height: "1.5em",
                  width: "1.5em",
                  color: "#581C87",
                  paddingRight: "2px",
                }}
              />
              {item.merchantLevel}
            </p>
            <p className="flex font-sans text-sm lg:text-base">
              <HiUserGroup
                style={{
                  height: "1.5em",
                  width: "1.5em",
                  color: "#581C87",
                  paddingRight: "2px",
                }}
              />
              {item.userLevel == "" ? "No Review" : item.userLevel}
            </p>
          </div>
        </div>
      </a>
    );
  };

  return (
    <>
      <Head>
        <title>Create Your Review</title>{" "}
        {/* --> [Improvement]Nanti ganti jadi: "Review: Nama Item nya"*/}
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mx-auto p-4">
          <div className="mx-auto flex min-h-fit min-w-fit max-w-4xl flex-col rounded-lg bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
            <div className="sticky top-0 flex h-[41.6px] w-full flex-col items-center rounded-t-lg border-b-2 border-b-normal-blue shadow-md">
              <h1 className="pt-2">CREATE YOUR REVIEW FOR THIS PRODUCT</h1>
            </div>
            <div className="flex p-2">
              <a
                className="rounded-md border-normal-blue bg-normal-blue p-2 hover:border-bright-blue hover:bg-bright-blue"
                href="/review"
              >
                <span className="flex flex-row items-center">
                  <HiArrowLeftOnRectangle size={20} className="fill-white" />
                  <p className="pl-1 text-white">Go Back</p>
                </span>
              </a>
            </div>
            <div className="m-2 rounded-md border shadow-md">
              {ItemReviewWidget()}
            </div>
            <div className="px-2 pb-2 pt-3">
              <h1>Your Review</h1>
              <div className="flex h-full flex-col pt-2">
                <Formik
                  initialValues={initialValues}
                  validationSchema={CreateReviewSchema}
                  onSubmit={async (values) => {
                    //upload images
                    let imageIds: string[] = [];
                    if (values.images) {
                      const result = await ReturnArrayImageIdFromArrayFile(
                        values.images
                      );
                      if (result) {
                        imageIds = result;
                      }
                      const resultFromCreate = await CreateReviewCall({
                        reviewId: currentRevId,
                        review: values.review,
                        interestLevel: values.interestLevel,
                        description: values.description,
                        images: imageIds,
                      });
                      if (
                        resultFromCreate &&
                        resultFromCreate.resultContext.success
                      ) {
                        router.push({
                          pathname: `/review`,
                        });
                      }
                    }
                  }}
                >
                  {({ setFieldValue, values }) => (
                    <Form>
                      <FieldArray name="images">
                        {({ remove }) => {
                          return (
                            <div className="flex flex-row flex-wrap">
                              {[...values.images].map((file, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="cursor relative m-2 h-[80px] w-[80px]"
                                  >
                                    <ImagePreview
                                      previewFile={file}
                                      altMessage={`${file.name} - ${index}`}
                                      width={80}
                                      height={80}
                                      className="h-full w-full object-scale-down"
                                    />
                                    <div
                                      className={styles.overlay}
                                      onClick={() => {
                                        remove(index);
                                      }}
                                    >
                                      <HiXCircle size={30} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }}
                      </FieldArray>

                      <div
                        className="flex cursor-pointer flex-row pb-2"
                        onClick={() => {
                          if (imgRef.current) {
                            imgRef.current.click();
                          }
                        }}
                      >
                        <HiFolderAdd size={25} /> Add Images
                        <Field
                          innerRef={imgRef}
                          type="file"
                          name="images"
                          hidden
                          multiple
                          value={undefined}
                          accept="image/png, image/jpg, image/jpeg"
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            if (values.images.length < 3) {
                              const currentImg = event.target.files;
                              const beforeImg = values.images;
                              if (currentImg) {
                                const imgsArray = beforeImg.concat(
                                  Array.from(currentImg)
                                );
                                setFieldValue("images", imgsArray);
                              }
                            } else {
                              toast.warning("The maximum is 3 images", {
                                position: "top-center",
                                autoClose: 3000,
                                hideProgressBar: false,
                                theme: "colored",
                              });
                            }
                          }}
                        />
                      </div>

                      <label
                        htmlFor="review"
                        className="mb-1 block text-sm font-medium"
                      >
                        Rate The Product
                      </label>

                      <div className={styles.input_group_create_item}>
                        <Field
                          as="select"
                          name="review"
                          id="review"
                          placeholder="Review"
                          onChange={(
                            event: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            setFieldValue("review", event.target.value);
                          }}
                          className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="" disabled>
                            Choose
                          </option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </Field>
                      </div>

                      <label
                        htmlFor="interestLevel"
                        className="mb-1 block text-sm font-medium"
                      >
                        Interest Level
                      </label>

                      <div className={styles.input_group_create_item}>
                        <Field
                          as="select"
                          name="interestLevel"
                          id="interestLevel"
                          onChange={(
                            event: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            setFieldValue("interestLevel", event.target.value);
                          }}
                          className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="" disabled>
                            Choose
                          </option>
                          {interestLvl.map((value) => (
                            <option value={value}>{value}</option>
                          ))}
                        </Field>
                      </div>

                      <div className="">
                        <Field
                          as="textarea"
                          name="description"
                          placeholder="Description"
                          rows={10}
                          className={styles.input_desc}
                        />
                      </div>
                      <div className="input-button">
                        <button type="submit" className={styles.button}>
                          Submit Review
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

const ProcessImage = async ({ imageIdCom }: { imageIdCom: string }) => {
  const POST_BODY = {
    imageId: imageIdCom,
  };

  try {
    const response = await axios.post(
      "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/image/download",
      POST_BODY,
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
