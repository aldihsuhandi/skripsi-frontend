import { ResultContext } from "../ResultContext";
import { UserRole } from "./UserRole";

// Request

/**
 * Di headers:
 *  clientId
 *  clientSecret
 */

export interface UserQueryRequest {
  key: string;
  identifier: string;
}

// Reponse / Result

export interface UserSummary {
  email: string;
  phoneNumber: string;
  username: string;
  role: UserRole;
  profilePicture?: string; //imageId
  gmtCreate: Date;
  gmtModified: Date;
}

export interface UserQueryResult {
  userInfo: UserSummary;
  resultContext: ResultContext;
}
