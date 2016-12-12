# redux-immutable-collections

[![Build Status](https://travis-ci.org/jedwards1211/redux-immutable-collections.svg?branch=master)](https://travis-ci.org/jedwards1211/redux-immutable-collections)
[![Coverage Status](https://coveralls.io/repos/github/jedwards1211/redux-immutable-collections/badge.svg?branch=master)](https://coveralls.io/github/jedwards1211/redux-immutable-collections?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Reducers and actions for storing collections of documents in Immutable.js collections in Redux state.
Designed for Mongo documents, but potentially useful even if you're not using Mongo.

## Usage

```
npm i --save redux-immutable-collections
```

### Keyed collections

```es6
import {reducer as keyedCollectionReducer, actions} from 'redux-immutable-collections/lib/keyedCollection'
import {createStore, combineReducers} from 'redux'
import {prefixActionCreator, prefixReducer} from 'mindfront-redux-utils'
import mapValues from 'lodash.mapvalues'

const USERS = 'USERS.'
const POSTS = 'POSTS.'

// the keyed collection action types are just INSERT, UPDATE, REMOVE, and BATCH,
// so you have to decorate the action creators and reducer to distinguish between
// different collections.  Here's one way to do it:

const reducer = combineReducers({
  users: prefixReducer(USERS)(keyedCollectionReducer),
  posts: prefixReducer(POSTS)(keyedCollectionReducer),
})

const userActions = mapValues(actions, prefixActionCreator(USERS))
const postActions = mapValues(actions, prefixActionCreator(POSTS))

const store = createStore(reducer)

store.dispatch(userActions.insert('28nkdjas9i23kjsdaf', {
  username: 'jimbob',
  firstName: 'Jim',
  lastName: 'Bob',
}))
store.dispatch(userActions.update('28nkdjas9i23kjsdaf', {
  email: 'jim@bob.com',
}))
```

After this the state will look like:
```json
{
  "users": {
    "28nkdjas9i23kjsdaf": {
      "username": "jimbob",
      "firstName": "Jim",
      "lastName": "Bob",
      "email": "jim@bob.com",
    }
  }
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

