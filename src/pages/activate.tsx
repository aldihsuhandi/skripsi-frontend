import { ActivateCall } from "@/helper/ActivateCall";
import { OtpSend } from "@/helper/OtpSend";
import {
  ActivateFormValues,
  ActivateRequest,
  ActivateResult,
} from "@/types/User";
import classNames from "classnames";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiKey } from "react-icons/hi"; //import react icons
import * as Yup from "yup";
import styles from "../styles/Form.module.css";

const initialValues: ActivateFormValues = {
  otpCode: "",
};

const ActivateSchema = Yup.object().shape({
  // TODO: Tanya lenght otp-nya brp, pake bawah dan adjust
  otpCode: Yup.string().required(),
  // otpCode: Yup.string().required().min(6).max(6),
});

export default function Activate() {
  const router = useRouter();
  const [resultMessage, setResultMessage] = useState<string | undefined>(
    undefined
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Storing the timeoutId for clean up
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  // !!! MASIH HARAM !!!
  // ini dptin email dari URL
  const e = router.query.e as string;

  const ResendCode = async () => {
    console.log("resend");

    await OtpSend({
      email: e,
      otpType: "USER_ACTIVATION",
    });
  };

  // Timer Clean Up
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
        <title>Activate</title>
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
                      Please check your email for the activation code and
                      activate your account here.
                    </p>
                  </div>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={ActivateSchema}
                    onSubmit={async (values) => {
                      const data_Activate: ActivateRequest = {
                        email: e,
                        otp: values.otpCode,
                      };

                      const resultFromCall: ActivateResult = await ActivateCall(
                        data_Activate
                      );

                      if (resultFromCall.resultContext.success) {
                        setIsSuccess(true);
                        setResultMessage(
                          "Your Accound has been succesfully activated. Redirecting to login page shortly"
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
                    }}
                  >
                    {({ errors, touched }) => (
                      <Form className="flex flex-col gap-5">
                        <div className={styles.input_group}>
                          <Field
                            type="text"
                            name="otpCode"
                            placeholder="otp sent by mail"
                            className={styles.input_text}
                          />
                          <span className="icon flex items-center px-4">
                            <HiKey size={25} />
                          </span>
                        </div>
                        {errors.otpCode && touched.otpCode && (
                          <div>
                            <p className="text-red-600">{errors.otpCode}</p>
                          </div>
                        )}

                        {resultMessage && (
                          <div>
                            <p
                              className={classNames(
                                { "text-green-500": isSuccess },
                                { "text-red-600": !isSuccess }
                              )}
                            >
                              {resultMessage}
                            </p>
                          </div>
                        )}

                        <div className="input-button">
                          <button type="submit" className={styles.button}>
                            Activate
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                  <p className="text-center text-gray-400">
                    Didn't receive the otp code?
                    <button className={styles.button} onClick={ResendCode}>
                      Resend
                    </button>
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
