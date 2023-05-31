import { ResultContext } from "../ResultContext";

//Utk spesification location nya
export interface UpdateLocation {
  province: string;
  city: string;
  postCode: string;
  detail: string;
}

// Form Values
export interface UpdateProfileFormValues {
  profilePicture?: File;
  email?: string;
  username?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  oldPassword: string;
  password?: string;
  confirmPassword?: string;
  location?: UpdateLocation;
  // isActive?: boolean;
  // isDeleted?: boolean;
}

//REQUEST

/*
Di Headers: 
  - clientId
  - clientSecret
  - sessionId >> Mandatory
*/

export interface UpdateProfileRequest {
  profilePicture?: File;
  email?: string;
  username?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  oldPassword: string;
  password?: string;
  confirmPassword?: string;
  location?: UpdateLocation;
  isActive?: boolean;
  isDeleted?: boolean;
}

// RESULT
export interface UpdateProfileResult {
  resultContext: ResultContext;
}
