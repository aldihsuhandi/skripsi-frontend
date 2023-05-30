import { ResultContext } from "../ResultContext";

//Utk spesification location nya
export interface Location {
  province: string;
  city: string;
  postCode: number;
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
  location?: Location;
  isActive?: boolean;
  isDeleted?: boolean;
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
  location?: Location;
  isActive?: boolean;
  isDeleted?: boolean;
}

// RESULT
export interface UpdateProfileResult {
  resultContext: ResultContext;
}
