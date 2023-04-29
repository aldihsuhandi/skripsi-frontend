import { CheckExistSessionLocal, CheckSessionValid } from ".";

/**
 * Check session ada gk, cek valid
 * Klo valid true, klo nggak false
 * @returns boolean
 */
export const SessionValidate = async () => {
  const session = CheckExistSessionLocal();
  if (session) {
    const email = await CheckSessionValid(session);
    if (email) {
      return true;
    }
  }
  return false;
};
