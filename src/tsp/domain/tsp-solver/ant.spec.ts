import { TspGenerateCitiesResponseDto } from "src/tsp/dtos/response/generate-cities.response.dto";
import { DistanceMatrix } from "./distance-matrix";
import { PheromoneMap } from "./pheromone-map";
import { Ant } from "./ant";


const tspMockData: TspGenerateCitiesResponseDto = {
    cities: ['A', 'B', 'C'],
    distances: [
      { from: 'A', to: 'B', distance: 1 },
      { from: 'B', to: 'A', distance: 1 },
      { from: 'A', to: 'C', distance: 2 },
      { from: 'C', to: 'A', distance: 2 },
      { from: 'B', to: 'C', distance: 3 },
      { from: 'C', to: 'B', distance: 3 }
    ]
};

describe('Ant', () => {
    it('should complete a tour visiting all cities and return to the start', () => {

      const distanceMatrix = new DistanceMatrix(tspMockData);
      const pheromoneMap = new PheromoneMap(tspMockData);
  
      const ant = new Ant(tspMockData.cities, distanceMatrix, pheromoneMap, 1, 1);
      ant.findTour();
  
      const path = ant.getPath();
  
      expect(path[0]).toBe("A");
      expect(path[path.length - 1]).toBe("A");
  
      const uniqueCitiesVisited = new Set(path.slice(0, -1));
      expect(uniqueCitiesVisited.size).toBe(tspMockData.cities.length);
  
      expect(path.length).toBe(tspMockData.cities.length + 1);
    });
});