import { ResultContext } from "../ResultContext";
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
  gmtCreate: Date;
  gmtModified: Date;
}

export interface ItemDetailResult {
  resultContext: ResultContext;
  item: ItemSummary;
}
