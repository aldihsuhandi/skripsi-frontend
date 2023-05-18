import { ResultContext } from "../ResultContext";

// Form values
export interface RegisterFormValues {
  /**
   * File because it needs validation in the FE, will be converted to blob
   * and sent to the api
   */
  profilePicture?: File;
  email: string;
  username: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}

// Request

/**
 * Di headers:
 *  clientId
 *  clientSecret
 */

export interface RegisterRequest {
  email: string;
  username: string;
  phoneNumber: string;
  profilePicture?: File;
  // profilePicture?: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}

// export interface RegisterRequest {
//   body: FormData;
//   // body: RegisterRequestBody;
// }

// Result
export interface RegisterResult {
  resultContext: ResultContext;
}
