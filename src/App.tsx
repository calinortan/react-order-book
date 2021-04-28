import React from "react";
import logo from "./logo.svg";
import OrderBook from "components/OrderBook";
import "./App.css";
import ApiProvider from "containers/ApiProvider";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h4>Calin's Order Book</h4>
      </header>
      <div className="App-container">
        <ApiProvider>
          <OrderBook />
        </ApiProvider>
      </div>
    </div>
  );
}

export default App;
