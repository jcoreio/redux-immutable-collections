export default function createReducer(handlers, initialState) {
  return function actionHandlerReducer(state = initialState, action) {
    const handler = handlers[action.type]
    return handler ? handler(state, action) : state
  }
}

