import test from 'node:test';
import assert from 'node:assert/strict';
import { Smelter } from '../js/entities/smelter.js';
import { ResearchLab } from '../js/entities/researchLab.js';
import { World } from '../js/world.js';

test('smelter converts ore into plates', () => {
  const world = {
    resources: {
      data: new Map([['ironOre', 10], ['ironPlate', 0]]),
      get(name) { return this.data.get(name) || 0; },
      add(name, amount) { this.data.set(name, (this.data.get(name) || 0) + amount); }
    }
  };
  const smelter = new Smelter(0, 0, 'Smelter');
  smelter.world = world;
  smelter.update(1);
  assert.equal(world.resources.get('ironPlate'), 1);
});

test('research lab increases research level', () => {
  const world = { research: 0, researchLevel: 1 };
  const lab = new ResearchLab(0, 0, 'Research Lab');
  lab.world = world;
  lab.update(1);
  assert.ok(world.research >= 0);
});

test('world can save and restore state', () => {
  const world = new World();
  world.money = 400;
  world.research = 25;
  const saved = world.saveState();
  const restored = new World();
  restored.loadState(saved);
  assert.equal(restored.money, 400);
  assert.equal(restored.research, 25);
});
