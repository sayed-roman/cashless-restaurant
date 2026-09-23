import test from 'node:test';
import assert from 'node:assert/strict';
import { parseOrder, priceOrder, OrderError, orderFailure } from '../src/lib/order-validation.ts';
const valid = () => ({ name: ' Roman ', phone: '01314937329', notes: '', lines: [{ slug: 'chicken', quantity: 2 }] });
test('normalizes details and ignores browser prices and user identity', () => {
  const parsed = parseOrder({ ...valid(), userId: 'other-user', totalMinor: 1 });
  assert.equal(parsed.name, 'Roman');
  assert.equal(parsed.notes, null);
  assert.equal(parsed.userId, undefined);
  assert.equal(parsed.totalMinor, undefined);
});
test('rejects malformed input, empty cart and invalid contact details', () => {
  for (const input of [null, [], {}, { ...valid(), name: 1 }, { ...valid(), phone: '-------' }, { ...valid(), notes: 'x'.repeat(301) }, { ...valid(), lines: [] }, { ...valid(), lines: null }])
    assert.throws(() => parseOrder(input), OrderError);
});
test('rejects fractional, nonfinite, string and out of range quantities', () => {
  for (const quantity of [0, -1, 21, 1.5, NaN, Infinity, '2', null])
    assert.throws(() => parseOrder({ ...valid(), lines: [{ slug: 'chicken', quantity }] }), OrderError);
});
test('rejects duplicate dishes and oversized carts', () => {
  assert.throws(() => parseOrder({ ...valid(), lines: [...valid().lines, ...valid().lines] }), OrderError);
  assert.throws(() => parseOrder({ ...valid(), lines: Array.from({length:31}, (_,i)=>({slug:String(i),quantity:1})) }), OrderError);
});
test('uses database price and snapshots with quantity', () => {
  const result = priceOrder(parseOrder(valid()).lines, [{id:'food1',slug:'chicken',name:'Chicken',priceMinor:48000}]);
  assert.equal(result.totalMinor, 96000);
  assert.deepEqual(result.items[0], {foodId:'food1',nameSnapshot:'Chicken',priceMinor:48000,quantity:2});
});
test('unavailable dish returns conflict before any write', () => {
  assert.throws(() => priceOrder(valid().lines, []), error => error instanceof OrderError && error.status === 409);
});
test('rejects totals outside database integer range', () => {
  assert.throws(() => priceOrder(valid().lines, [{id:'1',slug:'chicken',name:'Chicken',priceMinor:2147483647}]), OrderError);
});
test('unexpected failures do not leak database details', () => {
  const result = orderFailure(new Error('postgresql://secret database error'));
  assert.equal(result.status, 500);
  assert.ok(!result.error.includes('secret'));
  assert.equal(orderFailure(new OrderError('Please log in.',401)).status,401);
});
