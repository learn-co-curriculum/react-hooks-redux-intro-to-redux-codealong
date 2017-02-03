import React, { Component } from 'react';
import './App.css';

class App extends Component {
  handleOnClick(){
    this.props.store.dispatch({type: 'GET_COUNT_OF_ITEMS'})
  }
  render() {
    return (
      <div className="App">
          <button onClick={this.handleOnClick.bind(this)}>Click</button>
          <p> {this.props.store.getState().items.length}</p>
      </div>
    );
  }
}

export default App;
