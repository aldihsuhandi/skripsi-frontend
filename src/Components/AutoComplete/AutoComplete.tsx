import classNames from "classnames";
import { sanitize } from "dompurify";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { ItemAutoCompleteRequest, ItemAutoCompleteResult } from "@/types";
import axios from "axios";
import Link from "next/link";
import { SearchBar, SearchBarProps } from "../SearchBar";

import { HighlightSuggestion } from "./HighlightSuggestion";
import { useRouter } from "next/router";

export type AutoCompleteProps = {
  autoCompleteOnChange?: (e: ChangeEvent<HTMLInputElement>) => void;
} & Omit<SearchBarProps, "onChange" | "value">;

export const AutoComplete = ({
  autoCompleteOnChange,
  ...props
}: AutoCompleteProps) => {
  // Uat redirect pas enter
  const router = useRouter();
  // HANDLE CLICK DILUAR COMPONENT
  // ref uat deteksi klik diluar component
  const ref = useRef<HTMLDivElement>(null);
  // hook state uat kasih tau open/close
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);

  // DATA
  const [inputValue, setInputValue] = useState("");
  // maybe uat ini taro interface/type return dari API
  const [autoCompleteSuggestion, setAutoCompleteSuggestion] = useState<
    ItemAutoCompleteResult | undefined
  >();
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  useEffect(() => {
    // Add event listener for clicks on the document
    document.addEventListener("click", handleClickOutside);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function handleClickOutside(event: MouseEvent) {
    // Deteksi klik diluar Component
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsSearchBarFocused(false);
    }
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // TODO: SANITIZE DULU mungkin
    const unsanitized = event.target.value;
    const value = sanitize(unsanitized);
    setInputValue(value);
    setAutoCompleteSuggestion(undefined);
    if (value.length >= 3) {
      setShowAutoComplete(true);
      const PostBody: ItemAutoCompleteRequest = {
        head: {
          clientId: "dbf0201e-23a0-446b-8db3-40b1b6ed7c1f",
          clientSecret: "dycvervbrngjwhryugwduo",
        },
        body: {
          autocomplete: value,
        },
      };
      const autoCompleteResult = await axios.post(
        "http://localhost:8080/item/autocomplete",
        JSON.stringify(PostBody),
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Type": "application/json",
          },
        }
      );

      setAutoCompleteSuggestion(await autoCompleteResult.data);
    } else {
      setShowAutoComplete(false);
    }

    if (autoCompleteOnChange) {
      autoCompleteOnChange(event);
    }
  };

  const handleEnter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router
      .push({
        pathname: `/search`,
        query: { q: inputValue },
      })
      .then(() => setShowAutoComplete(false));
  };

  return (
    <div className="relative w-full" ref={ref}>
      <form onSubmit={handleEnter}>
        <SearchBar
          onChange={handleChange}
          value={inputValue}
          autoComplete="off"
          onFocus={() => {
            if (!isSearchBarFocused) {
              setIsSearchBarFocused(true);
            }
          }}
          {...props}
        />
      </form>
      <div
        className={classNames(
          "absolute flex w-full flex-col rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500",
          { block: showAutoComplete && isSearchBarFocused },
          { hidden: !showAutoComplete || !isSearchBarFocused }
        )}
      >
        {autoCompleteSuggestion ? (
          autoCompleteSuggestion.itemName.length !== 0 ? (
            autoCompleteSuggestion.itemName.map((link) => (
              <Link
                key={link}
                href={{
                  pathname: `/search`,
                  query: { q: link },
                }}
                onClick={() => {
                  setShowAutoComplete(false);
                  setInputValue(link);
                }}
                className="p-2"
              >
                <HighlightSuggestion
                  wholeString={link}
                  subString={inputValue}
                />
              </Link>
            ))
          ) : (
            <p className="p-2">No Suggestion Found</p>
          )
        ) : (
          <p className="p-2">Loading...</p>
        )}
      </div>
    </div>
  );
};
