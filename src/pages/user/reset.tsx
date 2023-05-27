import Head from "next/head";
import { useEffect, useState } from "react";
import { HiUser, HiFingerPrint, HiAtSymbol } from "react-icons/hi2";
import styles from "../../styles/Form.module.css";
import {
  ForgotPassFormValues,
  ForgotPassRequest,
  ForgotPassResult,
  ResetPassQueryResult,
} from "@/types/User";
import * as Yup from "yup";
import { ResetPassQuery, urlFirstString } from "@/helper";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import { ForgotPassCall } from "@/helper/ForgotPassCall";
import { toast } from "react-toastify";
import classNames from "classnames";

//di reset_password page ntar jgn lupa request/await/panggil si (apapun itulah) yg ada di dlm ResetPassQuerycall nya!!
const initialValues: ForgotPassFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

const ResetPassSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is Required")
    .email("Please enter a valid email"),

  password: Yup.string()
    .min(8, "Password minimum have length of 8")
    .matches(/[A-Z]/, "Password must have atleast 1 Uppercase letter")
    .matches(/[a-z]/, "Password must have atleast 1 Lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required!"),

  confirmPassword: Yup.string()
    .required("Please re-type your password")
    .oneOf([Yup.ref("password")], "Re-typed passwords did not match."),
});

export default function reset_password() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | undefined>(
    undefined
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [resetQueried, setResetQueried] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(
    undefined
  );
  const { e } = router.query;

  useEffect(() => {
    const queryEmailFunc = async (queried: string) => {
      const queryResetResult = await ResetPassQuery({
        uuid: queried,
      });
      if (queryResetResult) {
        if (queryResetResult.resultContext.success) {
          setResetQueried(queryResetResult.email);
        }
      }
    };

    if (router.isReady) {
      const email_e = urlFirstString(e);
      if (email_e) {
        queryEmailFunc(email_e);
      }
    }

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId, e, router.isReady]);

  return (
    <>
      <Head>
        <title>Reset Your Password</title>
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
                      Reset Your Password!
                    </h1>
                    <p className="mx-auto w-3/4 text-gray-500">
                      Fill the form below to reset your password!
                    </p>
                  </div>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={ResetPassSchema}
                    onSubmit={async (values) => {
                      const formDataResetPass: ForgotPassRequest = {
                        email: values.email,
                        password: values.password,
                        confirmPassword: values.confirmPassword,
                      };

                      const resultFromCall: ForgotPassResult | undefined =
                        await ForgotPassCall(formDataResetPass);
                      if (resultFromCall) {
                        if (resultFromCall.resultContext.success) {
                          setIsSuccess(true);
                          setResultMessage(
                            "Your Password has been Successfully Reset! Redirecting to login page shortly!"
                          );
                          const timer = setTimeout(() => {
                            router.push("/login");
                          }, 2000);
                          setTimeoutId(timer);
                        } else {
                          setResultMessage(
                            resultFromCall.resultContext.resultMsg
                          );
                        }
                      }
                    }}
                  >
                    {({ errors, touched }) => (
                      <Form className="flex flex-col gap-5">
                        {/*---> Email Input <---*/}
                        <div className={styles.input_group}>
                          <Field
                            type="email"
                            name="email"
                            placeholder="email"
                            className={styles.input_text}
                          />
                          <span className="icon flex items-center px-4">
                            <HiAtSymbol size={25} />
                          </span>
                        </div>
                        {/*---> Password Input <---*/}
                        <div className={styles.input_group}>
                          <Field
                            type={`${show ? "text" : "password"}`}
                            name="password"
                            placeholder="password"
                            className={styles.input_text}
                          />
                          <span
                            className="icon flex items-center px-4"
                            onClick={() => setShow(!show)}
                          >
                            <HiFingerPrint size={25} />
                          </span>
                        </div>
                        {/*---> Confirm Password Input <---*/}
                        <div className={styles.input_group}>
                          <Field
                            type={`${show ? "text" : "password"}`}
                            name="confirmPassword"
                            placeholder="confirm password"
                            className={styles.input_text}
                          />
                          <span
                            className="icon flex items-center px-4"
                            onClick={() => setShow(!show)}
                          >
                            <HiFingerPrint size={25} />
                          </span>
                        </div>

                        {errors.email && touched.email && (
                          <div>
                            <p className="text-red-600">{errors.email}</p>
                          </div>
                        )}

                        {errors.password && touched.password && (
                          <div>
                            <p className="text-red-600">{errors.password}</p>
                          </div>
                        )}

                        {errors.confirmPassword && touched.confirmPassword && (
                          <div>
                            <p className="text-red-600">
                              {errors.confirmPassword}
                            </p>
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

                        <div className="input-button">
                          <button type="submit" className={styles.button}>
                            Reset Password
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
