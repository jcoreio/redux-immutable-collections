export default function createReducer(initialState, handlers) {
  if (!handlers) {
    handlers = initialState
    initialState = undefined
  }
  return function actionHandlerReducer(state = initialState, action) {
    const reducer = handlers[action.type]
    return reducer ? reducer(state, action) : state
  }
}

