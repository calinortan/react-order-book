import React, { createContext, useContext } from "react";
import { throttle } from "lodash";
import { OrdersMap, OrderBookMessage } from "types";

const WS_URL = "wss://www.cryptofacilities.com/ws/v1";
const SUBSCRIBE_MESSAGE =
  '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}';

interface ApiProviderState {
  bids: OrdersMap;
  asks: OrdersMap;
  connecting: boolean;
  error: string;
}

const apiInitialState = {
  bids: {} as OrdersMap,
  asks: {} as OrdersMap,
  connecting: true,
  error: "",
};

const ApiProviderContext = createContext<ApiProviderState>(apiInitialState);

const ORDER_BOOK_UPDATE_DELAY = 200;

class ApiProvider extends React.Component<{}, ApiProviderState> {
  wsConnection = new WebSocket(WS_URL);
  /**
   * Used to capture all new bids without having to rerender the component.
   */
  latestBids: OrdersMap = {};
  /**
   * Used to capture all new asks without having to rerender the component.
   */
  latestAsks: OrdersMap = {};

  state = apiInitialState;

  setBids = (newBids: OrdersMap) => {
    this.setState({ bids: newBids });
  };

  setAsks = (newAsks: OrdersMap) => {
    this.setState({ asks: newAsks });
  };

  /**
   * Throttled wrapper over setBids. Allows control on how often rerender should happen.
   */
  throttledSetBids = throttle(this.setBids, ORDER_BOOK_UPDATE_DELAY);

  /**
   * Throttled wrapper over setAsks. Allows control on how often rerender should happen.
   */
  throttledSetAsks = throttle(this.setAsks, ORDER_BOOK_UPDATE_DELAY);

  /**
   * Updates both latestBids and bids to render state.
   * @param newOrdersMap - new bids map to set
   */
  setNewBids = (newOrdersMap: OrdersMap) => {
    this.latestBids = newOrdersMap;
    this.throttledSetBids(this.latestBids);
  };

  /**
   * Updates both latestBids and bids to render state.
   * @param newOrdersMap - new bids map to set
   */
  setNewAsks = (newOrdersMap: OrdersMap) => {
    this.latestAsks = newOrdersMap;
    this.throttledSetAsks(this.latestAsks);
  };

  createNewOrders = (
    newOrders: [number, number][],
    initialOrders: OrdersMap
  ) => {
    return newOrders.reduce(
      (acc, current) => {
        const [price, amount] = current;

        if (amount === 0) {
          delete acc[price];
        }

        if (amount > 0) {
          acc[price] = amount;
        }

        return acc;
      },
      { ...initialOrders }
    );
  };

  handleNewBids = (newBids: [number, number][]) => {
    const newOrdersMap = this.createNewOrders(newBids, this.latestBids);

    this.setNewBids(newOrdersMap);
  };

  handleNewAsks = (newAsks: [number, number][]) => {
    const newOrdersMap = this.createNewOrders(newAsks, this.latestAsks);

    this.setNewAsks(newOrdersMap);
  };

  handleWsOpen = (event: Event) => {
    this.setState({ connecting: false });
    this.wsConnection.send(SUBSCRIBE_MESSAGE);
    this.wsConnection.onmessage = (event: MessageEvent<string>) => {
      try {
        const message: OrderBookMessage = JSON.parse(event.data);

        this.handleNewBids(message?.bids ?? []);
        this.handleNewAsks(message?.asks ?? []);
      } catch (error) {
        this.setState({ error: error.message });
      }
    };
  };

  handleWsError = (event: Event) => {
    this.setState({ error: "Connection failed", connecting: false });
  };

  componentDidMount() {
    this.wsConnection.onopen = this.handleWsOpen;
    this.wsConnection.onerror = this.handleWsError;
  }

  componentWillUnmount() {
    this.throttledSetBids.cancel();
  }

  render() {
    const { children } = this.props;

    return (
      <ApiProviderContext.Provider value={this.state}>
        {children}
      </ApiProviderContext.Provider>
    );
  }
}

export const useOrders = () => {
  return useContext(ApiProviderContext);
};

export default ApiProvider;
