import classNames from "classnames";
import { sanitize } from "dompurify";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import {
  CLIENT_ID,
  CLIENT_SECRET,
  ItemAutoCompleteRequest,
  ItemAutoCompleteResult,
} from "@/types";
import axios from "axios";
import Link from "next/link";
import { SearchBar, SearchBarProps } from "../SearchBar";

import { useRouter } from "next/router";
import { HighlightSuggestion } from "./HighlightSuggestion";
import { urlFirstString } from "@/helper";

export type AutoCompleteProps = {
  autoCompleteOnChange?: (e: ChangeEvent<HTMLInputElement>) => void;
} & Omit<SearchBarProps, "onChange" | "value">;

export const AutoComplete = ({
  autoCompleteOnChange,
  ...props
}: AutoCompleteProps) => {
  // Uat redirect pas enter
  const router = useRouter();
  const { q } = router.query;
  // HANDLE CLICK DILUAR COMPONENT
  // ref uat deteksi klik diluar component
  const ref = useRef<HTMLDivElement>(null);
  // hook state uat kasih tau open/close
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);

  // DATA
  const [error, setError] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState("");
  // maybe uat ini taro interface/type return dari API
  const [autoCompleteSuggestion, setAutoCompleteSuggestion] = useState<
    string[] | undefined
  >();

  const [showAutoComplete, setShowAutoComplete] = useState(false);

  useEffect(() => {
    // Add event listener for clicks on the document
    document.addEventListener("click", handleClickOutside);
    if (router.isReady) {
      setInputValue(urlFirstString(q) ?? "");
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [router.isReady]);

  function handleClickOutside(event: MouseEvent) {
    // Deteksi klik diluar Component
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsSearchBarFocused(false);
    }
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const unsanitized = event.target.value;
    const value = sanitize(unsanitized);
    setInputValue(value);
    setAutoCompleteSuggestion(undefined);
    if (value.length >= 3) {
      setShowAutoComplete(true);
      const PostBody: ItemAutoCompleteRequest = {
        autocomplete: value,
      };

      const { data } = await axios.post<ItemAutoCompleteResult>(
        "http://localhost:8080/item/autocomplete",
        JSON.stringify(PostBody),
        {
          headers: {
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            "Content-Type": "application/json",
            "Accept-Type": "application/json",
          },
        }
      );

      if (data.resultContext.success) {
        setAutoCompleteSuggestion(data.itemName);
      } else {
        // TODO: CREATE YANG LBH CAKEP DRI INI
        AlertPlaceholder(data.resultContext);
        setError(data.resultContext.resultCode);
      }
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

  // pisah sini biar bisa pake if else
  const AutoCompletePart = ({
    suggestion,
  }: {
    suggestion: string[] | undefined;
  }) => {
    if (suggestion && suggestion.length !== 0) {
      return suggestion.map((link) => (
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
          <HighlightSuggestion wholeString={link} subString={inputValue} />
        </Link>
      ));
    } else if (suggestion && suggestion.length === 0) {
      return <p className="p-2">No Suggestion Found</p>;
    } else {
      return <p className="p-2">Loading...</p>;
    }
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
          "absolute flex w-full flex-col overflow-auto rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500",
          { block: showAutoComplete && isSearchBarFocused },
          { hidden: !showAutoComplete || !isSearchBarFocused }
        )}
        style={{ maxHeight: "50vh" }}
      >
        {!error ? (
          AutoCompletePart({ suggestion: autoCompleteSuggestion })
        ) : (
          <p className="p-2">An Error Occured...</p>
        )}
      </div>
    </div>
  );
};

const AlertPlaceholder = (error: ItemAutoCompleteResult["resultContext"]) => {
  alert(`${error.resultMsg}`);
};
