import Head from "next/head";
import { useState } from "react";
import { HiUser, HiFingerPrint, HiAtSymbol } from "react-icons/hi2";
import styles from "../styles/Form.module.css";

export default function reset_password() {
  const [show, setShow] = useState(false);

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

                  <form className="flex flex-col gap-5">
                    <div className={styles.input_group}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={styles.input_text}
                      />
                      <span className="icon flex items-center px-4">
                        <HiUser size={25} />
                      </span>
                    </div>

                    {/*---> Password Input <---*/}
                    <div className={styles.input_group}>
                      <input
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
                    {/*---> Confirm Password Input <---*/}
                    <div className={styles.input_group}>
                      <input
                        type={`${show ? "text" : "password"}`}
                        name="confirm_password"
                        placeholder="Confirm Password"
                        className={styles.input_text}
                      />
                      <span
                        className="icon flex items-center px-4"
                        onClick={() => setShow(!show)}
                      >
                        <HiFingerPrint size={25} />
                      </span>
                    </div>

                    <div className="input-button">
                      <button type="submit" className={styles.button}>
                        Reset Password
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
