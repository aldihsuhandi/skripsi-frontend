import { ResultContext } from "../ResultContext";
import { ItemSummary } from "./ItemQuery";


// Result
export interface ItemRecommendationResult {
    resultContext: ResultContext;
    items: ItemSummary[];
}