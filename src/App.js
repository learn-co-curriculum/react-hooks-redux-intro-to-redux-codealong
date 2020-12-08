import React from "react";
import { useDispatch, useSelector } from "react-redux";

function App() {
  // read from the Redux store
  const items = useSelector((state) => state.items);

  // gives us the dispatch function to send actions to the Redux store
  const dispatch = useDispatch();

  function handleOnClick() {
    // dispatching an action on click
    dispatch({ type: "count/increment" });
  }

  return (
    <div className="App">
      <button onClick={handleOnClick}>Click</button>
      <p>{items.length}</p>
    </div>
  );
}

export default App;
