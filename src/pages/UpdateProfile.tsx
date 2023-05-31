// import {
//   HiUser,
//   HiPhone,
//   HiHome,
//   HiFaceSmile,
//   HiCalendarDays,
//   HiArrowLeftOnRectangle,
// } from "react-icons/hi2";
// import { HiMail } from "react-icons/hi";
import { SessionInfoCall, StringToDateAndBack, UserQuery } from "@/helper";
import Link from "next/link";
import { ImageDownload, ProcessImgBE } from "@/helper";
import {
  UpdateProfileFormValues,
  UpdateProfileRequest,
  UpdateProfileResult,
  UserSummary,
} from "@/types/User";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
// import { Avatar } from "@/Components/Avatar";
// import * as Yup from "yup";
import { useRouter } from "next/router";
import Head from "next/head";
// import { Form, Formik } from "formik";
// import { UpdateProfileCall } from "@/helper/UpdateProfileCall";
import { Session_Local_Key } from "@/types";
import { UpdateUserInfo } from "@/Components/UpdateUserInfo";

// const MAX_FILE_SIZE = 2 * 1024 * 1024; //2MB
// const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

// const initialValues: UpdateProfileFormValues = {
//   oldPassword: "",
//   profilePicture: undefined,
//   email: "",
//   username: "",
//   phoneNumber: "",
//   gender: "",
//   dateOfBirth: "",
//   password: "",
//   confirmPassword: "",
//   location: { province: "", city: "", postCode: "", detail: "" },
// };

// const updateProfileSchema = Yup.object().shape({
//   profilePicture: Yup.mixed<File>()
//     .notRequired()
//     .test(
//       "fileSize",
//       "File too large, max 2MB",
//       (value) => !value || (value && value.size <= MAX_FILE_SIZE)
//     )
//     .test("fileType", "Unsupported file type", (value) => {
//       return !value || (value && SUPPORTED_FORMATS.includes(value.type));
//     }),

//   email: Yup.string().email("Please enter a valid email!").notRequired(),

//   username: Yup.string().notRequired(),

//   gender: Yup.string().notRequired(),

//   dateOfBirth: Yup.date().notRequired(),

//   phoneNumber: Yup.string()
//     .notRequired()
//     .length(10, "Phone Number must be 10 numbers")
//     .matches(/^[0-9]{10}$/, "Phone number must all be numbers"),

//   password: Yup.string()
//     .min(8, "Password minimum have lenght of 8")
//     .matches(/[A-Z]/, "Password must have atleast 1 Uppercase letter")
//     .matches(/[a-z]/, "Password must have atleast 1 Lowercase letter")
//     .matches(/[0-9]/, "Password must contain at least one number")
//     .notRequired(),

//   confirmPassword: Yup.string().oneOf(
//     [Yup.ref("password")],
//     "Re-typed passwords did not match."
//   ),

//   oldPassword: Yup.string()
//     .min(8, "Password minimum have lenght of 8")
//     .matches(/[A-Z]/, "Password must have atleast 1 Uppercase letter")
//     .matches(/[a-z]/, "Password must have atleast 1 Lowercase letter")
//     .matches(/[0-9]/, "Password must contain at least one number")
//     .required("Password is required in order to save your changes"),

//   location: Yup.object().notRequired(),
// });

// export interface OldUserInfoProps {
//   oldUserData: UserSummary;
// }

