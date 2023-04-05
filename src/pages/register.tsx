import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Form.module.css";
import {
  HiUser,
  HiFingerPrint,
  HiAtSymbol,
  HiPhone,
  HiFolderAdd,
} from "react-icons/hi"; //import react icons
import { useRef, useState } from "react";
import React from "react";

export default function register() {
  const [show, setShow] = useState(false); //Untuk icon-icon yg di bagian register form
  const [picture, setPicture] = useState("");
  const img = React.useRef() as React.MutableRefObject<HTMLInputElement>; //Help me

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <main>
        <div className="flex h-screen bg-bright-white">
          <div className="m-auto grid h-3/4 w-3/5 overflow-hidden rounded-lg bg-bright-white shadow-2xl lg:grid-cols-2">
            <div className="flex auto-cols-auto flex-col items-center justify-evenly rounded-l-lg bg-gradient-to-br from-blue-800 to-purple-800">
              {/*---> Upload Image Form <---*/}
              <div className="relative flex max-w-lg flex-col text-center">
                <h1 className="py-4 text-xl font-bold text-normal-white">
                  Upload Your Profile Image
                </h1>
                <div className="relative flex h-64 w-64 flex-col">
                  <img
                    className="h-full w-full rounded-full shadow-md"
                    src={picture ? picture : "https://i.imgur.com/HYCmY98.jpeg"}
                  ></img>
                  <div className="absolute bottom-1 right-3 z-10 flex items-center justify-center rounded-full bg-white p-1">
                    <div
                      className="cursor-pointer rounded-full bg-blue-500 p-[2px]"
                      onClick={() => img.current.click()}
                    >
                      <HiFolderAdd size={30} color="white" />
                      <input
                        ref={img}
                        type="file"
                        id="image_upload"
                        hidden
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={(e) => {
                          let pic = URL.createObjectURL(e.target.files![0]);
                          setPicture(pic);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
