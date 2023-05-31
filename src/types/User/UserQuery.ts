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

export interface Location {
  province: string;
  city: string;
  postCode: string; //number --> string
  detail: string;
}

export interface UserSummary {
  email: string;
  phoneNumber: string;
  username: string;
  role: UserRole;
  profilePicture?: string; //imageId
  gender: string;
  dateOfBirth: string;
  location?: Location;
  gmtCreate: Date;
  gmtModified: Date;
}

export interface UserQueryResult {
  userInfo: UserSummary;
  resultContext: ResultContext;
}
