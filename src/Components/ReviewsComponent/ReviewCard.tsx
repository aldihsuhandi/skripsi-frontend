import { ItemQuery } from "@/helper";
import { CLIENT_ID, CLIENT_SECRET, ItemSummary } from "@/types";
import { ReviewSummary } from "@/types/Reviews";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes, useEffect, useState } from "react";

export interface ReviewCardProps extends HTMLAttributes<HTMLDivElement> {
  reviewData: ReviewSummary;
}

export const ReviewCard = ({ reviewData }: ReviewCardProps) => {
  const router = useRouter();
  const [itemInfo, setItemInfo] = useState<ItemSummary | undefined>(undefined);
  const [hasReviewed, setHasReviewed] = useState<boolean>(
    reviewData.needReview
  );

  useEffect(() => {
    async function getItemInfo() {
      const itemInfo = await ItemQuery({
        itemId: reviewData.itemId,
      });
    }
  });

  return (
    <div className="flex flex-col p-2">
      <div className=""></div>
    </div>
  );
};
