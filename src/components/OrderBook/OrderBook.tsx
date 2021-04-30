import React, { useMemo } from "react";
import { keys, max, min } from "lodash";
import Loader from "react-loader-spinner";
import { useOrders } from "containers/ApiProvider";
import OrderGrid, { OrderType } from "components/OrderGrid";
import "./OrderBook.scss";

const OrderBook = () => {
  const { bids, asks, connecting, error } = useOrders();

  const spread = useMemo(() => {
    const lastAskPrice = Number(min(keys(asks)));
    const firstBidPrice = Number(max(keys(bids)));

    return Math.abs(lastAskPrice - firstBidPrice);
  }, [asks, bids]);

  const renderContent = () => {
    if (error) {
      return <span>{error}</span>;
    }
    if (connecting) {
      return (
        <Loader type={"MutatingDots"} color="teal" secondaryColor="teal" />
      );
    }

    return (
      <>
        <OrderGrid type={OrderType.Ask} orders={asks} />
        {!isNaN(spread) && (
          <div className="OrderBook_Actions">{`Spread: ${spread}`}</div>
        )}
        <OrderGrid type={OrderType.Bid} orders={bids} />
      </>
    );
  };

  return <div className="OrderBook">{renderContent()}</div>;
};

export default OrderBook;
