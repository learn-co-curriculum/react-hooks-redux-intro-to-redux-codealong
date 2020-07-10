# Intro to Redux: Reading Data from State

## Objectives

- Use the `createStore()` method provided by the redux library.

## Introduction

In the previous section, we have been building using a **createStore()** method
that we wrote, and passing a reducer to it. We have been using the **dispatch**
method from the store, to dispatch actions and update the state.

Now let's think about which part of our application would belong in the official
Redux library -- that is, which part of our codebase would be common to all
applications. Well, probably not the reducer as our reducers seem unique to each
React & Redux application. The reducers are unique because sometimes we have
reducers that would add or remove items, or add or remove users, or edit users,
etc. What these actions are and how the reducer manages the state is customized.
Thus, the reducer would not be part of the redux library that other developers
would use to build their application.

The **createStore()**, method however is generic across Redux applications. It
always returns a store (given a reducer) that will have a dispatch method and a
getState method.

So from now on, we will import our **createStore()** method from the official
Redux library. Normally, to install Redux into a React application, you need to
install two packages, `redux` and `react-redux` by running `npm install redux && npm install react-redux`. These are already included in this lesson's
`package.json` file, so all you need to do is run `npm install && npm start` to
get started.

In this code along, we'll be building a simple shopping list application that
will allow a user to view an existing shopping list.

### Step 1: Setting Up The Store

First things first, we'll use Redux to initialize our store and pass it down to
our top-level container component.

Redux provides a function, `createStore()`, that, when invoked, returns an
instance of the Redux store for us. So we can use that method to create a store.
We want to import `createStore()` in our `src/index.js` file, where ReactDOM
renders our application.

```javascript
// ./src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'; /* code change */
import shoppingListItemReducer from './reducers/shoppingListItemReducer.js';
import App from './App';
import './index.css';

const store = createStore(shoppingListItemReducer); /* code change */

ReactDOM.render(<App />, document.getElementById('root'));
```

Notice that we are importing the `createStore` function from Redux. Now, with
the above set up, we _could_ pass `store` down through App and we would be able
to access the **Redux** store.

However, reducing the need for passing props is part of why **Redux** works well
with React. To avoid passing `store` as a prop, we use the `Provider` component,
which is imported from `react-redux`. The `Provider` component wraps the top
level component, App, in this case, and is the only component where `store` is
passed in:

```javascript
// ./src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux'; /* code change */
import shoppingListItemReducer from './reducers/shoppingListItemReducer.js';
import App from './App';
import './index.css';

const store = createStore(shoppingListItemReducer);

// code change - added Provider to wrap around App
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider> /* code change */,
  document.getElementById('root')
);
```

By including the `Provider`, we'll be able to access our **Redux** store and/or
dispatch actions from any component we want, regardless of where it is on the
component tree.

So, to recap, just like we did previously, we call our **createStore()** method
in `src/index.js`. We pass our **createStore()** method a reducer, and then we
pass our newly created store to our **App** component as a prop. You can find
the reducer in `./src/reducers/shoppingListItemReducer.js`:

```javascript
// ./src/reducers/shoppingListItemReducer.js

export default function shoppingListItemReducer(
  state = {
    items: []
  },
  action
) {
  switch (action.type) {
    case 'INCREASE_COUNT':
      return {
        ...state,
        items: state.items.concat(state.items.length + 1)
      }

    default:
      return state;
  }
}
```

Ok so effectively, our reducer is just producing a counter. It adds a new item
to the list each time it is called, and that item is one more than the last
item.

Instead of having all of our functions encapsulated in a closure within
`index.js` as we did while building our own redux set up, we've now separated
out the reducer function, giving it a relevant name, `shoppingListItemReducer`,
and let the Redux library take care of our `createStore` function. These two
pieces are both imported into `src/index.js` and used to create `store`.

This `store` value is then passed in as a prop to `Provider`.

To gain access to the `store` somewhere in our app, we use a second function
provided by `react-redux`, `connect`. By modifying a component's export
statement and included `connect`, we are able to take data from our **Redux**
store and map them to a component's props. Similarly, we can _also_ take
actions, and by wrapping them in a dispatch and an anonymous function, be able
pass them as props as well:

```javascript
// ./src/App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

class App extends Component {
  handleOnClick = event => {
    this.props.increaseCount();
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.handleOnClick}>Click</button>
        <p>{this.props.items.length}</p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.items
  };
};

const mapDispatchToProps = dispatch => {
  return {
    increaseCount: () => dispatch({ type: 'INCREASE_COUNT' })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
```

