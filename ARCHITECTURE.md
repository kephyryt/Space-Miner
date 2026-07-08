# Space Miner Architecture

Managers

- World
- ResourceManager
- InventoryManager
- TruckAI
- PowerManager
- ResearchManager
- SaveManager

Entities

- Building
- Truck
- Drone

Buildings

- Mine
- Warehouse
- Smelter
- Assembler

Everything should communicate through managers rather than directly whenever practical.

Systems should remain modular and extensible.
