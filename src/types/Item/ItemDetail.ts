import { APIResultTemplate, ResultContext } from "../ResultContext";
import { UserSummary } from "../User";
import { ItemSummary } from "./ItemQuery";

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

export interface ItemDetailResult extends APIResultTemplate {
  item: ItemSummary;
}
