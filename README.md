# Intro to Redux: Reading Data from State

## Objectives

* Use the `createStore()` method provided by the redux library.

## Introduction

In the previous units, we have been building using a __createStore()__ method that we wrote, and passing a reducer to it. We have been using the __dispatch__ method from the store, to dispatch actions and update the state.

Now let's think about which part of our application would belong in the official Redux library -- that is, which part of our codebase would be common to all applications. Well, probably not the reducer as our reducers seem unique to each React & Redux application.  The reducers are unique because sometimes we have reducers that would add or remove items, or add or remove users, or edit users, etc. What these actions are and how the reducer manages the state is customized. Thus, the reducer would not be part of the redux library that other developers would use to build their application.   

The __createStore()__, method however is generic across Redux applications. It always return a store (given a reducer) that will have a dispatch method and a getState method.  

So from now on, we will import our __createStore()__ method from the official Redux library.  Normally, to install Redux into a React application, you simply need to run `npm install redux --save`. Let's clone down this repo and then run `npm install && npm start` to get started.

In this code along, we'll be building a simple shopping list application that will allow a user to view an existing shopping list.

### Step 1: Setting Up The Store

First things first, we'll use Redux to initialize our store and pass it down to our top-level container component.

Redux provides a function, `createStore()`, that, when invoked, returns an instance of the Redux store for us. So we can use that method to create a store.

```javascript
// ./src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'; /* code change */
import shoppingListItemReducer from 'src/reducers/shoppingListItemReducer.js';
import App from './App';
import './index.css';

const store = createStore(shoppingListItemReducer); /* code change */

ReactDOM.render(
  <App store={store} />, /* code change */ 
  document.getElementById('root')
);
```

Notice that we are importing the `createStore` function from Redux. Just like we did previously, we call our __createStore()__ method in our `./src/index.js` file, the entry point of our application.  We pass our __createStore()__ method a reducer, and then we pass our newly created store to our __App__ component as a prop. You can find the reducer in `./src/reducers/shoppingListItemReducer.js`:

```javascript
// ./src/reducers/shoppingListItemReducer.js

export default function shoppingListItemReducer(state = {
  items: []
}, action) {
  switch(action.type) {

    case 'INCREASE_COUNT':
      return state.items.concat(state.items.length + 1);
      
    default:
      return state;
  }
}
```

Ok so effectively, our reducer is just producing a counter. It adds a new item to the list each time it is called, and that item is one more than the last item. So far, not much has changed. We used to reference a createStore method in our lib folder, and import that method in index.js. Now, we reference a createStore method from the Redux library and call that in index.js.

Let's get some confirmation that this works.  

We can try to see changes in our state if we add the following code. (It won't work, but let's give it a shot - A for effort I always say.)

```javascript
// ./src/App.js

import React, { Component } from 'react';
import './App.css';

class App extends Component {

  handleOnClick() {
    this.props.store.dispatch({
      type: 'INCREASE_COUNT',
    });
  }

  render() {
    return (
      <div className="App">
        <button onClick={(event) => this.handleOnClick(event)} >
          Click 
        </button>
        <p>{this.props.store.getState().items.length}</p>
      </div>
    );
  }
};

export default App;
```

Ok, so this code places a button on the page, that dispatches an action to increase the count each time the button is clicked. If you boot up the app, you should see a button on the page, followed by a zero, as we start off with zero items in our store's state. If you click the button, however it never changes. Why not? Well, we *are* changing our state, but our application is not re-rendering. But don't take my word for it, instead let's prove it in the next section.

#### Add in logging to our reducer

Ok, so getting our application to re-render takes a bit of work, and were going to leave it for the next section. In the meantime, let's get some feedback. First, let's log our action and the new state. So we'll change the reducer to the following:

```javascript
// ./src/reducers/shoppingListItemReducer

export default function shoppingListItemReducer(state = {
  items: []
}, action) {
  console.log(action);
  switch(action.type) {

    case 'INCREASE_COUNT':
      console.log("Current state.items length %s", state.items.length);
      console.log("Updating state.items length to %s", state.items.length + 1);
      return Object.assign({}, state, { items: state.items.concat(state.items.length + 1) });

    default:
      console.log("Initial state.items length: %s", state.items.length);
      return state;
  }
}
```

Ok, so this may look like a lot, but really all were doing is adding some logging behavior.  At the top of the function, we are logging the action. After the case statement, we are storing our state as current state first. Then we are logging the updating state value.  Then under the default case statement, we just can log the previous state because this state is unchanged.  

Now, refresh your app, and give it a shot. You should see the correct action being dispatched, as well as an update to the state. While we aren't getting our state directly from the store, we know that we are dispatching actions. We know this because each time we click a button, we call store.dispatch({ type: 'INCREASE_COUNT' }) and somehow this is hitting our reducer. So things are happening. Let's kick it up a notch.  

#### Incorporating Redux DevTools

There is this amazing piece of software that allows us to nicely view the state of our store and each action that is dispatched. The software does a lot more than that. I'll let you read about it here: [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension). Ok, so let's get to incorporating this. In fact, every time we use the Redux library going forward, we should make sure we incorporate devtools. Otherwise, you are flying blind.

First, just Google for Redux Devtools Chrome. There you will find the Chrome extension for Redux.  Please download it, and refresh Chrome. You will know that you have installed the extension if you go to your developer console in Google Chrome (press command+shift+c to pull it up), and then at the top bar you will see a couple of arrows. Click those arrows, and if you see Redux as your dropdown, you properly installed the Chrome extension. Step one is done.

Second, we need to tell our application to communicate with this extension. Doing so is pretty easy.  Now we change the arguments to our createStore method to the following:

```javascript
// ./src/index.js 

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import shoppingListItemReducer from './reducers/shoppingListItemReducer';
import App from './App';
import './index.css';

const store = createStore(shoppingListItemReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()); /* code change */

ReactDOM.render(
  <Provider store={store}>
    <App store={store} />
  </Provider>,
  document.getElementById('root')
);

```

Ok, notice that we are still passing through our reducer to the createStore method. The second argument is accessing our browser to find a method called `__REDUX_DEVTOOLS_EXTENSION__`. If that method is there, the method is executed. Now if you have your Chrome console opened, make sure the Redux Devtools Inspector is open (press command+shift+c, click on the arrows at the top right, and the dropdown for the extension). Now click on the tab that says state. You should see `{ items: [] }`. If you do, it means that your app is now communicating with the devtool.  Click on the button in your application, to see if the state changes.  Now for each time you click on it, you should see an action in the devtools that has the name of that action. If you are looking at the last state, you should see the changes in our state.

Whew!

### Summary

In this lesson, we saw how to use the __createStore()__ method. We saw that we can rely on the Redux library to provide this method, and that we still need to write our own reducer to tell the store what the new state will be given a particular action. We saw that when using the __createStore()__ method, and passing through a reducer, we are able to change the state just as we did previously. We were able to see these changes by hooking our application up to a Chrome extension called Redux Devtools, and then providing the correct configuration.

<p class='util--hide'>View <a href='https://learn.co/lessons/intro-to-redux-library-codealong'>Intro To Redux Library Codealong</a> on Learn.co and start learning to code for free.</p>
