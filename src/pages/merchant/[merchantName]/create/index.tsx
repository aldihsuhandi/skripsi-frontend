import { ImagePreview } from "@/Components/ImagePreview";
import { MerchantPageNavigation } from "@/Components/MerchantInfo";
import { MerchantInfoPage } from "@/Components/MerchantInfo/MerchantInfoPage";
import {
  IsUserTheMerchant,
  ReturnArrayImageIdFromArrayFile,
  UserQuery,
  urlFirstString,
} from "@/helper";
import { FilterDictionary } from "@/helper/FilterDictionary/FIlterDictionaryCall";
import { ItemCreateFormValues } from "@/types";
import { UserSummary } from "@/types/User";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { HiFolderAdd } from "react-icons/hi";
import { HiXCircle } from "react-icons/hi2";
import { toast } from "react-toastify";
import * as Yup from "yup";
import styles from "../../../../styles/Form.module.css";
import { ItemCreate } from "@/helper/ItemCreateUpdate";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const initialValues: ItemCreateFormValues = {
  itemName: "",
  itemPrice: 0,
  itemDescription: "",
  itemQuantity: 0,
  categoryName: "",
  hobbyName: "",
  merchantInterestLevel: "",
  itemImages: [],
};

const CreateSchema = Yup.object().shape({
  itemName: Yup.string().required("Item name Cannot be empty!"),

  itemPrice: Yup.number()
    .required("Item price cannot be empty!")
    .min(100, "The Price must be at least 100 rupiah!"),

  itemDescription: Yup.string().required("The description cannot be empty!"),

  itemQuantity: Yup.number()
    .required("Item quantity cannot be empty!")
    .min(1, "The Quantity must be atleast 1!"),

  categoryName: Yup.string().required("The Category is required"),

  hobbyName: Yup.string().required("The Hobby type/name is required"),

  merchantInterestLevel: Yup.string().required(
    "The Interest Level is required"
  ),

  itemImages: Yup.mixed<File[]>()
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
      if (value && value.length < 10) {
        return true;
      } else {
        return false;
      }
    })
    .test("minLenght", "Please Upload atleast one image", (value) => {
      if (value && value.length !== 0) {
        return true;
      } else {
        return false;
      }
    }),
});

export default function MerchantPage() {
  // Di ni page uat create, harus validasi yang login bener lagi gk tiap buka, just in case
  const router = useRouter();
  const { merchantName } = router.query;

  const [pageTitle, setPageTitle] = useState("");
  const [merchantData, setMerchantData] = useState<UserSummary | undefined>(
    undefined
  );
  const [hobbyList, setHobbyList] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [interestList, setInterestList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const imgRef = useRef<HTMLInputElement>(null);

  const [showError, setShowError] = useState<string | undefined>(undefined);

  const keysArray: Array<keyof ItemCreateFormValues> = Object.keys(
    initialValues
  ) as Array<keyof ItemCreateFormValues>;

  useEffect(() => {
    setPageTitle("Create Item " + urlFirstString(merchantName));
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
            setMerchantData(merchantInfo.userInfo);
            setIsLoading(false);
          }
        }
      }
    }

    async function getDictionaries() {
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
    }

    getMechantInfoAndValidateUser();
    getDictionaries();
  }, [router.isReady, merchantName]);

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
          {merchantData ? (
            <>
              <MerchantInfoPage data={merchantData} />
              <MerchantPageNavigation merchantName={merchantData.username} />
              <h3 className="py-4 text-lg font-bold">Create new item</h3>
              {isLoading && <>Loading</>}
              <br />
            </>
          ) : (
            "Merchant not found"
          )}
          <div className="px-2 pb-2 lg:px-0 lg:pb-4">
            <Formik
              initialValues={initialValues}
              validationSchema={CreateSchema}
              onSubmit={async (values) => {
                // Upload Images
                const imageIds: string[] =
                  await ReturnArrayImageIdFromArrayFile(values.itemImages);

                const resultFromCreate = await ItemCreate({
                  itemName: values.itemName,
                  itemPrice: values.itemPrice,
                  itemDescription: values.itemDescription,
                  itemQuantity: values.itemQuantity,
                  categoryName: values.categoryName,
                  hobbyName: values.hobbyName,
                  merchantInterestLevel: values.merchantInterestLevel,
                  itemImages: imageIds,
                });

                if (
                  resultFromCreate &&
                  resultFromCreate.resultContext.success
                ) {
                  router.push({
                    pathname: `/merchant/${merchantData?.username}/item/${resultFromCreate.itemId}`,
                  });
                } else {
                  setShowError(resultFromCreate?.resultContext.resultMsg);
                }
              }}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  {/*---> itemImages Input <---*/}
                  {/* uat Delete ntar */}
                  <FieldArray name="itemImages">
                    {({ remove }) => {
                      return (
                        <div className="flex flex-row flex-wrap">
                          {[...values.itemImages].map((file, index) => {
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
                                  className="h-full w-full"
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
                      if (imgRef.current) {
                        imgRef.current.click();
                      }
                    }}
                  >
                    <HiFolderAdd size={30} /> Add Images
                    <Field
                      innerRef={imgRef}
                      type="file"
                      name="itemImages"
                      hidden
                      multiple
                      value={undefined}
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        if (values.itemImages.length < 10) {
                          const currentImage = event.target.files;
                          const beforeImage = values.itemImages;
                          if (currentImage) {
                            const imgsArray = beforeImage.concat(
                              Array.from(currentImage)
                            );
                            setFieldValue("itemImages", imgsArray);
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

                  {/*---> Create Button <---*/}
                  <div className="input-button">
                    <button type="submit" className={styles.button}>
                      Create
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
