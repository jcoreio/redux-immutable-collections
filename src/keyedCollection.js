import {fromJS, Map} from 'immutable'
import defaults from 'lodash.defaults'
import createReducer from './createReducer'

export const CLEAR = 'CLEAR'
export const INSERT = 'INSERT'
export const UPDATE = 'UPDATE'
export const REMOVE = 'REMOVE'
export const BATCH = 'BATCH'

export function actions(actionTypePrefix = '') {
  return {
    clear() {
      return {
        type: actionTypePrefix + CLEAR,
      }
    },
    insert(key, fields) {
      return {
        type: actionTypePrefix + INSERT,
        payload: fields,
        meta: {key},
      }
    },
    update(key, fields) {
      return {
        type: actionTypePrefix + UPDATE,
        payload: fields,
        meta: {key},
      }
    },
    remove(key) {
      return {
        type: actionTypePrefix + REMOVE,
        meta: {key},
      }
    },
    batch(actions) {
      if (actions.length === 1) return actions[0]
      return {
        type: actionTypePrefix + BATCH,
        payload: actions,
      }
    }
  }
}

// this looks confusing...it just maintains backwards compatibility with old actions export
// by assigning unprefixed actions to the actions function
const {clear, insert, update, remove, batch} = actions()
export {clear, insert, update, remove, batch}
Object.assign(actions, {clear, insert, update, remove, batch})

const defaultOptions = {
  actionTypePrefix: '',
  createReducer,
  createDocument: fromJS,
  initialState: Map(),
  merge(doc, fields) {
    if (!doc) return doc
    if (Object.getPrototypeOf(doc).merge instanceof Function) return doc.merge(fields)
    return {...doc, ...fields}
  }
}

export function reducer(options) {
  const {createReducer, createDocument, merge, initialState, enhance, actionTypePrefix} = defaults({}, options, defaultOptions)
  let reducer = createReducer(initialState, {
    [actionTypePrefix + CLEAR]: collection => collection.clear(),
    [actionTypePrefix + INSERT]: (collection, {payload, meta: {key}}) => collection.update(key, doc => doc || createDocument(payload)),
    [actionTypePrefix + UPDATE]: (collection, {payload, meta: {key}}) => collection.update(key, doc => merge(doc, payload)),
    [actionTypePrefix + REMOVE]: (collection, {meta: {key}}) => collection.delete(key),
    [actionTypePrefix + BATCH]: (collection, {payload}) => collection.withMutations(c => payload.reduce(reducer, c)),
  })
  if (enhance) reducer = enhance(reducer)
  return reducer
}
