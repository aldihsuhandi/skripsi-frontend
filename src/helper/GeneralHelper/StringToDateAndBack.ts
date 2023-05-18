export function StringToDateAndBack(stringDate: string) {
  const date = new Date(stringDate);
  const dateFormat = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  } as const;
  const convertedStringDate = date.toLocaleDateString("en-US", dateFormat);

  return convertedStringDate;
}
