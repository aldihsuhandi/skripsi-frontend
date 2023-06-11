import { SessionInfoCall, StringToDateAndBack, UserQuery } from "@/helper";
import Link from "next/link";
import { ImageDownload, ProcessImgBE } from "@/helper";
import {
  UpdateProfileFormValues,
  UpdateProfileRequest,
  UpdateProfileResult,
  UserSummary,
} from "@/types/User";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import Head from "next/head";

import { Session_Local_Key } from "@/types";
import { UpdateUserInfo } from "@/Components/UpdateUserInfo";

export default function UpdateProfile() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserSummary | undefined>(undefined);

  useEffect(() => {
    const sessionString = localStorage.getItem(Session_Local_Key);
    async function sessionAPI() {
      if (sessionString) {
        // Kalo session ada di local, check validity atau dah expired
        const sessionInfo = await SessionInfoCall({ sessionId: sessionString });
        if (sessionInfo) {
          if (sessionInfo.resultContext.success) {
            const emailUser = sessionInfo.sessionSummary.email;

            const userData = await UserQuery({
              key: emailUser,
              identifier: "email",
            });

            if (userData) {
              if (userData.resultContext.success) {
                setUserData(userData.userInfo);
              }
            }

            setIsLoggedIn(true);
          } else if (!sessionInfo.resultContext.success) {
            router.reload();
          }
        }
      } else {
        setIsLoggedIn(false);
      }
    }
    sessionAPI();
  }, []);

  return (
    <>
      <Head>
        <title>Update Profile</title>
      </Head>
      <main>
        {isLoggedIn && userData ? (
          <UpdateUserInfo oldUserData={userData}></UpdateUserInfo>
        ) : (
          <div className="mx-auto p-4">
            <div className="min-w-lg mx-auto flex min-h-[575px] max-w-4xl items-center justify-center rounded-lg bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
              <div className="flex flex-col items-center p-2">
                <p className="text-2xl font-bold">
                  WHOOPS! YOUR SESSION HAS EXPIRED!
                </p>
                <p className="text-2xl font-semibold">_(:3 」∠)_</p>
                <p className="text-2xl font-semibold">
                  You need to login first to be able to update your profile!
                </p>
                <div className="pt-8">
                  <div className="mx-1 rounded-md border border-normal-blue bg-normal-blue">
                    <Link href="/login">
                      <button className="h-10 w-20 px-1 font-semibold text-bright-white hover:border-bright-blue hover:bg-bright-blue">
                        Login
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
