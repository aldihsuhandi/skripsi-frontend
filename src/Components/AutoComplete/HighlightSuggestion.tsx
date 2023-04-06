export interface HighlightSuggestionProps {
  wholeString: string;
  subString: string;
}

// COULD BE MOVED jadi lebih general
// Or pindahin ke tempat lain klo ternyata
// dipke di tempat selain Searchbar + Autocomplete combo
export const HighlightSuggestion = ({
  wholeString,
  subString,
}: HighlightSuggestionProps) => {
  const duplicatedWholeString = wholeString.toLocaleLowerCase();
  const duplicatedSubString = subString.toLocaleLowerCase();

  const subStringLocation = duplicatedWholeString.indexOf(duplicatedSubString);

  const isEndOfString = !Boolean(
    wholeString.length - (subStringLocation + duplicatedSubString.length)
  );

  const subString_bener = wholeString.substring(
    subStringLocation,
    subStringLocation + duplicatedSubString.length
  );
  const splitted = wholeString.split(subString_bener);

  return (
    <span>
      {subStringLocation === 0 && <b>{subString_bener}</b>}
      {splitted[0]}
      {subStringLocation > 0 && !isEndOfString && <b>{subString_bener}</b>}
      {splitted[1]}
      {isEndOfString && <b>{subString_bener}</b>}
    </span>
  );
};