Ok, so this code places a button on the page with an `onClick` event listener
pointed to `this.handleOnClick`. When `this.handleOnClick` is invoked, it calls
a function, `this.props.increaseCount`. Well.. `increaseCount` is actually being
provided by the new function below our App component: `mapDispatchToProps`.

Meanwhile, we've also got `this.props.items.length`, which is _also_ a prop
created from our **Redux** store. As the store's `items` property increases, App
will display a different number!

If you boot up the app, you should see a button on the page, followed by a zero,
using the core above for `index.js` and `App.js`, we can see **Redux** in
action. Every button click dispatches an action to our store, causing it to
change. Since data (`items`) from that store is being accessed in App, App will
re-render and display the updated counter.

#### Add Logging to Our Reducer

Ok, so getting our application to re-render takes a bit of work, and were going
to go into greater depth in the next sections. In the meantime, let's get some
feedback. First, let's log our action and the new state. So we'll change the
reducer to the following:

```javascript
// ./src/reducers/shoppingListItemReducer

export default function shoppingListItemReducer(
  state = {
    items: []
  },
  action
) {
  console.log(action);
  switch (action.type) {
    case 'INCREASE_COUNT':
      console.log('Current state.items length %s', state.items.length);
      console.log('Updating state.items length to %s', state.items.length + 1);
      return {
        ...state,
        items: state.items.concat(state.items.length + 1)
      };

    default:
      console.log('Initial state.items length: %s', state.items.length);
      return state;
  }
}
```

Ok, so this may look like a lot, but really all were doing is adding some
logging behavior. At the top of the function, we are logging the action. After
the case statement, we are storing our state as current state first. Then we are
logging the updating state value. Then under the default case statement, we
just can log the previous state because this state is unchanged.

Now, refresh your app, and give it a shot. You should see the correct action
being dispatched, as well as an update to the state. While we aren't getting our
state directly from the store, we know that we are dispatching actions. We know
this because each time we click a button, we call store.dispatch({ type:
'INCREASE_COUNT' }) and somehow this is hitting our reducer. So things are
happening.

#### Redux DevTools

There is this amazing piece of software that allows us to nicely view the state
of our store and each action that is dispatched. The software does a lot more
than that. I'll let you read about it here:
[redux-devtools-extension][devtools]. Ok, so let's get to incorporating this. In
fact, every time we use the Redux library going forward, we should make sure we
incorporate devtools. Otherwise, you are flying blind.

First, just Google for Redux Devtools Chrome. There you will find the Chrome
extension for Redux. Please download it, and refresh Chrome. You will know that
you have installed the extension if you go to your developer console in Google
Chrome (press command+shift+c to pull it up), and then at the top bar you will
see a couple of arrows. Click those arrows, and if you see Redux as your
dropdown, you properly installed the Chrome extension. Step one is done.

Second, we need to tell our application to communicate with this extension.
Doing so is pretty easy. Now we change the arguments to our createStore method
to the following:

```javascript
// ./src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import shoppingListItemReducer from './reducers/shoppingListItemReducer';
import App from './App';
import './index.css';

const store = createStore(
  shoppingListItemReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
); /* code change */

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

Ok, notice that we are still passing through our reducer to the createStore
method. The second argument is accessing our browser to find a method called
`__REDUX_DEVTOOLS_EXTENSION__`. If that method is there, the method is executed.
Now if you have your Chrome console opened, make sure the Redux Devtools
Inspector is open (press command+shift+c, click on the arrows at the top right,
and the dropdown for the extension). Now click on the tab that says state. You
should see `{ items: [] }`. If you do, it means that your app is now
communicating with the devtool. Click on the button in your application, to see
if the state changes. Now for each time you click on it, you should see an
action in the devtools that has the name of that action. If you are looking at
the last state, you should see the changes in our state.

Whew!

### Summary

In this lesson, we saw how to use the **createStore()** method. We saw that we
can rely on the Redux library to provide this method, and that we still need to
write our own reducer to tell the store what the new state will be given a
particular action. We saw that when using the **createStore()** method, and
passing through a reducer, we are able to change the state just as we did
previously. We were able to see these changes by hooking our application up to a
Chrome extension called Redux Devtools, and then providing the correct
configuration.

[devtools]: https://github.com/zalmoxisus/redux-devtools-extension
