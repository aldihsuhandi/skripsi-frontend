import { CommentQuery } from "@/helper/Comment";
import { CommentQueryResult } from "@/types/Comment";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import styles from "../../styles/Paginate.module.css";
import { Comment } from "./Comment";
import { CommentCreateSection } from "./CommentCreateSection";
import { CommentReplySection } from "./CommentReplySection";
import { UserSummary } from "@/types/User";

export interface CommentSectionProps {
  postId: string;
  userData?: UserSummary;
}

export const CommentSection = ({ postId, userData }: CommentSectionProps) => {
  const [com, setCom] = useState<CommentQueryResult>();
  const [page, setPage] = useState(0);

  async function fetchComment() {
    const commentResult = await CommentQuery({
      replyTo: "POST",
      replyId: postId,
      pageNumber: 1,
      numberOfItem: 5,
    });

    if (commentResult && commentResult.resultContext.success) {
      setCom(commentResult);
    }
  }

  useEffect(() => {
    fetchComment();
  }, []);

  const handlePageClick = async (selectedPage: { selected: number }) => {
    const commentResult = await CommentQuery({
      replyTo: "POST",
      replyId: postId,
      pageNumber: selectedPage.selected + 1,
      numberOfItem: 5,
    });

    if (commentResult && commentResult.resultContext.success) {
      setCom(commentResult);
      setPage(selectedPage.selected);
    }
  };

  const onUpdateDelete = async () => {
    const commentResult = await CommentQuery({
      replyTo: "POST",
      replyId: postId,
      pageNumber: page + 1,
      numberOfItem: 5,
    });

    if (commentResult && commentResult.resultContext.success) {
      setCom(commentResult);
    }
  };

  return (
    <div className="max-w-[800px]">
      <h2 className="pt-4 text-lg lg:pt-2 lg:text-xl">Discussion</h2>
      {com &&
        com.comments.map((data) => {
          return (
            <div className="my-2 max-w-[800px] rounded border-4 border-solid border-bright-white">
              <Comment
                commentData={data}
                userData={userData}
                onDelete={onUpdateDelete}
                onEdit={onUpdateDelete}
              />
              <CommentReplySection
                commentId={data.commentId}
                userData={userData}
              />
            </div>
          );
        })}
      {com && com?.comments.length > 0 && (
        <ReactPaginate
          pageCount={com.pagingContext.totalPage}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          forcePage={0}
          nextLabel=">"
          previousLabel="<"
          breakLabel="..."
          containerClassName="flex list-none mb-2"
          pageLinkClassName={styles.pagelink_comments}
          activeClassName={styles.active}
          activeLinkClassName={styles.active}
          breakClassName={styles.pagelink_comments}
          previousLinkClassName={styles.pagelink_comments}
          nextLinkClassName={styles.pagelink_comments}
          disabledLinkClassName={styles.disabled}
          renderOnZeroPageCount={null}
        />
      )}
      <CommentCreateSection
        postId={postId}
        postTo="POST"
        onCreate={fetchComment}
      />
    </div>
  );
};
