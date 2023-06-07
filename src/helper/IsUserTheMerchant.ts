import { Session_Local_Key } from "@/types";
import { SessionInfoCall } from "./SessionInfoCall";
import { UserQuery } from "./UserQueryCall";

export const IsUserTheMerchant = async (merchantName: string) => {
  // get the logged in user's info
  // if not logged in return false
  const sessionString = localStorage.getItem(Session_Local_Key);
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
            // Check if the username matches
            if (userData.userInfo.username === merchantName) {
              return true;
            }
          }
        }
      } else if (!sessionInfo.resultContext.success) {
        return false;
      }
    }
  }

  return false;
};
