import { APIResultTemplate, ResultContext } from "../ResultContext";
import { UserSummary } from "../User";

// Request

/**
 * Di headers:
 *  clientId
 *  clientSecret
 *  sessionId      Not mandatory
 */

export interface ItemFilterContext {
  itemId?: string;
  itemName?: string;
  minItemPrice?: number;
  maxItemPrice?: number;
  merchantEmail?: string;
  merchantInterestLevel?: string;
  userInterestLevel?: string;
  hobby?: string;
  itemCategory?: string;
}

export interface ItemQueryRequest {
  /**
   * default === 1
   */
  pageNumber?: number;
  /**
   * default === 10
   */
  numberOfItem?: number;
  itemFilterContext?: ItemFilterContext;
}

export interface PagingContext {
  pageNumber: number;
  numberOfItem: number;
  hasNext: boolean;
  /**
   * Kalo gk muat number, bigint
   */
  totalItem?: number;
  totalPage: number;
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
  userLevel: string;
  itemImages: string[];
  inWishlist: boolean;
  review: number;
  gmtCreate: Date;
  gmtModified: Date;
}

export interface HistoryItemSummary {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemDescription: string;
  itemCategory: string;
  hobby: string;
  merchantInfo: UserSummary;
  merchantLevel: string;
  userLevel: string;
  itemImages: string[];
  gmtCreate: Date;
  gmtModified: Date;
}

export interface ItemQueryResult extends APIResultTemplate {
  pagingContext: PagingContext;
  items: ItemSummary[];
}
