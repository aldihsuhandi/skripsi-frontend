import { CommentCreate } from "@/helper/Comment";
import { sanitize } from "dompurify";
import React, { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

export interface CommentCreateSectionProps {
  /**
   * The PostId returned alongside ItemId from QueryDetail
   */
  postId: string;
  postTo: "POST" | "COMMENT";
  onCreate: () => void;
}

export const CommentCreateSection = ({
  postId,
  postTo,
  onCreate,
}: CommentCreateSectionProps) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const unsanitized = event.target.value;
    const sanitazed_value = sanitize(unsanitized);
    setValue(sanitazed_value);
  };

  async function createComment() {
    if (value.length > 0) {
      const createResult = await CommentCreate({
        content: value,
        replyTo: postTo,
        replyId: postId,
      });
      if (createResult && createResult.resultContext.success) {
        onCreate();
        setValue("");
      }
    } else {
      toast.warning("The message cannot be empty!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "colored",
      });
    }
  }

  return (
    <div className="flex flex-col">
      <textarea
        id="message"
        rows={isFocused ? 3 : 1}
        className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        placeholder="Write your question here..."
        value={value}
        onChange={handleChange}
        onFocus={() => {
          setIsFocused(true);
        }}
        // onBlur={() => {
        //   setIsFocused(false);
        // }}
      />
      <button
        className="ml-auto mt-1 mr-1 rounded bg-normal-blue py-1 px-2 font-bold text-white hover:bg-blue-700"
        onClick={createComment}
      >
        Post
      </button>
    </div>
  );
};
