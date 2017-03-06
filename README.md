# redux-immutable-collections

[![Build Status](https://travis-ci.org/jcoreio/redux-immutable-collections.svg?branch=master)](https://travis-ci.org/jcoreio/redux-immutable-collections)
[![Coverage Status](https://coveralls.io/repos/github/jcoreio/redux-immutable-collections/badge.svg?branch=master)](https://coveralls.io/github/jcoreio/redux-immutable-collections?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Reducers and actions for storing collections of documents in Immutable.js collections in Redux state.
Designed for Mongo documents, but potentially useful even if you're not using Mongo.

## Usage

```
npm i --save redux-immutable-collections
```

### Keyed collections

```es6
import {reducer as keyedCollectionReducer, actions} from './lib/keyedCollection'
import {createStore} from 'redux'
import {combineReducers} from 'mindfront-redux-utils-immutable'

const USERS = 'USERS.'
const POSTS = 'POSTS.'

// the keyed collection action types are just INSERT, UPDATE, REMOVE, and BATCH,
// unless we specify an action type prefix like so:

const reducer = combineReducers({
  users: keyedCollectionReducer({actionTypePrefix: USERS}),
  posts: keyedCollectionReducer({actionTypePrefix: POSTS}),
})
const userActions = mapValues(actions(USERS))
const postActions = mapValues(actions(POSTS))

const store = createStore(reducer)

store.dispatch(userActions.insert('28nkdjas9i23kjsdaf', {
  username: 'jimbob',
  firstName: 'Jim',
  lastName: 'Bob',
}))
store.dispatch(userActions.update('28nkdjas9i23kjsdaf', {
  email: 'jim@bob.com',
}))

console.log(store.getState())
```

The state will look like this:
```
Map {
  "users": Map {
    "28nkdjas9i23kjsdaf": Map {
      "username": "jimbob",
      "firstName": "Jim",
      "lastName": "Bob",
      "email": "jim@bob.com"
    }
  },
  "posts": undefined
}
```

You can also `remove` documents:
```es6
store.dispatch(userActions.remove('28nkdjas9i23kjsdaf'))
```

If you need to make a lot of changes rapidly, dispatch them in a batch; the reducer will handle them inside a
`withMutations` call, which is much more efficient, and redux subscribers will only be notified once:
```es6
store.dispatch(userActions.batch([
  userActions.insert('28nkdjas9i23kjsdaf', {
    username: 'jimbob',
    firstName: 'Jim',
    lastName: 'Bob',
  }),
  userActions.update('28nkdjas9i23kjsdaf', {
    email: 'jim@bob.com',
  }),
]))
```

There is a `clear` action as well that will clear the collection.

