import { SessionInfoCall, UserQuery } from "@/helper";
import { Session_Local_Key } from "@/types";
import { UserSummary } from "@/types/User";
import classNames from "classnames";
import Link from "next/link";
import React, { HTMLAttributes, use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/ReviewNavButton.module.css";

// export interface ReviewPageNavigationProps extends HTMLAttributes<HTMLDivElement> {

// }
export const ReviewPageNavigation = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserSummary | undefined>(undefined);

  const review_option = [
    {
      name: "Waiting to be Reviewed",
      link: `/review`,
    },
    {
      name: "My Reviews",
      link: `/review/list`,
    },
  ];

  useEffect(() => {
    const sessionString = localStorage.getItem(Session_Local_Key);
    async function getSession() {
      if (sessionString) {
        const sessionInfo = await SessionInfoCall({ sessionId: sessionString });
        if (sessionInfo) {
          if (sessionInfo.resultContext.success) {
            const getEmailUser = sessionInfo.sessionSummary.email;

            const userData = await UserQuery({
              key: getEmailUser,
              identifier: "email",
            });

            if (userData) {
              if (userData.resultContext.success) {
                setUserData(userData.userInfo);
              }
            }
          }
        }
      }
    }

    getSession();
  }, []);

  return (
    <div className="sticky top-0 h-fit w-full rounded-t-lg bg-white shadow-md">
      {userData && (
        <div className="flex flex-row justify-evenly">
          {review_option.map((data) => {
            return <ButtonReviews link={data.link} name={data.name} />;
          })}
        </div>
      )}
    </div>
  );
};

const ButtonReviews = ({ link, name }: { link: string; name: string }) => {
  const router = useRouter();
  const path = router.asPath;
  const isActive = path === link;

  const stylingButton = classNames({
    [styles.button]: true,
    [styles.button_active]: isActive,
  });

  return (
    <Link href={link}>
      <button className={stylingButton}>{name}</button>
    </Link>
  );
};
