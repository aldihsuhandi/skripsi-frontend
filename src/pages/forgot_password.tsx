import { ResetPassSend } from "@/helper/ResetPassSendCall";
import { EncryptEmail } from "@/helper/EncryptDecrypt";
import { Session_Local_Key } from "@/types";
import { Formik, Form, Field } from "formik";
import Head from "next/head";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { HiFingerPrint, HiUser } from "react-icons/hi2";
import { toast } from "react-toastify";
import styles from "../styles/Form.module.css";
import { useState } from "react";
import { ResetPassSendRequest } from "@/types/User";
import * as Yup from "yup";

const initialValues: ResetPassSendRequest = {
  email: "",
};

const ForgotPassSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is Required")
    .email("Please enter a valid email"),
});

export default function forgot_password() {
  const router = useRouter();
  const [showError, setShowError] = useState<string | undefined>(undefined);
  const [resultMessage, setResultMessage] = useState<string | undefined>(
    undefined
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Forgot Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className="flex h-screen bg-bright-white">
          <div className="m-0 grid h-full w-full rounded-lg bg-bright-white shadow-2xl sm:grid-cols-1 md:grid-cols-1 lg:m-auto lg:h-3/4 lg:w-3/5 lg:grid-cols-2">
            <div className="flex auto-cols-auto items-center bg-gradient-to-br from-blue-800 to-purple-800 lg:rounded-l-lg">
              <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                <img className="h-full w-full" src="/LOGO-w-text-small.png" />
                <h1 className="mb-2 mt-2 text-2xl font-semibold">SHUMISHUMI</h1>
                <h1 className="mb-6 text-xl font-light italic">
                  Make getting into a hobby easier!
                </h1>
              </div>
            </div>
            <div className="right flex flex-col justify-evenly">
              <div className="py-10 text-center">
                <section className="mx-auto flex w-3/4 flex-col gap-10">
                  <div className="title">
                    <h1 className="py-4 text-2xl font-bold text-gray-800">
                      Forgot Your Password?
                    </h1>
                    <p className="mx-auto w-3/4 text-gray-500">
                      Don't worry! Just send us your email address and we'll
                      help you reset your password.
                    </p>
                  </div>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={ForgotPassSchema}
                    onSubmit={async (values) => {
                      const user_forgot_pass_data: ResetPassSendRequest = {
                        email: values.email,
                      };

                      const resultFromCall = await ResetPassSend(
                        user_forgot_pass_data
                      );

                      if (resultFromCall) {
                        if (resultFromCall.resultContext.success) {
                          toast.success(
                            "We've sent an email regarding your request to reset your password!",
                            {
                              position: "top-center",
                              autoClose: 10000,
                              hideProgressBar: false,
                              theme: "colored",
                            }
                          );
                        } else if (
                          resultFromCall.resultContext.resultCode ===
                          "USER_NOT_EXIST"
                        ) {
                          toast.error(
                            "Uh oh! It seems that the email you are looking for is not exist!",
                            {
                              position: "top-center",
                              autoClose: 10000,
                              hideProgressBar: false,
                              theme: "colored",
                            }
                          );
                        }
                      }
                    }}
                  >
                    {({ errors, touched }) => (
                      <Form className="flex flex-col gap-5">
                        <div className={styles.input_group}>
                          <Field
                            type="email"
                            name="email"
                            placeholder="Email"
                            className={styles.input_text}
                          />
                          <span className="icon flex items-center px-4">
                            <HiUser size={25} />
                          </span>
                        </div>
                        {errors.email && touched.email && (
                          <div>
                            <p className="text-red-600">{errors.email}</p>
                          </div>
                        )}
                        <div className="input-button">
                          <button type="submit" className={styles.button}>
                            Send Reset Confirmation
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
