import { SessionInfoCall } from "../SessionInfoCall";

/**
 * Return email string klo valid, undefined klo nggak
 * @param sessionId the session yang mau di check
 * @returns email: string, undefined
 */
export const CheckSessionValid = async (sessionId: string) => {
  const sessionInfo = await SessionInfoCall({ sessionId: sessionId });

  if (sessionInfo.resultContext.success) {
    return sessionInfo.sessionSummary.email;
  }
  return undefined;
};
