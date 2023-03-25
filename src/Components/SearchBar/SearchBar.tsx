import React, { InputHTMLAttributes, ReactNode } from "react";
import { SearchIcon } from "../Icons";

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
}

export const SearchBar = ({ label, ...props }: SearchBarProps) => {
  return (
    <div className="w-full py-1">
      {label}
      <div className="flex">
        <input
          type="text"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          {...props}
        />
        <div className="ml-2 rounded-lg bg-normal-magenta p-2">
          <SearchIcon htmlColor="#FFFFFF" />
        </div>
      </div>
    </div>
  );
};

// Example of a Label

{
  /* 
<label
  htmlFor="first_name"
  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
>
  First name
</label> 
*/
}
