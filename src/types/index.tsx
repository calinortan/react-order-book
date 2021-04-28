export interface OrderBookMessage {
  feed: string;
  product_id: string;
  asks: [number, number][];
  bids: [number, number][];
}

export interface OrdersMap {
  [price: number]: number;
}
