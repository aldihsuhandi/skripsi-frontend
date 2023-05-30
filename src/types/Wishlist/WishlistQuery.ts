import { ResultContext } from "../ResultContext";
import { UserSummary } from "../User";

// Request

/**
 * Di headers:
 *  clientId
 *  clientSecret
 *  sessionId      Mandatory
 */

export interface WishlistFilterContext {
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

export interface WishlistQueryRequest {
  /**
   * default === 1
   */
  pageNumber?: number;
  /**
   * default === 10
   */
  numberOfItem?: number;
  itemFilterContext?: WishlistFilterContext;
}

export interface WishlistPagingContext {
  pageNumber: number;
  numberOfItem: number;
  hasNext: boolean;
  /**
   * Kalo gk muat number, bigint
   */
  totalItem: number;
  totalPage: number;
}

export interface WishlistSummary {
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
  inWishlist: boolean;
  gmtCreate: Date;
  gmtModified: Date;
}

export interface WishlistQueryResult {
  resultContext: ResultContext;
  pagingContext: WishlistPagingContext;
  wishlistItems: WishlistSummary[];
}
