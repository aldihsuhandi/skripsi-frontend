import { APIResultTemplate, ResultContext } from "./ResultContext";

// Request Headers sama
/**
 * Di Headers:
 *  clientId
 *  clientSecret
 */

// Encrypt
export interface EncryptEmailRequestBody {
  email: string;
}

export interface EncryptEmailResult extends APIResultTemplate {
  uuid: string;
}

// Decrypt
export interface DecryptEmailRequestBody {
  uuid: string;
}

export interface DecryptEmailResult extends APIResultTemplate {
  email: string;
}
