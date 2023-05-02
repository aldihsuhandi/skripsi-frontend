import { ResultContext } from "./ResultContext";

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

export interface EncryptEmailResult {
  resultContext: ResultContext;
  uuid: string;
}

// Decrypt
export interface DecryptEmailRequestBody {
  uuid: string;
}

export interface DecryptEmailResult {
  resultContext: ResultContext;
  email: string;
}
