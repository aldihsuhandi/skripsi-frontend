import { ResultContext } from "../ResultContext";

//Utk spesification location nya
// export interface UpdateLocation {
//   province: string;
//   city: string;
//   postCode: string;
//   detail: string;
// }

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

  province?: string;
  city?: string;
  postCode?: string;
  detail?: string;

  isActive?: boolean;
  isDeleted?: boolean;
  canWhatsapp?: boolean;
  canTelegram?: boolean;
}

//REQUEST

/*
Di Headers: 
  - clientId
  - clientSecret
  - sessionId >> Mandatory
*/

export interface UpdateProfileRequest {
  profilePicture?: string;
  email?: string;
  username?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  oldPassword: string;
  password?: string;
  confirmPassword?: string;
  location?: {
    province?: string;
    city?: string;
    postCode?: string;
    detail?: string;
  };
  isActive?: boolean;
  isDeleted?: boolean;
  canWhatsapp?: boolean;
  canTelegram?: boolean;
}

// RESULT
export interface UpdateProfileResult {
  resultContext: ResultContext;
}
