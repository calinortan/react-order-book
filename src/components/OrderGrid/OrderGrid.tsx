import React, { memo, useMemo } from "react";
import { drop, dropRight, last, first, reduce } from "lodash";
import OrderItem from "components/OrderItem";
import { OrdersMap } from "types";
import "./OrderGrid.scss";

export enum OrderType {
  Bid = "Bid",
  Ask = "Ask",
}
interface OrderGridProps {
  type: OrderType;
  orders: OrdersMap;
}

const ITEMS_TO_RENDER_PER_BOOK = 15;

const OrderGrid: React.FC<OrderGridProps> = memo(({ type, orders }) => {
  const ordersToRender = useMemo(() => {
    const prices = Object.keys(orders);

    const sortedPrices = prices.sort((a, b) => Number(b) - Number(a));

    const dropFunction = type === OrderType.Ask ? drop : dropRight;

    return dropFunction(
      sortedPrices,
      sortedPrices.length - ITEMS_TO_RENDER_PER_BOOK
    );
  }, [type, orders]);

  const ordersTotalMap = useMemo(() => {
    const priceList =
      type === OrderType.Ask ? [...ordersToRender].reverse() : ordersToRender;
    return reduce(
      priceList,
      (acc, current, index, ordersList) => {
        const previousPrice: number = Number(ordersList[Number(index) - 1]);
        const previousTotal: number = acc.get(previousPrice) || 0;
        acc.set(Number(current), previousTotal + orders[Number(current)]);

        return acc;
      },
      new Map()
    );
  }, [type, ordersToRender, orders]);

  return (
    <div className="OrderGrid">
      {ordersToRender.map((price) => {
        const parsedPrice = Number(price);
        const total = ordersTotalMap.get(parsedPrice) || 0;

        const maxTotalSelector = type === OrderType.Ask ? first : last;

        const maxTotal = ordersTotalMap.get(
          Number(maxTotalSelector(ordersToRender))
        );

        const ratioColor = type === OrderType.Ask ? "red" : "green";

        return (
          <OrderItem
            key={price}
            price={parsedPrice}
            size={orders[parsedPrice]}
            total={total}
            ratio={(total * 100) / maxTotal}
            ratioColor={ratioColor}
          />
        );
      })}
    </div>
  );
});

export default OrderGrid;
