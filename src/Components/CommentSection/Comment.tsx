import { ImageDownload, ProcessImgBE, WishlistRemove } from "@/helper";
import { CommentSummary } from "@/types/Comment";
import { useEffect, useState } from "react";
import { Avatar } from "../Avatar";
import { HiPencil } from "react-icons/hi2";
import { HiTrash } from "react-icons/hi";
import { UserSummary } from "@/types/User";
import { DialogConfrim } from "../DialogConfirm";
import { CommentDelete } from "@/helper/Comment";
import { CommentEditSection } from "./CommentEditSection";

export interface CommentProps {
  commentData: CommentSummary;
  userData?: UserSummary;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const Comment = ({
  commentData,
  userData,
  onDelete,
  onEdit,
}: CommentProps) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    async function getMerchantImage() {
      if (commentData.commenter.profilePicture) {
        const imgUsable = await ImageDownload({
          imageId: commentData.commenter.profilePicture,
        });

        const imgUrl = await ProcessImgBE(imgUsable?.data);

        setImage(imgUrl);
      } else {
        setImage(undefined);
      }
    }
    getMerchantImage();

    if (image) {
      return () => {
        URL.revokeObjectURL(image);
      };
    }
  }, [commentData]);

  const UpdateEditingStatus = (changeEditing: boolean) => {
    setIsEditing(changeEditing);
  };

  const EmptyFunction = () => {};

  return (
    <div>
      <div className="flex flex-row items-center p-3">
        {/* Avatar */}
        <Avatar
          src={image}
          alt="commentUserPP"
          rounded
          style={{ height: 40, width: 40 }}
        />
        <div className="flex w-full flex-col px-3">
          <h3 className="text-base font-bold">
            {commentData.commenter.username}
          </h3>
          {isEditing ? (
            <CommentEditSection
              commentId={commentData.commentId}
              contentBefore={commentData.content}
              onCancel={UpdateEditingStatus}
              onEdit={onEdit ? onEdit : EmptyFunction}
            />
          ) : (
            <div>{commentData.content}</div>
          )}
        </div>
        {userData && userData.email === commentData.commenter.email && (
          <div className="ml-auto flex self-start">
            <button className="pr-2" onClick={() => setIsEditing(!isEditing)}>
              <HiPencil size={16} />
            </button>
            <DialogConfrim
              trigger={
                <button onClick={(e) => e.preventDefault()}>
                  <HiTrash size={16} />
                </button>
              }
              title="Are you sure you want to delete this comment?"
              onConfirm={async () => {
                const deleteResult = await CommentDelete({
                  commentId: commentData.commentId,
                });
                if (deleteResult && deleteResult.resultContext.success) {
                  onDelete && onDelete();
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
