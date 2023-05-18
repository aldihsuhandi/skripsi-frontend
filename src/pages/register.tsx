import Head from "next/head";
import Link from "next/link";
import React, { useRef, useState } from "react";
import {
  HiAtSymbol,
  HiFingerPrint,
  HiFolderAdd,
  HiPhone,
  HiUser,
  HiEmojiHappy,
} from "react-icons/hi"; //import react icons
import styles from "../styles/Form.module.css";

import { RegisterPOST } from "@/helper/RegisterCall";
import {
  RegisterFormValues,
  RegisterRequest,
  RegisterResult,
} from "@/types/User";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { EncryptEmail } from "@/helper/EncryptDecrypt";
import { toast } from "react-toastify";
import { StringToDateAndBack } from "@/helper";
import { format } from "date-fns";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const initialValues: RegisterFormValues = {
  profilePicture: undefined,
  email: "",
  username: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  gender: "",
  dateOfBirth: "",
};

const RegisterSchema = Yup.object().shape({
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

  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is Required"),

  username: Yup.string().required("Username cannot be empty!"),

  gender: Yup.string().required("You have to choose your gender!"),

  dateOfBirth: Yup.date().required("You must input your birthday!"),

  phoneNumber: Yup.string()
    .required("Phone Number cannot be empty!")
    .length(10, "Phonenumber must be 10 numbers")
    .matches(/^[0-9]{10}$/, "Phonenumber must all be numbers"),

  password: Yup.string()
    .min(8, "Password minimum have lenght of 8")
    .matches(/[A-Z]/, "Password must have atleast 1 Uppercase letter")
    .matches(/[a-z]/, "Password must have atleast 1 Lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required!"),

  confirmPassword: Yup.string()
    .required("Please re-type your password")
    .oneOf([Yup.ref("password")], "Re-typed passwords did not match."),
});

