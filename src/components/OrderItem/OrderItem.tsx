import React, { memo } from "react";
import "./OrderItem.scss";

interface OrderItemProps {
  price: number;
  size: number;
  total: number;
  ratio: number;
  ratioColor?: string;
}

const OrderItem: React.FC<OrderItemProps> = memo((props) => {
  const { price, size, total, ratio = 0, ratioColor = "green" } = props;
  return (
    <div data-testid="order-item" className="OrderItem">
      <div
        className="OrderItem_Ratio"
        style={{ width: `${ratio}%`, backgroundColor: ratioColor }}
      />
      <div className="OrderItem_Column">{price.toLocaleString()}</div>
      <div className="OrderItem_Column">{size.toLocaleString()}</div>
      <div className="OrderItem_Column">{total.toLocaleString()}</div>
    </div>
  );
});

export default OrderItem;
