import { render, screen } from "@testing-library/react";
import OrderBookGrid from ".";
import { OrderType } from "./OrderGrid";

describe("OrderBookGrid", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockOrders = {
    55100: 100,
    55200: 100,
    55300: 100,
    55400: 100,
    55500: 100,
    55600: 100,
    55700: 100,
    55800: 100,
    55900: 100,
    56000: 100,
    56100: 100,
    56200: 100,
    56300: 100,
    56400: 100,
    56500: 100,
    56600: 100,
    56700: 100,
  };

  it("should render asks", () => {
    render(<OrderBookGrid type={OrderType.Ask} orders={mockOrders} />);

    const orderItems = screen.getAllByTestId("order-item");

    expect(orderItems).toHaveLength(15);
  });

  it("should bottom 15 asks by price", () => {
    render(<OrderBookGrid type={OrderType.Ask} orders={mockOrders} />);

    const orderItems = screen.getAllByTestId("order-item");

    expect(orderItems).toHaveLength(15);
    expect(orderItems[0].textContent).toEqual("56,5001001,500"); // 56,500 (price)/ 100 (amount) / 1,500 total
    expect(orderItems[14].textContent).toEqual("55,100100100"); // 55,100 (price)/ 100 (amount) / 100 total
  });

  it("should render bids", () => {
    render(<OrderBookGrid type={OrderType.Bid} orders={mockOrders} />);

    const orderItems = screen.getAllByTestId("order-item");

    expect(orderItems).toHaveLength(15);
  });

  it("should top 15 bids by price", () => {
    render(<OrderBookGrid type={OrderType.Bid} orders={mockOrders} />);

    const orderItems = screen.getAllByTestId("order-item");

    expect(orderItems).toHaveLength(15);
    expect(orderItems[0].textContent).toEqual("56,700100100"); // 56,700 (price)/ 100 (amount) / 100 total
    expect(orderItems[14].textContent).toEqual("55,3001001,500"); // 55,300 (price)/ 100 (amount) / 1,500 total
  });
});
