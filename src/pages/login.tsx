import Head from "next/head";
import { Color, COLOR_HEX_STRING } from "@/Components/Color";
import Link from "next/link";
import styles from "../styles/Form.module.css";
import { HiUser, HiFingerPrint } from "react-icons/hi"; //import react icons
import { useState } from "react";

export default function Login() {
  const [show, setShow] = useState(false); //Biar bisa show password di dalem form passwordnya

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main>
        <div className="flex h-screen bg-bright-white">
          <div className="m-auto grid h-3/4 w-3/5 rounded-lg bg-bright-white shadow-2xl sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
            <div className="flex auto-cols-auto items-center rounded-l-lg bg-gradient-to-br from-blue-800 to-purple-800">
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
                  {/*---> Title Login Form <---*/}
                  <div className="title">
                    <h1 className="py-4 text-2xl font-bold text-gray-800">
                      Welcome to ShumiShumi!
                    </h1>
                    <p className="mx-auto w-3/4 text-gray-500">
                      Please login to your account here.
                    </p>
                  </div>
                  {/*---> LOGIN FORM <---*/}
                  {/*---> Email Input <---*/}
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
                    {/*---> Login Button <---*/}
                    <div className="input-button">
                      <button type="submit" className={styles.button}>
                        Login
                      </button>
                    </div>
                  </form>
                  {/*---> Bagian bawah <---*/}
                  <p className="text-center text-red-600">Forgot Password</p>
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
