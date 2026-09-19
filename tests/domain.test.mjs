import test from 'node:test';
import assert from 'node:assert/strict';
import { cartReducer } from '../src/lib/cart.ts';
import { futureReservation, validPhone, localDateValue } from '../src/lib/validation.ts';
test('cart merges repeated dishes and limits quantity', () => {
  let state = cartReducer([], {type:'add', slug:'chicken'});
  state = cartReducer(state, {type:'add', slug:'chicken', quantity:2});
  assert.deepEqual(state, [{slug:'chicken', quantity:3}]);
  assert.equal(cartReducer(state, {type:'add',slug:'chicken',quantity:99})[0].quantity,20);
  assert.equal(cartReducer(state,{type:'quantity',slug:'chicken',quantity:-5})[0].quantity,1);
  assert.deepEqual(cartReducer(state,{type:'remove',slug:'chicken'}),[]);
  assert.deepEqual(cartReducer(state,{type:'clear'}),[]);
});
test('reservations reject past or invalid times in Bangladesh time', () => {
  const now = Date.parse('2026-09-19T12:00:00+06:00');
  assert.equal(futureReservation('2026-09-19','11:00',now),false);
  assert.equal(futureReservation('2026-09-19','12:00',now),false);
  assert.equal(futureReservation('2026-09-19','13:00',now),true);
  assert.equal(futureReservation('invalid','13:00',now),false);
  assert.equal(localDateValue(new Date('2026-09-19T19:00:00Z')),'2026-09-20');
});
test('phone validation handles international numbers without accepting text',()=>{
  assert.equal(validPhone('+880 1712 345678'),true);
  assert.equal(validPhone('hello1234567'),false);
  assert.equal(validPhone('123'),false);
});
