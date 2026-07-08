import test from 'node:test';
import assert from 'node:assert/strict';
import { ResourceManager } from '../js/resources.js';

test('resource manager stores and spends resources', () => {
  const manager = new ResourceManager();
  manager.add('ironOre', 25);
  manager.add('ironOre', 10);
  assert.equal(manager.get('ironOre'), 35);
  manager.spend('ironOre', 15);
  assert.equal(manager.get('ironOre'), 20);
});

test('resource manager refuses overspending', () => {
  const manager = new ResourceManager();
  manager.add('ironOre', 10);
  const result = manager.spend('ironOre', 20);
  assert.equal(result, false);
  assert.equal(manager.get('ironOre'), 10);
});
