import React, { useCallback, useMemo } from "react";
import { drop, dropRight, last, first, reduce } from "lodash";
import { useOrders } from "containers/ApiProvider";
import OrderItem from "components/OrderItem/OrderItem";
import { OrdersMap } from "types";
import "./OrderBook.scss";

const ITEMS_TO_RENDER_PER_BOOK = 15;

const OrderBook = () => {
  const { bids, asks } = useOrders();

  const getOrdersToRender = useCallback(
    (orders: OrdersMap, getBottomItems = false) => {
      const prices = Object.keys(orders);

      const sortedPrices = prices.sort((a, b) => Number(b) - Number(a));

      const dropFunction = getBottomItems ? drop : dropRight;

      return dropFunction(
        sortedPrices,
        sortedPrices.length - ITEMS_TO_RENDER_PER_BOOK
      );
    },
    []
  );

  const asksToRender = useMemo(() => {
    return getOrdersToRender(asks, true);
  }, [getOrdersToRender, asks]);

  const bidsToRender = useMemo(() => {
    return getOrdersToRender(bids);
  }, [getOrdersToRender, bids]);

  const spread = useMemo(() => {
    const lastAskPrice = Number(last(asksToRender));
    const firstBidPrice = Number(first(bidsToRender));

    return Math.abs(lastAskPrice - firstBidPrice);
  }, [asksToRender, bidsToRender]);

  const getOrderTotals = useCallback(
    (priceList: number[] | string[], orders: OrdersMap) => {
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
    },
    []
  );

  const asksTotalMap = useMemo<Map<number, number>>(() => {
    return getOrderTotals([...asksToRender].reverse(), asks);
  }, [asksToRender, asks, getOrderTotals]);

  const bidsTotalMap = useMemo<Map<number, number>>(() => {
    return getOrderTotals(bidsToRender, bids);
  }, [bidsToRender, bids, getOrderTotals]);

  return (
    <div className="OrderBook">
      <div className="OrderBook_Container">
        {asksToRender.map((price) => {
          const parsedPrice = Number(price);
          const total = asksTotalMap.get(parsedPrice) || 0;
          const maxTotal = asksTotalMap.get(Number(first(asksToRender))) || 0;
          return (
            <OrderItem
              key={price}
              price={parsedPrice}
              size={asks[parsedPrice]}
              total={total}
              ratio={(total * 100) / maxTotal}
              ratioColor="red"
            />
          );
        })}
      </div>
      <div className="OrderBook_Actions">{`Spread: ${spread}`}</div>
      <div className="OrderBook_Container">
        {bidsToRender.map((price) => {
          const parsedPrice = Number(price);
          const total = bidsTotalMap.get(parsedPrice) || 0;
          const maxTotal = bidsTotalMap.get(Number(last(bidsToRender))) || 0;
          return (
            <OrderItem
              key={price}
              price={parsedPrice}
              size={bids[parsedPrice]}
              total={total}
              ratio={(total * 100) / maxTotal}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OrderBook;
