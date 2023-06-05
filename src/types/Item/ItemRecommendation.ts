import { APIResultTemplate, ResultContext } from "../ResultContext";
import { ItemSummary } from "./ItemQuery";


// Result
export interface ItemRecommendationResult extends APIResultTemplate{
    items: ItemSummary[];
}