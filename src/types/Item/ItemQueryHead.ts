// Note:    variant used in `ItemQuery.ts` is not using this one because in homepage the user
//          DOES NO need to be logged in to view
export interface ItemQueryHead {
  clientId: string;
  clientSecret: string;
  sessionId?: string;
}
