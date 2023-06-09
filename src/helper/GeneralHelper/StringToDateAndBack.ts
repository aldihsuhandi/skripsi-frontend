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

export function DateToFormattedString(dateStr: string) {
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return formattedDate;
}
