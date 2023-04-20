// This is to handle if it is string[]
// return the first in the array of url
// if undefined, then return undefined

export const urlFirstString = (inputString: string | string[] | undefined) => {
  if (Array.isArray(inputString)) {
    // the input is array
    return inputString[0];
  }
  return inputString;
};
