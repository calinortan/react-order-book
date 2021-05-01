import { fireEvent, render, screen } from "@testing-library/react";
import OrderBookActions from ".";

describe("OrderBookActions", () => {
  const increaseSpy = jest.fn();
  const decreaseSpy = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render", () => {
    render(
      <OrderBookActions
        spread={15}
        group={10}
        handleDecrease={decreaseSpy}
        handleIncrease={increaseSpy}
      />
    );

    const spread = screen.getByTestId("order-book-spread");
    const group = screen.getByTestId("order-book-group");

    expect(spread.textContent).toEqual("Spread: 15");
    expect(group.textContent).toEqual("Group: 10");
  });

  it("should call callbacks", () => {
    render(
      <OrderBookActions
        spread={15}
        group={10}
        handleDecrease={decreaseSpy}
        handleIncrease={increaseSpy}
      />
    );

    const increase = screen.getByTestId("increase-group");
    const decrease = screen.getByTestId("decrease-group");

    fireEvent.click(increase);
    fireEvent.click(decrease);

    expect(increaseSpy).toHaveBeenCalled();
    expect(decreaseSpy).toHaveBeenCalled();
  });

  it("should not call callbacks when buttons disabled", () => {
    render(
      <OrderBookActions
        spread={15}
        group={10}
        handleDecrease={decreaseSpy}
        handleIncrease={increaseSpy}
        increaseDisabled
        decreaseDisabled
      />
    );

    const increase = screen.getByTestId("increase-group");
    const decrease = screen.getByTestId("decrease-group");

    fireEvent.click(increase);
    fireEvent.click(decrease);

    expect(increaseSpy).not.toHaveBeenCalled();
    expect(decreaseSpy).not.toHaveBeenCalled();
  });
});
