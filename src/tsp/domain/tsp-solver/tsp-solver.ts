import { TspGenerateCitiesResponseDto } from "src/tsp/dtos/response/generate-cities.response.dto";
import { PheromoneMap } from "./pheromone-map";
import { DistanceMatrix } from "./distance-matrix";
import { Ant } from "./ant";
import { TspSolveResponseDto } from "src/tsp/dtos/response/solve.response.dto";

/**
 * Solver selected for this problem was ACO (Ant Colony Optimizer), it's inspired by the ants.
 */
export class TspSolver {
    private pheromoneMap: PheromoneMap;
    private distanceMatrix: DistanceMatrix;
    private cities: string[];

    constructor(
        data: TspGenerateCitiesResponseDto,
        private iterations = 50,
        private numAnts = 300,
        private alpha = 1,          // Importance of pheromones
        private beta = 5,           // Importance of visibility
        private evaporationRate = 0.2,
        private q = 100
    ) {
        this.pheromoneMap = new PheromoneMap(data);
        this.distanceMatrix = new DistanceMatrix(data);
        this.cities = data.cities;
    }

    public solve(): TspSolveResponseDto {
        let bestPath: string[] = [];
        let bestDistance = Infinity;

        for (let i = 0; i < this.iterations; i++) {
            const ants = this.getAnts();
            let numberAnt = 1;
            for (const ant of ants) {
                ant.findTour();

                const distance = ant.getDistance();
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestPath = ant.getPath();
                    // console.log(`Better path finded - iteration: ${i+1}, number of ant: ${numberAnt}`);
                }

                this.pheromoneMap.update(ant.getPath(), this.q/distance);
            }  
            this.pheromoneMap.evaporate(this.evaporationRate);
        }
        
        return {route: bestPath, totalDistance: bestDistance};
    }

    private getAnts(): Ant[]{
        let ants: Ant[] = [];
        for(let i = 0; i<this.numAnts; i++){
            const ant = new Ant(
                this.cities,
                this.distanceMatrix,
                this.pheromoneMap,
                this.alpha,
                this.beta
            );
            ants.push(ant);
        }
        return ants;
    }
}
