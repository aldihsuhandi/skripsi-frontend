export const return0ifNan = (parsedNumber: number) => {
  if (isNaN(parsedNumber)) {
    return 0;
  }
  return parsedNumber;
};
