import React, { useMemo } from "react";
import { keys, max, min } from "lodash";
import { useOrders } from "containers/ApiProvider";
import OrderGrid, { OrderType } from "components/OrderGrid";
import "./OrderBook.scss";

const OrderBook = () => {
  const { bids, asks } = useOrders();

  const spread = useMemo(() => {
    const lastAskPrice = Number(min(keys(asks)));
    const firstBidPrice = Number(max(keys(bids)));

    return Math.abs(lastAskPrice - firstBidPrice);
  }, [asks, bids]);

  return (
    <div className="OrderBook">
      <OrderGrid type={OrderType.Ask} orders={asks} />

      <div className="OrderBook_Actions">{`Spread: ${spread}`}</div>
      <OrderGrid type={OrderType.Bid} orders={bids} />
    </div>
  );
};

export default OrderBook;
