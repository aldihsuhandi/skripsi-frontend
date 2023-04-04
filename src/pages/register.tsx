import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Form.module.css";
import { HiUser, HiFingerPrint, HiAtSymbol, HiPhone } from "react-icons/hi"; //import react icons
import { useState } from "react";

export default function register() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <main>
        <div className="flex h-screen bg-bright-white">
          <div className="m-auto grid h-3/4 w-3/5 overflow-hidden rounded-lg bg-bright-white shadow-2xl lg:grid-cols-2">
            <div className="flex items-center rounded-l-lg bg-gradient-to-br from-blue-800 to-purple-800">
              {/*---> Upload Image Form <---*/}
              {/*V V  Coba-coba 1  V V*/}
              {/* <form className="flex items-center space-x-4">
                <div className="shrink-0">
                  <img
                    className="h-32 w-32 rounded-full object-cover"
                    src="https://i.imgur.com/HhrNVzz.jpeg"
                    alt="Current Profile Photo"
                  />
                </div>
                <label className="block">
                  <span className="sr-only">Choose Image</span>
                  <input
                    type="file"
                    name="image"
                    accept="image/png, image/jpg, image/jpeg"
                    className="block w-full text-sm text-slate-500"
                  />
                </label>
              </form> */}
              {/*V V  Coba-coba 2  V V*/}
              {/* <div className="left flex flex-col justify-center">
                <div className="items-center">
                  <div className="mb-3 w-96">
                    <label
                      htmlFor="formFile"
                      className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
                    >
                      Upload your profile image
                    </label>
                    <input
                      className="focus:border-primary focus:shadow-primary relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding py-[0.32rem] px-3 text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100"
                      type="file"
                      id="formFile"
                    />
                  </div>
                </div>
              </div> */}
            </div>
            <div className="right flex flex-col justify-evenly">
              <div className="py-10 text-center">
                <section className="mx-auto flex w-3/4 flex-col gap-10">
                  {/*---> Title Register Form <---*/}
                  <div className="title">
                    <h1 className="py-4 text-2xl font-bold text-gray-800">
                      Welcome to ShumiShumi!
                    </h1>
                    <p className="mx-auto w-3/4 text-gray-500">
                      Register your account here.
                    </p>
                  </div>
                  {/*---> REGISTER FORM <---*/}
                  {/*---> Email Input <---*/}
                  <form className="flex flex-col gap-5">
                    {/*---> Email Input <---*/}
                    <div className={styles.input_group}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={styles.input_text}
                      />
                      <span className="icon flex items-center px-4">
                        <HiAtSymbol size={25} />
                      </span>
                    </div>
                    {/*---> Username Input <---*/}
                    <div className={styles.input_group}>
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className={styles.input_text}
                      />
                      <span className="icon flex items-center px-4">
                        <HiUser size={25} />
                      </span>
                    </div>
                    {/*---> Phone Number Input <---*/}
                    <div className={styles.input_group}>
                      <input
                        type="text"
                        name="phone_number"
                        placeholder="Phone Number"
                        className={styles.input_text}
                      />
                      <span className="icon flex items-center px-4">
                        <HiPhone size={25} />
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
                    {/*---> Register Button <---*/}
                    <div className="input-button">
                      <button type="submit" className={styles.button}>
                        Register
                      </button>
                    </div>
                  </form>
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
          </div>
        </div>
      </main>
    </>
  );
}
