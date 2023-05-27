import { Footer } from "@/Components/Footer";
import { NavBar } from "@/Components/NavBar/NavBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;
  const noNav = ["/login", "/register", "/activate", "/forgot", "/user/reset"];

  return (
    <>
      {/*Biar kgk ada navbar di login page */}
      {noNav.includes(pathname) ? null : <NavBar />}{" "}
      <Component {...pageProps} />
      {/*Biar kgk ada footer di login page */}
      {noNav.includes(pathname) ? null : <Footer />}{" "}
      <ToastContainer position="bottom-right" />
    </>
  );
}
