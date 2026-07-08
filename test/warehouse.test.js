import test from 'node:test';
import assert from 'node:assert/strict';
import { Warehouse } from '../js/entities/warehouse.js';

class MockWorld {
  constructor() {
    this.money = 0;
    this.resources = { add() {}, spend() {} };
  }
}

test('warehouse converts stored ore into money over time', () => {
  const world = new MockWorld();
  const warehouse = new Warehouse(0, 0, 'Warehouse');
  warehouse.world = world;
  warehouse.storage = 5;

  warehouse.update(1);

  assert.equal(warehouse.storage, 4);
  assert.equal(world.money, 10);
});
