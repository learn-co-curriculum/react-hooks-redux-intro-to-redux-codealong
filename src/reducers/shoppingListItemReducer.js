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