export default function UpdateProfile() {
  //   const [showPass, setShowPass] = useState(false);
  //   const [picture, setPicture] = useState<string | undefined>(undefined);
  //   const [newPicture, setNewPicture] = useState<string | undefined>(undefined);
  //   const imgRef = useRef<HTMLInputElement>(null);
  //   const [showError, setShowError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserSummary | undefined>(undefined);

  useEffect(() => {
    const sessionString = localStorage.getItem(Session_Local_Key);
    async function sessionAPI() {
      if (sessionString) {
        // Kalo session ada di local, check validity atau dah expired
        const sessionInfo = await SessionInfoCall({ sessionId: sessionString });
        if (sessionInfo) {
          if (sessionInfo.resultContext.success) {
            const emailUser = sessionInfo.sessionSummary.email;

            const userData = await UserQuery({
              key: emailUser,
              identifier: "email",
            });

            if (userData) {
              if (userData.resultContext.success) {
                setUserData(userData.userInfo);
              }
            }

            setIsLoggedIn(true);
          } else if (!sessionInfo.resultContext.success) {
            router.reload();
          }
        }
      } else {
        setIsLoggedIn(false);
      }
    }
    sessionAPI();
  }, []);

  //   const oldUserInfo = ({ oldUserData }: OldUserInfoProps) => {
  //     useEffect(() => {
  //       async function getUserPfp() {
  //         if (oldUserData.profilePicture) {
  //           const response = await ImageDownload({
  //             imageId: oldUserData.profilePicture,
  //           });
  //           if (response?.status === 200 && response.data.byteLength !== 0) {
  //             const imgUrl = await ProcessImgBE(response.data);

  //             setPicture(imgUrl);
  //           } else {
  //             setPicture(undefined);
  //           }
  //         }
  //       }
  //       getUserPfp();
  //     }, [oldUserData.profilePicture]);
  //   };

  return (
    <>
      <Head>
        <title>Update Profile</title>
      </Head>
      <main>
        {isLoggedIn && userData ? (
          <UpdateUserInfo oldUserData={userData}></UpdateUserInfo>
        ) : (
          <div className="mx-auto p-4">
            <div className="min-w-lg mx-auto flex min-h-[575px] max-w-4xl items-center justify-center rounded-lg bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
              <div className="flex flex-col items-center p-2">
                <p className="text-2xl font-bold">
                  WHOOPS! YOUR SESSION HAS EXPIRED!
                </p>
                <p className="text-2xl font-semibold">_(:3 」∠)_</p>
                <p className="text-2xl font-semibold">
                  You need to login first to see your profile's page!
                </p>
                <div className="pt-8">
                  <div className="mx-1 rounded-md border border-normal-blue bg-normal-blue">
                    <Link href="/login">
                      <button className="h-10 w-20 px-1 font-semibold text-bright-white hover:border-bright-blue hover:bg-bright-blue">
                        Login
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* <div className="mx-auto sm:p-6 md:p-12">
          <div className="mx-auto min-h-[625px] rounded-lg bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] md:max-w-5xl">
            <Formik
              initialValues={initialValues}
              validationSchema={updateProfileSchema}
              onSubmit={async (values) => {
                const formUpdateProfile: UpdateProfileRequest = {
                  email: values.email,
                  username: values.username,
                  gender: values.gender,
                  dateOfBirth: StringToDateAndBack(
                    values.dateOfBirth as string
                  ),
                  phoneNumber: "08" + values.phoneNumber,
                  profilePicture: values.profilePicture ?? undefined,
                  oldPassword: values.oldPassword,
                  password: values.password,
                  confirmPassword: values.confirmPassword,
                  location: values.location,
                };

                const resultFromCall: UpdateProfileResult | undefined =
                  await UpdateProfileCall(formUpdateProfile);

                if (resultFromCall) {
                  if (resultFromCall.resultContext.success) {
                    setShowError("");
                  } else {
                    setShowError(resultFromCall.resultContext.resultMsg);
                  }
                }
              }}
            >
              {({ setFieldValue, errors, touched }) => (
                <Form className="flex flex-col divide-x-0 p-4 sm:flex-row sm:divide-x-2">
                  <div className="self-center pr-4">
                    <img
                      src={picture}
                      alt=""
                      className="h-40 w-40 rounded-full md:h-72 md:w-72"
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div> */}
      </main>
    </>
  );
}
