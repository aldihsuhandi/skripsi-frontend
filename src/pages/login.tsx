import { LoginCall } from "@/helper/LoginCall";
import { OtpSend } from "@/helper/OtpSend";
import { Session_Local_Key } from "@/types";
import { LoginRequest } from "@/types/User";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiFingerPrint, HiUser } from "react-icons/hi"; //import react icons
import * as Yup from "yup";
import styles from "../styles/Form.module.css";

const initialValues: LoginRequest = {
  email: "",
  password: "",
};

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is Required")
    .email("Please enter a valid email"),

  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const router = useRouter();
  const [show, setShow] = useState(false); //Biar bisa show password di dalem form passwordnya

  const [showAPIError, setShowAPIError] = useState<string | undefined>(
    undefined
  );

  // Storing the timeoutId for clean up
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  useEffect(() => {
    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className="flex h-screen bg-bright-white">
          <div className="m-0 grid h-full w-full rounded-lg bg-bright-white shadow-2xl sm:grid-cols-1 md:grid-cols-1 lg:m-auto lg:h-3/4 lg:w-3/5 lg:grid-cols-2">
            <div className="flex auto-cols-auto items-center bg-gradient-to-br from-blue-800 to-purple-800 lg:rounded-l-lg">
              <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                <h1 className="mb-6 text-2xl font-semibold">
                  Make getting into a hobby easier!
                </h1>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
            <div className="right flex flex-col justify-evenly">
              <div className="py-10 text-center">
                <section className="mx-auto flex w-3/4 flex-col gap-10">
                  <div className="title">
                    <h1 className="py-4 text-2xl font-bold text-gray-800">
                      Welcome to ShumiShumi!
                    </h1>
                    <p className="mx-auto w-3/4 text-gray-500">
                      Please login to your account here.
                    </p>
                  </div>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={LoginSchema}
                    onSubmit={async (values) => {
                      const user_Login_Data: LoginRequest = {
                        email: values.email,
                        password: values.password,
                      };

                      const resultFromCall = await LoginCall(user_Login_Data);

                      if (resultFromCall.resultContext.success) {
                        // set local storage
                        localStorage.setItem(
                          Session_Local_Key,
                          resultFromCall.sessionId
                        );
                        // redirect ke home
                        router.push("/");
                      } else if (
                        resultFromCall.resultContext.resultCode ===
                        "USER_NOT_ACTIVE"
                      ) {
                        // show message blom, active
                        setShowAPIError(
                          "Your Accound is inactive, redirecting you to the activate page"
                        );
                        // send otp again
                        await OtpSend({
                          email: values.email,
                          otpType: "USER_ACTIVATION",
                        });
                        // delayed redirect ke activate pass email
                        const timer = setTimeout(() => {
                          router.push({
                            pathname: "/activate",
                            query: { e: values.email },
                          });
                        }, 2000);
                        setTimeoutId(timer);
                      } else if (!resultFromCall.resultContext.success) {
                        // set Error misc, show di bawah
                        setShowAPIError(resultFromCall.resultContext.resultMsg);
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

                        <div className={styles.input_group}>
                          <Field
                            type={`${show ? "text" : "password"}`}
                            name="password"
                            placeholder="Password"
                            className={styles.input_text}
                          />
                          <span
                            className="icon flex items-center px-4"
                            onClick={() => setShow(!show)}
                          >
                            <HiFingerPrint size={25} />
                          </span>
                        </div>
                        {errors.password && touched.password && (
                          <div>
                            <p className="text-red-600">{errors.password}</p>
                          </div>
                        )}

                        <div className="input-button">
                          <button type="submit" className={styles.button}>
                            Login
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>

                  {showAPIError && (
                    <div>
                      <p className="text-red-600">{showAPIError}</p>
                    </div>
                  )}

                  <p className="text-center text-red-600">
                    Forgot Password (next Sprint)
                  </p>
                  <p className="text-center text-gray-400">
                    Don't have an account yet?
                    <Link href={"/register"} className="text-blue-700">
                      &nbsp;Register Here
                    </Link>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
