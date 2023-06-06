import { ImagePreview } from "@/Components/ImagePreview";
import { ItemImage } from "@/Components/ItemImage";
import {
  IsUserTheMerchant,
  ReturnArrayImageIdFromArrayFile,
  UserQuery,
  urlFirstString,
} from "@/helper";
import { FilterDictionary } from "@/helper/FilterDictionary/FIlterDictionaryCall";
import { ItemDetail } from "@/helper/ItemDetail";
import { ItemSummary, ItemUpdateFormValues } from "@/types";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { HiCheckCircle, HiFolderAdd } from "react-icons/hi";
import { HiXCircle } from "react-icons/hi2";
import { toast } from "react-toastify";
import * as Yup from "yup";
import styles from "../../../../styles/Form.module.css";
import { ItemUpdate } from "@/helper/ItemCreateUpdate";

const UpdateSchema = Yup.object().shape({
  itemName: Yup.string(),

  itemPrice: Yup.number().min(100, "The Price must be at least 100 rupiah!"),

  itemDescription: Yup.string().min(1, "description cannot be empty!"),

  itemQuantity: Yup.number().min(1, "The Quantity must be atleast 1!"),

  categoryName: Yup.string(),

  hobbyName: Yup.string(),

  merchantInterestLevel: Yup.string(),

  addedImage: Yup.mixed<File[]>()
    .test("fileSize", "one of the File exceeds the 2MB limit", (value) => {
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
      "one of the File has Unsupported File Format",
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
    .test("arrayLenght", "Maximum is 10 images", (value) => {
      if (value && value.length <= 10) {
        return true;
      } else {
        return false;
      }
    }),

  removedImage: Yup.array(),
});

export default function UpdateItem() {
  const router = useRouter();
  const { itemId, merchantName } = router.query;

  const [legitItemId, setLegitItemId] = useState<string>("");
  const [pageTitle, setPageTitle] = useState("");
  const [showError, setShowError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hobbyList, setHobbyList] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [interestList, setInterestList] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<ItemUpdateFormValues>({
    itemName: "",
    itemPrice: 0,
    itemDescription: "",
    itemQuantity: 0,
    categoryName: "",
    hobbyName: "",
    merchantInterestLevel: "",
    addedImage: [],
    removedImage: [],
  });
  const [curImages, setCurImages] = useState<string[] | undefined>(undefined);
  const imgRefAdd = useRef<HTMLInputElement>(null);

  const keysArray: Array<keyof ItemUpdateFormValues> = Object.keys(
    initialValues
  ) as Array<keyof ItemUpdateFormValues>;

  const [itemData, setItemData] = useState<ItemSummary | undefined>(undefined);

  useEffect(() => {
    async function getMechantInfoAndValidateUser() {
      const checkMerchantName = urlFirstString(merchantName);

      if (checkMerchantName) {
        const isUserAllowed = await IsUserTheMerchant(checkMerchantName);
        if (isUserAllowed) {
          const merchantInfo = await UserQuery({
            key: checkMerchantName,
            identifier: "username",
          });

          if (merchantInfo?.resultContext.success) {
            setIsLoading(false);
          }
        } else {
          router.back();
        }
      }
    }

    const getDictionaries = async () => {
      // Masih Temp errornya, di different Task
      const hobList = await FilterDictionary({ dictionaryKey: "HOBBY" });
      const catList = await FilterDictionary({
        dictionaryKey: "CATEGORY",
      });
      const inList = await FilterDictionary({
        dictionaryKey: "INTEREST_LEVEL",
      });

      hobList?.resultContext.success
        ? setHobbyList(hobList.dictionaries)
        : setHobbyList([
            "There was an error fetching this data, try refreshing or try again later.",
          ]);
      catList?.resultContext.success
        ? setCategoryList(catList.dictionaries)
        : setCategoryList([
            "There was an error fetching this data, try refreshing or try again later.",
          ]);
      inList?.resultContext.success
        ? setInterestList(inList.dictionaries)
        : setInterestList([
            "There was an error fetching this data, try refreshing or try again later.",
          ]);
    };

    const setInitialFormValues = async () => {
      //   await fetchItemData();

      if (itemId) {
        setIsLoading(true);

        const itemDataFetch = await ItemDetail({
          itemId: itemId as string,
        });

        if (Array.isArray(itemId)) {
          setLegitItemId(itemId[0]);
        } else {
          setLegitItemId(itemId);
        }

        if (itemDataFetch && itemDataFetch.resultContext.success) {
          setItemData(itemDataFetch.item);
          setPageTitle("Updating " + itemDataFetch.item.itemName);
          setIsLoading(false);

          setInitialValues({
            itemName: itemDataFetch.item.itemName,
            itemPrice: itemDataFetch.item.itemPrice,
            itemDescription: itemDataFetch.item.itemDescription,
            itemQuantity: itemDataFetch.item.itemQuantity,
            categoryName: itemDataFetch.item.itemCategory,
            hobbyName: itemDataFetch.item.hobby,
            merchantInterestLevel: itemDataFetch.item.merchantLevel,
            addedImage: [],
            removedImage: [],
          });
          setCurImages(itemDataFetch.item.itemImages);
        }
      }
    };

    getMechantInfoAndValidateUser();
    setInitialFormValues();
    getDictionaries();
  }, [router.isReady, itemId, merchantName]);

  function handleKeyDownPreventWords(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    // Allow: backspace, delete, tab, escape, enter, and decimal point
    // TODO: Test lagi yang bener2 perlu di allow dan di ban apa di field number/max-min-price
    if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key === "Tab" ||
      event.key === "Escape" ||
      event.key === "Enter" ||
      event.key === "."
    ) {
      // Allow input
      return;
    }

    if (event.key === " ") {
      event.preventDefault();
    }

    // Ensure that it is a number and stop the keypress
    if (isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="m-0 flex min-h-screen flex-col py-0 lg:mx-auto lg:max-w-screen-lg lg:py-11 xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          <div className="p-2 lg:p-0">
            {isLoading ? (
              <>Loading</>
            ) : (
              <p className="text-lg font-bold">
                Updating item: {itemData?.itemName}
              </p>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={UpdateSchema}
              enableReinitialize
              onSubmit={async (values) => {
                let isUploadFine: boolean = true;
                let imageIds: string[] | undefined;
                if (values.addedImage) {
                  imageIds = await ReturnArrayImageIdFromArrayFile(
                    values.addedImage
                  );
                }

                // Kalau values.added itu ada, berarti harusnya imageIds nggak undefined
                if (values.addedImage && !imageIds) {
                  isUploadFine = false;
                }

                const currentImageLen = curImages?.length ?? 0;
                const addedImageLen = imageIds?.length ?? 0;
                const totalImage = currentImageLen + addedImageLen;

                if (totalImage === 0) {
                  setShowError("An Item needs at least 1 Image!");
                } else if (totalImage > 10) {
                  setShowError("An Item has a maximun of 10 Images");
                } else if (isUploadFine === false) {
                  toast.error("A problem occured when uploading the image", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    theme: "colored",
                  });
                } else if (totalImage > 0 && totalImage <= 10) {
                  const resultFromUpdate = await ItemUpdate({
                    itemId: legitItemId,
                    itemUpdateContext: {
                      itemName: values.itemName,
                      itemPrice: values.itemPrice,
                      itemDescription: values.itemDescription,
                      itemQuantity: values.itemQuantity,
                      categoryName: values.categoryName,
                      hobbyName: values.hobbyName,
                      merchantInterestLevel: values.merchantInterestLevel,
                      removedImage: values.removedImage,
                      addedImage: imageIds?.length === 0 ? undefined : imageIds,
                    },
                  });

                  if (
                    resultFromUpdate &&
                    resultFromUpdate.resultContext.success
                  ) {
                    router.push({
                      pathname: `/merchant/${merchantName}/item/${itemId}`,
                    });
                  } else {
                    setShowError(resultFromUpdate?.resultContext.resultMsg);
                  }
                }
              }}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  {/* Remove Images */}
                  <FieldArray name="removedImage">
                    {({ push, remove }) => {
                      return (
                        <>
                          {/* Current Images */}
                          <div className="rounded bg-slate-300 p-2">
                            <p className="text-lg">
                              Current Images (click to remove):
                            </p>
                          </div>
                          <div className="flex flex-row flex-wrap">
                            {curImages &&
                              curImages.map((data, index) => {
                                return (
                                  <div className="relative m-2 h-[80px] w-[80px] cursor-pointer">
                                    {/* img from string imageId */}
                                    <ItemImage
                                      imageId={data}
                                      alt={`currentImage-${data}-${index}`}
                                      height="100%"
                                      width="100%"
                                      className="h-full w-full self-center rounded"
                                    />

                                    <div
                                      className={styles.overlay}
                                      onClick={() => {
                                        push(data);
                                        setCurImages((prevItems) => {
                                          if (prevItems) {
                                            const temp = [...prevItems];
                                            temp.splice(index, 1);
                                            return temp;
                                          }
                                        });
                                      }}
                                    >
                                      <HiXCircle size={30} />
                                    </div>
                                  </div>
                                );
                              })}
                          </div>

                          {values.removedImage?.length !== 0 && (
                            <div className="rounded bg-slate-300 p-2">
                              <p className="text-lg">
                                Images to be removed (click to add back):
                              </p>
                            </div>
                          )}
                          {/* Removed Images */}
                          <div className="flex flex-row flex-wrap">
                            {values.removedImage &&
                              values.removedImage.map((data, index) => {
                                return (
                                  <>
                                    <div className="relative m-2 h-[80px] w-[80px] cursor-pointer">
                                      {/* img from string imageId */}
                                      <ItemImage
                                        imageId={data}
                                        alt={`currentImage-${data}-${index}`}
                                        height="100%"
                                        width="100%"
                                        className="h-full w-full self-center rounded object-scale-down"
                                      />

                                      <div
                                        className={styles.overlay}
                                        onClick={() => {
                                          setCurImages(curImages?.concat(data));
                                          remove(index);
                                        }}
                                      >
                                        <HiCheckCircle size={30} />
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                          </div>
                        </>
                      );
                    }}
                  </FieldArray>

                  {/* Add Images */}
                  <div className="rounded bg-slate-300 p-2">
                    <p className="mb-2 text-lg">Images to be added:</p>
                    <FieldArray name="addedImage">
                      {({ remove }) => {
                        return (
                          <div className="flex flex-row flex-wrap">
                            {values.addedImage &&
                              [...values.addedImage].map((file, index) => {
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

                    {/* Uploadnya */}
                    <div
                      className="flex cursor-pointer flex-row"
                      onClick={() => {
                        if (imgRefAdd.current) {
                          imgRefAdd.current.click();
                        }
                      }}
                    >
                      <HiFolderAdd size={30} /> Add Images
                      <Field
                        innerRef={imgRefAdd}
                        type="file"
                        name="addedImage"
                        hidden
                        multiple
                        value={undefined}
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          if (
                            values.addedImage &&
                            values.addedImage.length <= 10
                          ) {
                            const currentImage = event.target.files;
                            const beforeImage = values.addedImage;
                            if (currentImage && beforeImage) {
                              const imgsArray = beforeImage.concat(
                                Array.from(currentImage)
                              );
                              setFieldValue("addedImage", imgsArray);
                            }
                          } else {
                            toast.warning("The maximum is 10 images", {
                              position: "top-center",
                              autoClose: 3000,
                              hideProgressBar: false,
                              theme: "colored",
                            });
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="my-2 rounded bg-slate-300 p-2">
                    <p className="mb-2 text-lg">Updated Image(s) Preview:</p>
                    <div className="flex flex-row">
                      {curImages?.map((data) => {
                        return (
                          <div
                            key={data}
                            className="cursor relative m-2 h-[80px] w-[80px]"
                          >
                            <ItemImage
                              imageId={data}
                              alt={`updadedImage-${data}`}
                              height="100%"
                              width="100%"
                              className="h-full w-full self-center rounded object-scale-down"
                            />
                          </div>
                        );
                      })}
                      {values.addedImage?.map((data, index) => {
                        return (
                          <div
                            key={index}
                            className="cursor relative m-2 h-[80px] w-[80px]"
                          >
                            <ImagePreview
                              previewFile={data}
                              altMessage={`updadedImage-${data.name}`}
                              width={80}
                              height={80}
                              className="h-full w-full object-scale-down"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/*---> itemName Input <---*/}
                  <label htmlFor="itemName" className={styles.label_create}>
                    Item Name
                  </label>
                  <div className={styles.input_group_create_item}>
                    <Field
                      type="text"
                      name="itemName"
                      id="itemName"
                      placeholder="Item Name"
                      className={styles.input_text_create_item}
                    />
                  </div>

                  {/*---> itemPrice Input <---*/}
                  <label htmlFor="itemPrice" className={styles.label_create}>
                    Item Price
                  </label>
                  <div className={styles.input_group_create_item}>
                    <Field
                      type="number"
                      name="itemPrice"
                      id="itemPrice"
                      placeholder="Item Price"
                      onKeyDown={handleKeyDownPreventWords}
                      className={styles.input_text_create_item}
                    />
                  </div>

                  {/*---> itemDescription Input <---*/}
                  <label
                    htmlFor="itemDescription"
                    className={styles.label_create}
                  >
                    Item Description
                  </label>
                  <div className={styles.input_group_create_item}>
                    <Field
                      type="text"
                      component="textarea"
                      name="itemDescription"
                      id="itemDescription"
                      placeholder="Item Description"
                      multiline="true"
                      rows="5"
                      className={styles.input_text_create_item}
                    />
                  </div>
                  {/* <button onClick={() => console.log(tampungDesc)}>a</button> */}

                  {/*---> itemQuantity Input <---*/}
                  <label htmlFor="itemQuantity" className={styles.label_create}>
                    Item Quantity
                  </label>
                  <div className={styles.input_group_create_item}>
                    <Field
                      type="number"
                      name="itemQuantity"
                      id="itemQuantity"
                      placeholder="Item Quantity"
                      onKeyDown={handleKeyDownPreventWords}
                      className={styles.input_text_create_item}
                    />
                  </div>

                  {/*---> categoryName Input <---*/}
                  <label
                    htmlFor="categoryName"
                    className="mb-1 block text-sm font-medium"
                  >
                    Category
                  </label>

                  <div className={styles.input_group_create_item}>
                    <Field
                      as="select"
                      name="categoryName"
                      id="categoryName"
                      onChange={(
                        event: React.ChangeEvent<HTMLSelectElement>
                      ) => {
                        setFieldValue("categoryName", event.target.value);
                      }}
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Choose</option>
                      {categoryList.map((value) => (
                        <option value={value}>{value}</option>
                      ))}
                    </Field>
                  </div>

                  {/*---> hobbyName Input <---*/}
                  <label
                    htmlFor="hobbyName"
                    className="mb-1 block text-sm font-medium"
                  >
                    Hobby
                  </label>

                  <div className={styles.input_group_create_item}>
                    <Field
                      as="select"
                      name="hobbyName"
                      id="hobbyName"
                      onChange={(
                        event: React.ChangeEvent<HTMLSelectElement>
                      ) => {
                        setFieldValue("hobbyName", event.target.value);
                      }}
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Choose</option>
                      {hobbyList.map((value) => (
                        <option value={value}>{value}</option>
                      ))}
                    </Field>
                  </div>

                  {/*---> merchantInterestLevel Input <---*/}
                  <label
                    htmlFor="merchantInterestLevel"
                    className="mb-1 block text-sm font-medium"
                  >
                    Interest Level
                  </label>

                  <div className={styles.input_group_create_item}>
                    <Field
                      as="select"
                      name="merchantInterestLevel"
                      id="merchantInterestLevel"
                      onChange={(
                        event: React.ChangeEvent<HTMLSelectElement>
                      ) => {
                        setFieldValue(
                          "merchantInterestLevel",
                          event.target.value
                        );
                      }}
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Choose</option>
                      {interestList.map((value) => (
                        <option value={value}>{value}</option>
                      ))}
                    </Field>
                  </div>

                  <div className="my-2">
                    {keysArray.map((key) => {
                      return (
                        <ErrorMessage
                          key={key}
                          name={key}
                          component="div"
                          className="text-red-600"
                        />
                      );
                    })}
                  </div>

                  {showError && (
                    <div>
                      <p className="text-red-600">{showError}</p>
                    </div>
                  )}

                  {/*---> Update Button <---*/}
                  <div className="input-button">
                    <button type="submit" className={styles.button}>
                      Update
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </>
  );
}
