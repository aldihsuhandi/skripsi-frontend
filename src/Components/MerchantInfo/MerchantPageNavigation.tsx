import { SessionInfoCall, UserQuery } from "@/helper";
import { Session_Local_Key } from "@/types";
import { UserSummary } from "@/types/User";
import classNames from "classnames";
import Link from "next/link";
import styles from "../../styles/MerchantNavButton.module.css";
import React, { HTMLAttributes, useEffect, useState } from "react";
import { useRouter } from "next/router";

export interface MerchantPageNavigationProps
  extends HTMLAttributes<HTMLDivElement> {
  email?: string;
  merchantName: string;
}

export const MerchantPageNavigation = ({
  email,
  merchantName,
  ...props
}: MerchantPageNavigationProps) => {
  const router = useRouter();
  const merchantEncoded = encodeURIComponent(merchantName);
  const [userData, setUserData] = useState<UserSummary | undefined>(undefined);

  const button_data = [
    {
      name: "Home",
      link: `/merchant/${merchantEncoded}`,
    },
    {
      name: "Products",
      link: `/merchant/${merchantEncoded}/item`,
    },
    {
      name: "Reviews",
      link: `/merchant/${merchantEncoded}/reviews`,
    },
  ];

  useEffect(() => {
    const sessionString = localStorage.getItem(Session_Local_Key);
    async function getLoggedInInfo() {
      if (sessionString) {
        // Kalo session ada di local, check validity atau dah expired
        const sessionInfo = await SessionInfoCall({ sessionId: sessionString });
        if (sessionInfo) {
          if (sessionInfo.resultContext.success) {
            // ambil email
            const emailUser = sessionInfo.sessionSummary.email;

            // panggil user/query, uat profilePicutre Id
            const userData = await UserQuery({
              key: emailUser,
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
    getLoggedInInfo();
  }, []);

  return (
    <div {...props}>
      {button_data.map((data) => {
        return <ButtonAware link={data.link} name={data.name} />;
      })}
      {userData && userData.username === merchantName && (
        // <button>Update/Create Items</button>
        <>
          <ButtonAware
            link={`/merchant/${merchantEncoded}/create`}
            name={"Create"}
          />
          <ButtonAware
            link={`/merchant/${merchantEncoded}/update`}
            name={"Update"}
          />
        </>
      )}
    </div>
  );
};

const ButtonAware = ({ link, name }: { link: string; name: string }) => {
  const router = useRouter();
  const path = router.asPath;
  const isActive = path === link;

  const containerClasses = classNames({
    [styles.button]: true,
    [styles.button_active]: isActive,
  });

  return (
    <Link href={link}>
      <button className={containerClasses}>{name}</button>
    </Link>
  );
};
