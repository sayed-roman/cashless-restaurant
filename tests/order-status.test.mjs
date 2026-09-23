import test from 'node:test';
import assert from 'node:assert/strict';
import { canTransitionOrder } from '../src/lib/order-status.ts';
test('allows the pickup workflow in sequence', () => {
  for (const [from,to] of [['PENDING','CONFIRMED'],['CONFIRMED','PREPARING'],['PREPARING','READY'],['READY','COMPLETED']]) assert.equal(canTransitionOrder(from,to),true);
});
test('active orders can be cancelled, closed orders cannot reopen', () => {
  for (const status of ['PENDING','CONFIRMED','PREPARING','READY']) assert.equal(canTransitionOrder(status,'CANCELLED'),true);
  for (const status of ['COMPLETED','CANCELLED']) for(const to of ['PENDING','CONFIRMED','PREPARING','READY','COMPLETED','CANCELLED']) assert.equal(canTransitionOrder(status,to),false);
});
test('rejects skipped, reversed, unchanged and malformed states', () => {
  for (const pair of [['PENDING','COMPLETED'],['READY','PREPARING'],['PENDING','PENDING'],['admin','READY'],[null,'CONFIRMED']]) assert.equal(canTransitionOrder(...pair),false);
});
