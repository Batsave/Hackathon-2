import React from "react";
import { Outlet } from "react-router-dom";
import "./scss/root.scss";

function App() {
  return (
    <div className="App_container">
      <Outlet />
    </div>
  );
}

export default App;
