import { HiUser, HiPhone, HiHome, HiFaceSmile } from "react-icons/hi2";
import {
  HiMail,
  HiFolderAdd,
  HiEmojiHappy,
  HiFingerPrint,
} from "react-icons/hi";
import { StringToDateAndBack } from "@/helper";
import Link from "next/link";
import { ImageDownload, ProcessImgBE } from "@/helper";
import {
  UpdateProfileFormValues,
  UpdateProfileRequest,
  UpdateProfileResult,
  UserSummary,
} from "@/types/User";
import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import { Avatar } from "@/Components/Avatar";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Head from "next/head";
import { Field, Form, Formik } from "formik";
import { UpdateProfileCall } from "@/helper/UpdateProfileCall";
import styles from "../../styles/Form.module.css";
import classNames from "classnames";
import { ImageUpload } from "@/helper/ImageUploadCall";
import { ImageUploadResult } from "@/types/Image";

const MAX_FILE_SIZE = 2 * 1024 * 1024; //2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const initialValues: UpdateProfileFormValues = {
  oldPassword: "",
  profilePicture: undefined,
  email: "",
  username: "",
  phoneNumber: "",
  gender: "",
  dateOfBirth: "",
  password: "",
  confirmPassword: "",
  province: "",
  city: "",
  postCode: "",
  detail: "",
  canWhatsapp: false,
  canTelegram: false,
};

const updateProfileSchema = Yup.object().shape({
  profilePicture: Yup.mixed<File>()
    .notRequired()
    .test(
      "fileSize",
      "File too large, max 2MB",
      (value) => !value || (value && value.size <= MAX_FILE_SIZE)
    )
    .test("fileType", "Unsupported file type", (value) => {
      return !value || (value && SUPPORTED_FORMATS.includes(value.type));
    }),

  email: Yup.string().email("Please enter a valid email!").notRequired(),

  username: Yup.string().notRequired(),

  gender: Yup.string().notRequired(),

  dateOfBirth: Yup.date().notRequired(),

  phoneNumber: Yup.string()
    .notRequired()
    .length(10, "Phone Number must be 10 numbers")
    .matches(/^[0-9]{10}$/, "Phone number must all be numbers"),

  password: Yup.string()
    .min(8, "Password minimum have lenght of 8")
    .matches(/[A-Z]/, "Password must have atleast 1 Uppercase letter")
    .matches(/[a-z]/, "Password must have atleast 1 Lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .notRequired(),

  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Re-typed passwords did not match."
  ),

  oldPassword: Yup.string()
    .min(8, "Password minimum have lenght of 8")
    .matches(/[A-Z]/, "Password must have atleast 1 Uppercase letter")
    .matches(/[a-z]/, "Password must have atleast 1 Lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required in order to save your changes"),

  location: Yup.object().shape({
    province: Yup.string().notRequired(),
    city: Yup.string().notRequired(),
    postCode: Yup.string().notRequired(),
    detail: Yup.string().notRequired(),
  }),
});

export interface OldUserInfoProps extends HTMLAttributes<HTMLDivElement> {
  oldUserData: UserSummary;
}

