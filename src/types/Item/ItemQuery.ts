import { ItemQueryBody } from "./ItemQueryBody";

// NOTE: ntar item query yang lain headnya sama,
// tpi sessionId mandatory, soalnya logged in user doang yang bisa ada akses wishlist dkk
// Sooooo yeah maybe perlu bikin
export interface ItemQueryHeadHomePage {
  clientId: string;
  clientSecret: string;
  /**
   *  need to pass sessionId if user is login.
   *  can be null because home page can be accessed by non-logged-in users
   */
  sessionId?: string;
}

export interface ItemQueryRequest {
  head: ItemQueryHeadHomePage;
  body: ItemQueryBody;
}

//TODO: Tambah Item response (NOT HERE, pisah2 ke file biar lbh robust dan modular)
