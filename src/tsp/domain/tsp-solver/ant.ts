import { from } from "rxjs";
import { City } from "../world-generator/city";
import { DistanceMatrix } from "./distance-matrix";
import { PheromoneMap } from "./pheromone-map";

interface Edge{
    from: string;
    to: string;
    pheromones: number;
    visivility: number;
}

interface EdgeProbability{
    from: string;
    to: string;
    success: number;
    probability: number;
    cumulativeProbability: number;
}

/**
 * Represents just one Ant, for all cases, ants always start in city "A"
 */
export class Ant{
    private path: string[] = [];
    private visited: Set<string> = new Set;
    private distance: number = 0;

    constructor(
        private cities: string[],
        private distanceMatrix: DistanceMatrix,
        private pheromoneMap: PheromoneMap,
        private alpha: number,
        private beta: number
    ){  }

    public findTour(): void{
        this.path.push("A");
        this.visited.add("A");
        let finalized = false;
        while (!finalized) {
            const edges = this.getEdges();
            if(edges[0].to === "A") finalized = true;            
            const edgesProbability = this.getEdgesProbability(edges);
            const edgeSelected = this.selectEdge(edgesProbability);
            this.distance += this.distanceMatrix.getDistance(edgeSelected.from, edgeSelected.to);
            this.path.push(edgeSelected.to);
            this.visited.add(edgeSelected.to);
        }
    }

    /**
     * Get details of Edges, pheromones and calculate visibilities for all edges
     * @returns Array of edges to cities not visited or to city "A" only if the other cities was visited
     */
    private getEdges(): Edge[] {
        const actualCity = this.path[this.path.length-1];
        let edges: Edge[] = [];
        let sumDistances = 0;

        for (const cityTo of this.cities) {
            if (this.shouldSkip(cityTo)) continue;
            
            const edgeDistance = this.distanceMatrix.getDistance(actualCity, cityTo);
            const edgePheromone = this.pheromoneMap.getPheromones(actualCity, cityTo);
            sumDistances = sumDistances + edgeDistance;
            edges.push({
                from: actualCity,
                to: cityTo,
                pheromones: edgePheromone,
                visivility: edgeDistance
            })
        }

        return edges.map(edge => {
            edge.visivility = edge.visivility/sumDistances;
            return edge;
        });
    }

    private shouldSkip(cityTo: string): boolean {
        const isVisited = this.visited.has(cityTo);
        const isReturningToStart = cityTo === "A" && this.path.length === this.cities.length;
        return isVisited && !isReturningToStart;
    }

    /**
     * Calculate the transition and cummulate probability for each edge using the ACO formula
     * 
     * Each Edge's probably is calculated with:
     *      pheromones^alpha * visibility^beta / Sum(pheromones[i]^alpha * visibility[i]^beta)
     * @param edges - Array of possible edges from the current city
     * @returns An array containing the transition probability and cumulative probability for each edge
     */
    private getEdgesProbability(edges: Edge[]) {
        let sumSuccesses = 0;
        
        let edgesProbability: EdgeProbability[] = edges.map(edge => {
            const success = Math.pow(edge.pheromones, this.alpha) * Math.pow(edge.visivility, this.beta);
            sumSuccesses += success;
            return {
                from: edge.from,
                to: edge.to,
                success: success,
                probability: 0,
                cumulativeProbability: 0
            };
        });

        let cumulative = 0;
        edgesProbability = edgesProbability.map(edge => {
            edge.probability = edge.success / sumSuccesses;
            cumulative += edge.probability;
            edge.cumulativeProbability = cumulative;
            return edge
        });
        return edgesProbability;
    }

    /**
     * Select a Edge in base of cumulative probability
     * @param edges - Array of edge probabilities to choose from
     * @returns The edge selected
     */
    private selectEdge(edges: EdgeProbability[]): EdgeProbability {
        const rand = Math.random();
        for (const edge of edges) {
            if (rand <= edge.cumulativeProbability) return edge;
        }
        return edges[edges.length - 1];
    }

    public getPath(): string[] {
        return this.path;
    }

    public getDistance(): number {
        return this.distance
    }
}