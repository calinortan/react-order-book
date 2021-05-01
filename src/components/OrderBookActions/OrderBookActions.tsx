import React from "react";
import { isNil, isNaN } from "lodash";
import "./OrderBookActions.scss";

interface OrderBookActionsProps {
  spread: number;
  group: number;
  handleIncrease: () => void;
  handleDecrease: () => void;
  increaseDisabled?: boolean;
  decreaseDisabled?: boolean;
}
const OrderBookActions: React.FC<OrderBookActionsProps> = ({
  spread,
  group,
  handleIncrease,
  handleDecrease,
  increaseDisabled,
  decreaseDisabled,
}) => {
  if (isNaN(spread) || isNil(spread)) {
    return null;
  }
  return (
    <div className="OrderBookActions">
      <div data-testid="order-book-spread">{`Spread: ${spread}`}</div>
      <div data-testid="order-book-group">{`Group: ${group}`}</div>
      <div>
        <button
          data-testid="increase-group"
          className="OrderBookActions_GroupChanger"
          onClick={handleIncrease}
          disabled={increaseDisabled}
        >
          +
        </button>
        <button
          data-testid="decrease-group"
          className="OrderBookActions_GroupChanger"
          onClick={handleDecrease}
          disabled={decreaseDisabled}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default OrderBookActions;
