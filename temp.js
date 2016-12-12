import {reducer as keyedCollectionReducer, actions} from './lib/keyedCollection'
import {createStore} from 'redux'
import {prefixActionCreator, prefixReducer} from 'mindfront-redux-utils'
import {combineReducers} from 'mindfront-redux-utils-immutable'
import mapValues from 'lodash.mapvalues'

const USERS = 'USERS.'
const POSTS = 'POSTS.'

// the keyed collection action types are just INSERT, UPDATE, REMOVE, and BATCH,
// so you have to decorate the action creators and reducer to distinguish between
// different collections.  Here's one way to do it:

const reducer = combineReducers({
  users: keyedCollectionReducer({enhance: prefixReducer(USERS)}),
  posts: keyedCollectionReducer({enhance: prefixReducer(POSTS)}),
})

const userActions = mapValues(actions, prefixActionCreator(USERS))
const postActions = mapValues(actions, prefixActionCreator(POSTS))

const store = createStore(reducer)

store.dispatch(userActions.batch([
  userActions.insert('28nkdjas9i23kjsdaf', {
    username: 'jimbob',
    firstName: 'Jim',
    lastName: 'Bob',
  }),
  // userActions.update('28nkdjas9i23kjsdaf', {
  //   email: 'jim@bob.com',
  // }),
]))

console.log(store.getState().toJS())