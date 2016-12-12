import {reducer as keyedCollectionReducer, insert, update, remove, batch} from '../src/keyedCollection'
import {fromJS} from 'immutable'
import chai, {expect} from 'chai'
import chaiImmutable from 'chai-immutable'

chai.use(chaiImmutable)

describe('keyedCollectionReducer', () => {
  const reducer = keyedCollectionReducer()
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
      expect(reducer(fromJS({a: {hello: 'world'}}), update('a', {foo: 'bar'}))).to.equal(fromJS({a: {hello: 'world', foo: 'bar'}}))
    })
    it('overwrite existing fields', () => {
      expect(reducer(fromJS({a: {hello: 'world'}}), update('a', {hello: 'bar'}))).to.equal(fromJS({a: {hello: 'bar'}}))
    })
  })
  describe('remove', () => {
    it('removes document from collection', () => {
      expect(reducer(fromJS({a: {hello: 'world'}, foo: {bar: true}}), remove('a'))).to.equal(fromJS({foo: {bar: true}}))
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
  })
})
