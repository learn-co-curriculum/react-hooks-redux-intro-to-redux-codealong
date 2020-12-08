const initialState = {
  items: [],
};

export function shoppingListReducer(state = initialState, action) {
  switch (action.type) {
    case "count/increment":
      return {
        ...state,
        items: state.items.concat(state.items.length + 1),
      };
    default:
      return state;
  }
}
