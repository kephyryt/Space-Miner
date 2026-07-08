// ===========================================
// Space Miner
// Truck AI Routing System
// ===========================================
// Intelligent routing for trucks to find resources and deliver to buildings that need them.
// Supports any building type - no hardcoded routes.

export class TruckAI {
    /**
     * Create AI router for truck
     * @param {World} world - Reference to game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Find nearest building with specified resource available
     * @param {number} x - Current position x
     * @param {number} y - Current position y
     * @param {string} resourceType - Resource to find (e.g., "ore", "plate")
     * @param {Building} exclude - Building to exclude from search
     * @returns {Building|null}
     */
    findNearestSourceBuilding(x, y, resourceType, exclude = null) {
        let nearest = null;
        let nearestDistance = Infinity;

        // Search all buildings in the world
        for (const object of this.world.objects) {
            if (!this.isValidSourceBuilding(object, resourceType, exclude)) continue;

            const dx = object.x - x;
            const dy = object.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = object;
            }
        }

        return nearest;
    }

    /**
     * Check if a building is a valid source (has resources to pick up)
     * @param {Building} building - Building to check
     * @param {string} resourceType - Resource type to look for
     * @param {Building} exclude - Building to exclude
     * @returns {boolean}
     */
    isValidSourceBuilding(building, resourceType, exclude = null) {
        if (!building || building === exclude) return false;
        if (!building.inventory) return false;

        // Check if building has the resource available
        const available = building.inventory.get(resourceType);
        return available > 0;
    }

    /**
     * Find best destination building for a resource
     * @param {number} x - Current position x
     * @param {number} y - Current position y
     * @param {string} resourceType - Resource to deliver
     * @param {Building} exclude - Building to exclude from search
     * @returns {Building|null}
     */
    findNearestDestinationBuilding(x, y, resourceType, exclude = null) {
        let nearest = null;
        let nearestDistance = Infinity;

        // Search all buildings in the world
        for (const object of this.world.objects) {
            if (!this.isValidDestinationBuilding(object, resourceType, exclude)) continue;

            const dx = object.x - x;
            const dy = object.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = object;
            }
        }

        return nearest;
    }

    /**
     * Check if a building is a valid destination (needs resources)
     * @param {Building} building - Building to check
     * @param {string} resourceType - Resource type to deliver
     * @param {Building} exclude - Building to exclude
     * @returns {boolean}
     */
    isValidDestinationBuilding(building, resourceType, exclude = null) {
        if (!building || building === exclude) return false;
        if (!building.inventory) return false;

        // Check if building accepts this resource type
        if (!building.inventory.acceptsResource(resourceType)) return false;

        // Check if building has space
        if (!building.inventory.hasSpace()) return false;

        // Building must be a processor/consumer, not a producer
        // Warehouses and Smelters accept resources
        const acceptsList = ["Warehouse", "Smelter", "Assembler", "Research Lab"];
        return acceptsList.some(name => building.name.includes(name));
    }

    /**
     * Determine what resource type a truck should be looking for
     * Prioritize: ore -> plates -> components
     * @returns {string|null}
     */
    getNextResourceToPrioritize() {
        // Priority: ore first, then plates, then components
        // This ensures basic production chain flows
        const priorities = ["ore", "plate", "component"];

        for (const resourceType of priorities) {
            // Check if any building has this resource available
            for (const object of this.world.objects) {
                if (object.inventory && object.inventory.get(resourceType) > 0) {
                    return resourceType;
                }
            }
        }

        return null;
    }

    /**
     * Get all buildings that can be sources (producers)
     * @returns {Array<Building>}
     */
    getSourceBuildings() {
        return this.world.objects.filter(obj =>
            obj.inventory && (obj.name.includes("Mine") || obj.name.includes("HQ"))
        );
    }

    /**
     * Get all buildings that can be destinations (consumers)
     * @returns {Array<Building>}
     */
    getDestinationBuildings() {
        return this.world.objects.filter(obj =>
            obj.inventory && (obj.name.includes("Warehouse") || obj.name.includes("Smelter") || obj.name.includes("Assembler") || obj.name.includes("Lab"))
        );
    }

    /**
     * Calculate distance between two buildings
     * @param {Building} from
     * @param {Building} to
     * @returns {number}
     */
    getDistance(from, to) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