export const UpdateUserInfo = ({ oldUserData, ...props }: OldUserInfoProps) => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showCurPass, setShowCurPass] = useState(false);
  const [picture, setPicture] = useState<string | undefined>(undefined);
  const [newPicture, setNewPicture] = useState<string | undefined>(undefined);
  const imgRef = useRef<HTMLInputElement>(null);
  const [uploadImg, setUploadImg] = useState<string | undefined>(undefined);
  // const [showError, setShowError] = useState<string | undefined>(undefined);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string | undefined>(
    undefined
  );

  let phnNum = oldUserData.phoneNumber; //Bwt nampilin placeholdernya phone number

  useEffect(() => {
    async function getUserPfp() {
      if (oldUserData.profilePicture) {
        const response = await ImageDownload({
          imageId: oldUserData.profilePicture,
        });
        if (response?.status === 200 && response.data.byteLength !== 0) {
          const imgUrl = await ProcessImgBE(response.data);

          setPicture(imgUrl);
        } else {
          setPicture(undefined);
        }
      }
    }
    getUserPfp();
  }, [oldUserData.profilePicture]);

  return (
    <div className="mx-auto sm:p-6 md:p-12">
      <div className="mx-auto min-h-full rounded-lg bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] md:max-w-5xl">
        <Formik
          initialValues={initialValues}
          validationSchema={updateProfileSchema}
          onSubmit={async (values) => {
            async function uploadImage() {
              if (values.profilePicture) {
                const uploadImgResult = await ImageUpload({
                  image: values.profilePicture,
                });
                // console.log(uploadImgResult?.data.imageId + "dalem function");
                // console.log(
                //   typeof uploadImgResult?.data.imageId + "dalem function"
                // );
                setUploadImg(uploadImgResult?.data.imageId);
                // console.log(uploadImg + "setelah set");
              }
            }
            await uploadImage();
            // console.log(uploadImg);
            const formUpdateProfile: UpdateProfileRequest = {
              email: !values.email ? oldUserData.email : values.email,
              username: !values.username
                ? oldUserData.username
                : values.username,
              gender: !values.gender ? oldUserData.gender : values.gender,
              dateOfBirth: !values.dateOfBirth
                ? oldUserData.dateOfBirth
                : StringToDateAndBack(values.dateOfBirth as string),
              phoneNumber: !values.phoneNumber
                ? oldUserData.phoneNumber
                : "08" + values.phoneNumber,
              profilePicture: uploadImg ?? undefined,
              oldPassword: values.oldPassword,
              password: values.password,
              confirmPassword: values.confirmPassword,
              location: {
                province: values.province,
                city: values.city,
                postCode: values.postCode,
                detail: values.detail,
              },
              canWhatsapp: values.canWhatsapp,
              canTelegram: values.canTelegram,
            };

            // console.log(values?.province);

            const resultFromCall: UpdateProfileResult | undefined =
              await UpdateProfileCall(formUpdateProfile);

            if (resultFromCall) {
              if (resultFromCall.resultContext.success) {
                setIsSuccess(true);
                setResultMessage("Your Profile has Successfully been Updated!");
              } else {
                setResultMessage(resultFromCall.resultContext.resultMsg);
              }
            }
          }}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form className="flex flex-col p-4 sm:flex-col lg:flex-row">
              <div className="items-center pr-4 sm:self-center lg:self-start">
                {/*---> Update Profile Image Form <---*/}
                <img
                  src={newPicture ? newPicture : picture}
                  alt=""
                  className="h-40 w-40 rounded-full md:h-72 md:w-72"
                />
                <div className="flex flex-col justify-center space-y-3 pt-3">
                  <button
                    className="flex flex-col items-center rounded-md border border-normal-blue bg-white p-2 text-normal-blue shadow-sm hover:bg-normal-blue hover:text-white hover:shadow-md"
                    onClick={() => {
                      if (imgRef.current) {
                        imgRef.current.click();
                      }
                    }}
                  >
                    Change Profile Image
                    <Field
                      innerRef={imgRef}
                      type="file"
                      name="profilePicture"
                      hidden
                      value={undefined}
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setFieldValue("profilePicture", event.target.files![0]);
                        if (typeof errors.profilePicture !== undefined) {
                          console.log("No File Error");
                          let pic = URL.createObjectURL(event.target.files![0]);
                          setNewPicture(pic);
                        }
                      }}
                    />
                  </button>
                </div>
              </div>
              {errors.profilePicture && (
                <div>
                  <p className="text-red-500">{errors.profilePicture}</p>
                </div>
              )}
              <div className="flex flex-col pl-5">
                <h1 className="text-lg font-medium text-normal-blue">
                  Edit Your Profile Info
                </h1>
                {/*---> Update Username Form <---*/}
                <label className="">Username</label>
                <div className={styles.input_group_update}>
                  <Field
                    type="text"
                    name="username"
                    placeholder={oldUserData.username}
                    className={styles.input_text_update}
                  />
                  <span className="icon flex items-center pr-2">
                    <HiUser size={20} />
                  </span>
                </div>
                {/*---> Update Gender Form (Selection) <---*/}
                <label className="pt-2">Gender</label>
                <div className={styles.input_group_update}>
                  <Field
                    as="select"
                    name="gender"
                    className={styles.custom_option_update}
                  >
                    <option value="" disabled hidden>
                      {oldUserData.gender}
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Field>
                  <span className="icon flex items-center pr-2 pl-2">
                    <HiEmojiHappy size={20} />
                  </span>
                </div>
                {/*---> Update DOB Form (String -> Date -> String) <---*/}
                <label className="pt-2">Date of Birth</label>
                <div className={styles.input_group_update}>
                  <Field
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    // placeholder={oldUserData.dateOfBirth}
                    className="w-full rounded-md bg-white py-2 px-2 hover:cursor-pointer"
                  ></Field>
                </div>
                {/*---> Update Email Form <---*/}
                <label className="pt-2">Email</label>
                <div className={styles.input_group_update}>
                  <Field
                    type="email"
                    name="email"
                    placeholder={oldUserData.email}
                    className={styles.input_text_update}
                  />
                  <span className="icon flex items-center pr-2">
                    <HiMail size={20} />
                  </span>
                </div>
                {/*---> Update Phone Number Form <---*/}
                <label className="pt-2">Phone Number</label>
                <div className={styles.input_group_update}>
                  <div className="self-center pl-2">08</div>
                  <Field
                    type="text"
                    name="phoneNumber"
                    placeholder={phnNum.slice(2)}
                    className={styles.input_text_update}
                  />
                  <span className="icon flex items-center pr-2">
                    <HiPhone size={20} />
                  </span>
                </div>
                {/*---> Can be Contacted via WA/Telegram <---*/}
                <div className="flex flex-row items-center">
                  <label className="pt-1 pr-3">Can be contacted via:</label>
                  <label className="flex flex-row pt-1">
                    <Field
                      name="canWhatsapp"
                      type="checkbox"
                      // className="pr-1"
                    />
                    <span className="pl-1 pr-2">Whatsapp</span>
                  </label>
                  <label className="flex flex-row pt-1">
                    <Field name="canTelegram" type="checkbox" />
                    <span className="pl-1">Telegram</span>
                  </label>
                </div>
                {/*---> Insert/Update Location Form <---*/}
                <h1 className="pt-2 text-lg font-medium text-normal-blue">
                  Edit Your Location Info
                </h1>
                <div className="flex flex-row">
                  <div className="flex flex-col pr-1">
                    {/*---> Insert/Update Province <---*/}
                    <label className="">Province</label>
                    <div className={styles.input_location}>
                      <Field
                        type="text"
                        name="province"
                        placeholder="Province"
                        className={styles.input_text_location}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col pr-1">
                    {/*---> Insert/Update City <---*/}
                    <label className="">City</label>
                    <div className={styles.input_location}>
                      <Field
                        type="text"
                        name="city"
                        placeholder="City"
                        className={styles.input_text_location}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {/*---> Insert/Update Post Code <---*/}
                    <label className="">Post Code</label>
                    <div className={styles.input_location}>
                      <Field
                        type="text"
                        name="postCode"
                        placeholder="Post Code"
                        className={styles.input_text_location}
                      />
                    </div>
                  </div>
                </div>
                {/*---> Insert/Update Address Detail <---*/}
                <label className="">Address Detail</label>
                <div className={styles.input_location_detail}>
                  <Field
                    type="text"
                    name="detail"
                    placeholder="Address Detail"
                    className={styles.input_text_location}
                  />
                </div>
                {/*---> Insert/Update New Passwords <---*/}
                <h1 className="pt-2 text-lg font-medium text-normal-blue">
                  Change Your Password
                </h1>
                <div className="flex flex-row">
                  <div className="flex flex-col pr-1">
                    {/*---> Insert New Passwords <---*/}
                    <label className="">New Password</label>
                    <div className={styles.input_pass_update}>
                      <Field
                        type={`${showPass ? "text" : "password"}`}
                        name="password"
                        placeholder="New Password"
                        className={styles.input_text_update}
                      />
                      <span
                        className="icon flex items-center pr-2"
                        onClick={() => setShowPass(!showPass)}
                      >
                        <HiFingerPrint size={20} />
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {/*---> Insert New Passwords Confirmation <---*/}
                    <label className="">New Password Confirmation</label>
                    <div className={styles.input_pass_update}>
                      <Field
                        type={`${showPass ? "text" : "password"}`}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className={styles.input_text_update}
                      />
                      <span
                        className="icon flex items-center pr-2"
                        onClick={() => setShowPass(!showPass)}
                      >
                        <HiFingerPrint size={20} />
                      </span>
                    </div>
                  </div>
                </div>
                {/*---> Insert Old Password to Save Changes on Update Profile <---*/}
                <h1 className="pt-2 text-lg font-medium text-normal-blue">
                  Current Password for Saving Changes
                  <h1 className="inline-block text-red-500">*</h1>
                </h1>
                <label className="">Your Current Password</label>
                <div className={styles.input_pass_update}>
                  <Field
                    type={`${showCurPass ? "text" : "password"}`}
                    name="oldPassword"
                    placeholder="Your Current Password"
                    className={styles.input_text_update}
                  />
                  <span
                    className="icon flex items-center pr-2"
                    onClick={() => setShowCurPass(!showCurPass)}
                  >
                    <HiFingerPrint size={20} />
                  </span>
                </div>

                {errors.email && (
                  <div>
                    <p className="text-red-500">{errors.email}</p>
                  </div>
                )}

                {errors.username && (
                  <div>
                    <p className="text-red-500">{errors.username}</p>
                  </div>
                )}

                {errors.password && (
                  <div>
                    <p className="text-red-500">{errors.password}</p>
                  </div>
                )}

                {errors.confirmPassword && (
                  <div>
                    <p className="text-red-500">{errors.confirmPassword}</p>
                  </div>
                )}

                {errors.oldPassword && touched.oldPassword && (
                  <div>
                    <p className="text-red-500">{errors.oldPassword}</p>
                  </div>
                )}

                {resultMessage && (
                  <div>
                    <p
                      className={classNames(
                        { "text-green-500": isSuccess },
                        { "text-red-500": !isSuccess }
                      )}
                    >
                      {resultMessage}
                    </p>
                  </div>
                )}

                {/*---> BUTTONS <---*/}
                <div className="flex flex-row items-center">
                  {/*---> Button Save Changes nya <---*/}
                  <div className="input-changes pt-4">
                    <button
                      type="submit"
                      className="flex flex-col items-center rounded-md border border-normal-blue bg-normal-blue p-2 px-6 text-white shadow-sm hover:border-bright-blue hover:bg-bright-blue hover:shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                  {/*---> Button Buat Balik ke Profile Page <---*/}
                  <div className="input-changes pt-4 pl-4">
                    <Link
                      href="/UserProfile"
                      className="flex flex-col items-center rounded-md border border-normal-blue bg-white p-2 px-6 text-normal-blue shadow-sm hover:border-normal-blue hover:bg-normal-blue hover:text-white hover:shadow-md"
                    >
                      <button>Back to Profile</button>
                    </Link>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
