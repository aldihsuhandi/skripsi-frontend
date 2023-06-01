import { APIResultTemplate, ResultContext } from "../ResultContext";
import { UserSummary } from "../User";

// Request

/**
 * Di headers:
 *  clientId
 *  clientSecret
 *  sessionId      Not mandatory
 */

export interface ItemDetailRequest {
  itemId: string;
}

export interface ItemSummary {
  itemId: string;
  postId: string;
  itemName: string;
  /**
   * Kalo gk muat number, bigint
   */
  itemPrice: number;
  itemDescription: string;
  itemQuantity: number;
  itemCategory: string;
  hobby: string;
  merchantInfo: UserSummary;
  merchantLevel: string;
  itemImages: string[];
  inWishlist: boolean;
  gmtCreate: Date;
  gmtModified: Date;
}

export interface ItemDetailResult extends APIResultTemplate {
  item: ItemSummary;
}
