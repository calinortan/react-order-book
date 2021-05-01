import React, { useState } from "react";
import Loader from "react-loader-spinner";
import { useOrders } from "containers/ApiProvider";
import OrderGrid, { OrderType } from "components/OrderGrid";
import OrderBookActions from "components/OrderBookActions";
import "./OrderBook.scss";

const GROUP_OPTIONS = [0.5, 1, 5, 10, 25, 50];
const OrderBook = () => {
  const [groupIndex, setGroupIndex] = useState(0);
  const { bids, asks, spread, connecting, error } = useOrders(
    GROUP_OPTIONS[groupIndex]
  );

  const handleIncreaseGroup = () => {
    if (groupIndex < GROUP_OPTIONS.length - 1) {
      setGroupIndex(groupIndex + 1);
    }
  };

  const handleDecreaseGroup = () => {
    if (groupIndex > 0) {
      setGroupIndex(groupIndex - 1);
    }
  };

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
        <OrderBookActions
          spread={spread}
          group={GROUP_OPTIONS[groupIndex]}
          handleDecrease={handleDecreaseGroup}
          decreaseDisabled={groupIndex === 0}
          handleIncrease={handleIncreaseGroup}
          increaseDisabled={groupIndex === GROUP_OPTIONS.length - 1}
        />
        <OrderGrid type={OrderType.Bid} orders={bids} />
      </>
    );
  };

  return <div className="OrderBook">{renderContent()}</div>;
};

export default OrderBook;
