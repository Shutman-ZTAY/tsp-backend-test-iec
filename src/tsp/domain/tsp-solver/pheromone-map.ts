import { TspGenerateCitiesResponseDto } from "src/tsp/dtos/response/generate-cities.response.dto";

/**
 * Saves all pheromones between cities, update, and evaporate them. 
 */
export class PheromoneMap{

    private pheromones: Map<string, number>;

    constructor(data: TspGenerateCitiesResponseDto){
        this.pheromones = new Map<string, number>();

        for(const entry of data.distances){
            const key1 = this.getKey(entry.from, entry.to);
            const key2 = this.getKey(entry.to, entry.from);
            this.pheromones.set(key1, 0.1);
            this.pheromones.set(key2, 0.1);
        }
    }

    private getKey(a: string, b: string): string {
        return `${a}->${b}`;
    }

    public getPheromones(cityA: string, cityB: string): number{
        const pheromones = this.pheromones.get(this.getKey(cityA, cityB));
        if (pheromones === undefined) {
            throw new Error(`Distance not found between ${cityA} and ${cityB}`);
        }
        return pheromones;
    }

    public update(from: string, to: string, delta: number): void{
        const key1 = this.getKey(from, to);
        const key2 = this.getKey(to, from);

        const currentPath1 = this.pheromones.get(key1) ?? 0;
        const currentPath2 = this.pheromones.get(key2) ?? 0;

        this.pheromones.set(key1, currentPath1 + delta)
        this.pheromones.set(key2, currentPath2 + delta)
    }

    public evaporate(rate: number): void{
        for (const [key, value] of this.pheromones.entries()) {
            this.pheromones.set(key, value * (1-rate))
        }
    }
}