export default function Register() {
  const router = useRouter();
  const [show, setShow] = useState(false); //Untuk icon-icon yg di bagian register form
  const [showError, setShowError] = useState<string | undefined>(undefined);
  const [picture, setPicture] = useState("");
  const [theDate, setTheDate] = useState();
  const imgRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <main>
        <div className="flex h-screen bg-bright-white">
          <Formik
            initialValues={initialValues}
            validationSchema={RegisterSchema}
            onSubmit={async (values) => {
              // console.log(typeof values.dateOfBirth);
              const formDataSubmitted: RegisterRequest = {
                email: values.email,
                username: values.username,
                phoneNumber: "08" + values.phoneNumber,
                profilePicture: values.profilePicture ?? undefined,
                password: values.password,
                confirmPassword: values.confirmPassword,
                gender: values.gender,
                dateOfBirth: StringToDateAndBack(values.dateOfBirth),
              };

              // console.log(formDataSubmitted);

              const resultFromCall: RegisterResult | undefined =
                await RegisterPOST(formDataSubmitted);

              if (resultFromCall) {
                if (resultFromCall.resultContext.success) {
                  setShowError("");

                  // NOTE: Kalo gagal biarin, tetep redirect, di page /activate ada button resend juga

                  // Encrypt Email
                  const encryptedEmail = await EncryptEmail({
                    email: values.email,
                  });

                  // redirect
                  if (encryptedEmail) {
                    // redirect jika dan hanya jika Encrypt success
                    if (encryptedEmail.resultContext.success) {
                      router.push({
                        pathname: "/activate",
                        query: { e: encryptedEmail.uuid },
                      });
                    } else {
                      toast.error(
                        "We were unable to redirect you to activate the account, please try again later in the login page!",
                        {
                          position: "top-center",
                          autoClose: 10000,
                          hideProgressBar: false,
                          theme: "colored",
                        }
                      );
                    }
                  }
                } else {
                  // berarti ada error
                  setShowError(resultFromCall.resultContext.resultMsg);
                }
              }
            }}
          >
            {({ setFieldValue, errors, touched }) => (
              <Form className="m-0 block h-full w-full overflow-scroll bg-bright-white shadow-2xl lg:m-auto lg:grid lg:h-3/4 lg:w-3/5 lg:grid-cols-2 lg:overflow-hidden lg:rounded-lg">
                <div className="flex auto-cols-auto flex-col items-center justify-evenly bg-gradient-to-br from-blue-800 to-purple-800 lg:rounded-l-lg">
                  {/*---> Upload Image Form <---*/}
                  <div className="relative flex max-w-lg flex-col text-center">
                    <h1 className="py-4 text-xl font-bold text-normal-white">
                      Upload Your Profile Image
                    </h1>
                    <div className="relative flex h-64 w-64 flex-col">
                      <img
                        className="h-full w-full rounded-full shadow-md"
                        src={
                          picture
                            ? picture
                            : "https://pbs.twimg.com/media/FRPL-HkXMAU0EQ_.png"
                        }
                      />
                      <div className="absolute bottom-1 right-3 z-10 flex items-center justify-center rounded-full bg-white p-1">
                        <div
                          className="cursor-pointer rounded-full bg-blue-500 p-[2px]"
                          onClick={() => {
                            if (imgRef.current) {
                              imgRef.current.click();
                            }
                          }}
                        >
                          <HiFolderAdd size={30} color="white" />
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
                              setFieldValue(
                                "profilePicture",
                                event.target.files![0]
                              );
                              if (typeof errors.profilePicture !== undefined) {
                                console.log("No File Error");
                                let pic = URL.createObjectURL(
                                  event.target.files![0]
                                );
                                setPicture(pic);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {errors.profilePicture && (
                      <div>
                        <p className="text-red-600">{errors.profilePicture}</p>
                      </div>
                    )}
                  </div>
                  <div className="bottom-1">
                    <img
                      className="h-full w-40"
                      src="/LOGO-with-text-smaller.png"
                    />
                  </div>
                </div>
                <div className="right flex flex-col justify-evenly overflow-auto">
                  <div className="overflow-auto py-10 text-center">
                    <section className="mx-auto flex w-3/4 flex-col gap-10">
                      {/*---> Title Register Form <---*/}
                      <div className="title">
                        <h1 className="py-2 text-2xl font-bold text-gray-800">
                          You are almost there!
                        </h1>
                        <p className="mx-auto w-3/4 text-gray-500">
                          Register your account here.
                        </p>
                      </div>
                      {/*---> REGISTER FORM <---*/}
                      <div className="flex flex-col gap-5">
                        <div className={styles.input_group}>
                          <Field
                            type="email"
                            name="email"
                            placeholder="Email"
                            className={styles.input_text}
                            // className="placeholder:text-red-500"
                          />
                          <span className="icon flex items-center pr-2">
                            <HiAtSymbol size={20} />
                          </span>
                        </div>

                        {/*---> Username Input <---*/}
                        <div className={styles.input_group}>
                          <Field
                            type="text"
                            name="username"
                            placeholder="Username"
                            className={styles.input_text}
                          />
                          <span className="icon flex items-center pr-2">
                            <HiUser size={20} />
                          </span>
                        </div>

                        {/*---> Phone Number Input <---*/}
                        <div className={styles.input_group}>
                          <div className="self-center pl-2">08</div>
                          <Field
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            className={styles.input_text}
                          />
                          <span className="icon flex items-center pr-2">
                            <HiPhone size={20} />
                          </span>
                        </div>

                        {/*---> Gender Input <---*/}
                        <div className={styles.input_group}>
                          <Field
                            as="select"
                            name="gender"
                            placeholder="Gender"
                            className={styles.custom_option}
                            // className="w-full appearance-none rounded-xl bg-bright-white py-2 px-2 hover:cursor-pointer"
                          >
                            <option value="" disabled hidden>
                              Gender
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Field>
                          <span className="icon flex items-center pr-2">
                            <HiEmojiHappy size={20} className="fill-black" />
                          </span>
                        </div>

                        {/*---> DOB Input <---*/}
                        <div className={styles.input_group}>
                          <Field
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            // placeholder="Date of Birth"
                            className="w-full rounded-xl bg-bright-white py-2 px-2 hover:cursor-pointer"
                          ></Field>
                        </div>

                        {/*---> Password Input <---*/}
                        <div className={styles.input_group}>
                          <Field
                            type={`${show ? "text" : "password"}`}
                            name="password"
                            placeholder="Password"
                            className={styles.input_text}
                          />
                          <span
                            className="icon flex items-center pr-2"
                            onClick={() => setShow(!show)}
                          >
                            <HiFingerPrint size={20} />
                          </span>
                        </div>

                        {/*---> Confirm Password Input <---*/}
                        <div className={styles.input_group}>
                          <Field
                            type={`${show ? "text" : "password"}`}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className={styles.input_text}
                          />
                          <span
                            className="icon flex items-center pr-2"
                            onClick={() => setShow(!show)}
                          >
                            <HiFingerPrint size={20} />
                          </span>
                        </div>

                        <div>
                          {errors.email && touched.email && (
                            <div>
                              <p className="text-red-600">{errors.email}</p>
                            </div>
                          )}
                          {errors.username && touched.username && (
                            <div>
                              <p className="text-red-600">{errors.username}</p>
                            </div>
                          )}

                          {showError && (
                            <div>
                              <p className="text-red-600">{showError}</p>
                            </div>
                          )}

                          {errors.phoneNumber && touched.phoneNumber && (
                            <div>
                              <p className="text-red-600">
                                {errors.phoneNumber}
                              </p>
                            </div>
                          )}

                          {errors.password && touched.password && (
                            <div>
                              <p className="text-red-600">{errors.password}</p>
                            </div>
                          )}

                          {errors.gender && touched.gender && (
                            <div>
                              <p className="text-red-600">{errors.gender}</p>
                            </div>
                          )}

                          <ErrorMessage
                            name="birthday"
                            component="div"
                            className="text-red-600"
                          />

                          {/* {errors.dateOfBirth && touched.dateOfBirth ? <div><p className="text-red-600">{errors.dateOfBirth}</p></div> : null} */}

                          {errors.confirmPassword &&
                            touched.confirmPassword && (
                              <div>
                                <p className="text-red-600">
                                  {errors.confirmPassword}
                                </p>
                              </div>
                            )}
                        </div>

                        {/*---> Register Button <---*/}
                        <div className="input-button">
                          <button type="submit" className={styles.button}>
                            Register
                          </button>
                        </div>
                      </div>
                      {/*---> Bagian bawah <---*/}
                      <p className="text-center text-gray-400">
                        Already have an account?
                        <Link href={"/login"} className="text-blue-700">
                          &nbsp;Login Here
                        </Link>
                      </p>
                    </section>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </>
  );
}
