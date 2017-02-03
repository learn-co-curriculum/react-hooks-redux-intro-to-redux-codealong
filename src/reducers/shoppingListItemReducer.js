export default function shoppingListItemReducer(state = {items: []}, action) {
  console.log(action)
  switch(action.type) {
    case 'GET_COUNT_OF_ITEMS':
    let items;
    items = state.items.concat(state.items.length + 1)
    let proposedstate = Object.assign({}, {items: items})
    console.log(proposedstate)
     return proposedstate;
    default:
      console.log(state)
      return state;
  }
}
