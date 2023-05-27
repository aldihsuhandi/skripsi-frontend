export interface ResultContext {
  success: boolean;
  resultMsg: string;
  resultCode: string;
}

export interface APIResultTemplate {
  resultContext: ResultContext;
}
