// Parse number if not undefined

import { return0ifNan } from "./return0ifNan";

export const parseNumberUndefined = (inputNumber: string | undefined) => {
  if (inputNumber) {
    return return0ifNan(parseInt(inputNumber));
  }
  return undefined;
};
