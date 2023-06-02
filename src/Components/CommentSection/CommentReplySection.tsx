import { CommentQuery } from "@/helper/Comment";
import { CommentSummary } from "@/types/Comment";
import React, { useEffect, useState } from "react";
import { Comment } from "./Comment";
import { CommentCreateSection } from "./CommentCreateSection";
import { UserSummary } from "@/types/User";

export interface CommentReplySectionProps {
  commentId: string;
  userData?: UserSummary;
}

export const CommentReplySection = ({
  commentId,
  userData,
}: CommentReplySectionProps) => {
  const [commentReplies, setCommentReplies] = useState<CommentSummary[]>([]);
  const [commentRepliesShown, setCommentRepliesShown] = useState<
    CommentSummary[]
  >([]);
  const [showMoreButton, setShowMoreButton] = useState(true);
  const [replyIndex, setReplyIndex] = useState(1);

  async function getReplies() {
    const commentReplies = await CommentQuery({
      replyTo: "COMMENT",
      replyId: commentId,
      pageNumber: 1,
      numberOfItem: 100,
    });

    if (commentReplies && commentReplies.resultContext.success) {
      setReplyIndex(1);
      setCommentReplies(commentReplies.comments);
      setCommentRepliesShown([]);
      if (commentReplies.comments.length > 0) {
        setCommentRepliesShown(
          commentRepliesShown.concat(commentReplies.comments[0])
        );
      }
    }
  }

  async function reFetchComments() {
    const commentRepliesReFetch = await CommentQuery({
      replyTo: "COMMENT",
      replyId: commentId,
      pageNumber: 1,
      numberOfItem: 100,
    });

    if (commentRepliesReFetch && commentRepliesReFetch.resultContext.success) {
      setCommentReplies(commentRepliesReFetch.comments);
      setCommentRepliesShown(
        commentRepliesReFetch.comments.slice(0, replyIndex)
      );
    }
  }

  useEffect(() => {
    getReplies();
  }, [commentId]);

  return (
    <div className="bg-slate-300 p-0 lg:pl-8">
      {commentRepliesShown.map((data) => {
        if (data) {
          return (
            <Comment
              commentData={data}
              userData={userData}
              onDelete={reFetchComments}
              onEdit={reFetchComments}
            />
          );
        }
      })}
      {replyIndex < commentReplies.length && showMoreButton && (
        <div
          className="cursor-pointer pl-3 pb-2"
          onClick={() => {
            setCommentRepliesShown(
              commentRepliesShown.concat(
                commentReplies.slice(replyIndex, replyIndex + 4)
              )
            );
            setReplyIndex(replyIndex + 4);
          }}
        >
          Load more
        </div>
      )}
      <div className="p-2 pl-0">
        <CommentCreateSection
          postId={commentId}
          postTo="COMMENT"
          onCreate={reFetchComments}
        />
      </div>
    </div>
  );
};
