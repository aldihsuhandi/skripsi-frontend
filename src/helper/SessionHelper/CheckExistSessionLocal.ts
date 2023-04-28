import { Session_Local_Key } from "@/types";

/**
 * Cuman check kalo ada gk session di local, nggak check valid
 * @returns sessionId (exist) or `null` (!exist)
 */
export const CheckExistSessionLocal = () => {
  return localStorage.getItem(Session_Local_Key);
};
