import {Map, fromJS} from 'immutable'
import chai, {expect} from 'chai'
import chaiImmutable from 'chai-immutable'
import {createReducer} from 'mindfront-redux-utils'
import {reducer as keyedCollectionReducer, actions} from '../src/keyedCollection'

chai.use(chaiImmutable)

describe('keyedCollectionReducer', () => {
  function tests(actions, reducer) {
    const {insert, update, remove, batch} = actions
    describe('insert', () => {
      it('inserts if no document exists', () => {
        expect(reducer(undefined, insert('a', {hello: 'world'}))).to.equal(fromJS({a: {hello: 'world'}}))
      })
      it("doesn't overwrite existing document", () => {
        expect(reducer(fromJS({'a': {hello: 'world'}}), insert('a', {another: 'doc'}))).to.equal(fromJS({a: {hello: 'world'}}))
      })
    })
    describe('update', () => {
      it('merges fields into document', () => {
        expect(reducer(fromJS({a: {hello: 'world'}}), update('a', {foo: 'bar'}))).to.equal(fromJS({
          a: {
            hello: 'world',
            foo: 'bar'
          }
        }))
      })
      it('overwrite existing fields', () => {
        expect(reducer(fromJS({a: {hello: 'world'}}), update('a', {hello: 'bar'}))).to.equal(fromJS({a: {hello: 'bar'}}))
      })
      it('merges fields into plain object', () => {
        expect(reducer(Map({
          a: {
            hello: 'world',
            q: 't'
          }
        }), update('a', {hello: 'bar'})).toJS()).to.deep.equal({a: {hello: 'bar', q: 't'}})
      })
      it("changes nothing if document doesn't exist for id", () => {
        expect(reducer(Map({
          a: {
            hello: 'world',
            q: 't'
          }
        }), update('b', {hello: 'bar'})).toJS()).to.deep.equal({a: {hello: 'world', q: 't'}})
      })
    })
    describe('remove', () => {
      it('removes document from collection', () => {
        expect(reducer(fromJS({
          a: {hello: 'world'},
          foo: {bar: true}
        }), remove('a'))).to.equal(fromJS({foo: {bar: true}}))
      })
    })
    describe('batch', () => {
      it('performs all actions', () => {
        expect(reducer(undefined, batch([
          insert('a', {a: 1}),
          insert('c', {c: 3}),
          insert('b', {b: 2}),
          update('a', {foo: 'bar'}),
          remove('c'),
        ]))).to.equal(fromJS({
          a: {a: 1, foo: 'bar'},
          b: {b: 2},
        }))
      })
      it('returns single action instead of wrapping it', () => {
        expect(batch([insert('a', {a: 1})])).to.deep.equal(insert('a', {a: 1}))
      })
    })
  }

  describe('default case', () => {
    tests(actions, keyedCollectionReducer())
  })
  describe('enhanced with action type prefixes', () => {
    tests(actions('TEST.'), keyedCollectionReducer({
      actionTypePrefix: 'TEST.',
    }))
  })
  describe('with createReducer from mindfront-redux-utils', () => {
    tests(actions, keyedCollectionReducer({createReducer}))
  })
})
