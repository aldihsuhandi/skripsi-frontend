import { ItemFilterContext } from "./ItemFilterContext";

// Gw liat semua Request item body ini sama
export interface ItemQueryBody {
  itemFilterContext?: ItemFilterContext;
  pageNumber?: number;
  numberOfItem?: number;
}
