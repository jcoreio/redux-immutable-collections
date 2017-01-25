import {fromJS, Map} from 'immutable'
import defaults from 'lodash.defaults'
import createReducer from './createReducer'

export const INSERT = 'INSERT'
export const UPDATE = 'UPDATE'
export const REMOVE = 'REMOVE'
export const BATCH = 'BATCH'

export function insert(key, fields) {
  return {
    type: INSERT,
    payload: fields,
    meta: {key},
  }
}

export function update(key, fields) {
  return {
    type: UPDATE,
    payload: fields,
    meta: {key},
  }
}

export function remove(key) {
  return {
    type: REMOVE,
    meta: {key},
  }
}

export function batch(actions) {
  return {
    type: BATCH,
    payload: actions,
  }
}

export const actions = {
  insert, update, remove, batch,
}

const defaultOptions = {
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
  const {createReducer, createDocument, merge, initialState, enhance} = defaults({}, options, defaultOptions)
  let reducer = createReducer(initialState, {
    [INSERT]: (collection, {payload, meta: {key}}) => collection.update(key, doc => doc || createDocument(payload)),
    [UPDATE]: (collection, {payload, meta: {key}}) => collection.update(key, doc => merge(doc, payload)),
    [REMOVE]: (collection, {meta: {key}}) => collection.delete(key),
    [BATCH]: (collection, {payload}) => collection.withMutations(c => payload.reduce(reducer, c)),
  })
  if (enhance) reducer = enhance(reducer)
  return reducer
}
