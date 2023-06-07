import { ReviewPageNavigation } from "@/Components/ReviewsComponent/ReviewPageNavigation";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NeedReviews() {
  return (
    <>
      <Head>
        <title>Review: Needs to be Reviewed</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mx-auto p-4">
          <div className="mx-auto flex min-h-screen min-w-fit max-w-4xl flex-col rounded-lg bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
            <ReviewPageNavigation />
            <h1>INI PAGE ISINYA BWT ITEM2 YG BLM DI REVIEW</h1>
          </div>
        </div>
      </main>
    </>
  );
}
