import { CommentCreate, CommentEdit } from "@/helper/Comment";
import { sanitize } from "dompurify";
import React, { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface CommentCreateSectionProps {
  commentId: string;
  contentBefore: string;
  onEdit: () => void;
  onCancel: (changeEditing: boolean) => void;
}

export const CommentEditSection = ({
  commentId,
  contentBefore,
  onEdit,
  onCancel,
}: CommentCreateSectionProps) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(contentBefore);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const unsanitized = event.target.value;
    const sanitazed_value = sanitize(unsanitized);
    setValue(sanitazed_value);
  };

  async function updateComment() {
    if (value.length > 0) {
      const createResult = await CommentEdit({
        content: value,
        commentId: commentId,
      });
      if (createResult && createResult.resultContext.success) {
        onEdit();
        setValue("");
        handleUpdated();
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

  const handleCancel = () => {
    onCancel(false);
  };

  const handleUpdated = () => {
    onCancel(false);
  };

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
      />
      <div className="flex flex-row">
        <button
          className="ml-auto mt-1 mr-1 rounded bg-normal-red py-1 px-2 font-bold text-white hover:bg-red-700"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="mt-1 mr-1 rounded bg-normal-blue py-1 px-2 font-bold text-white hover:bg-blue-700"
          onClick={updateComment}
        >
          Update
        </button>
      </div>
    </div>
  );
};
