import { TspGenerateCitiesResponseDto } from "src/tsp/dtos/response/generate-cities.response.dto";


/**
 * Saves in memory all distances between the cities
 */
export class DistanceMatrix {
    private matrix: Map<string, number>;
  
    constructor(data: TspGenerateCitiesResponseDto) {
      this.matrix = new Map();
  
      for(const entry of data.distances){
        const key1 = this.getKey(entry.from, entry.to);
        const key2 = this.getKey(entry.to, entry.from);
        this.matrix.set(key1, entry.distance);
        this.matrix.set(key2, entry.distance);
      }
    }
  
    private getKey(a: string, b: string): string {
      return `${a}->${b}`;
    }
  
    public getDistance(from: string, to: string): number {
      const key = this.getKey(from, to);
      const distance = this.matrix.get(key);

      if (distance === undefined) {
        throw new Error(`Distance not found between ${from} and ${to}`);
      }
  
      return distance;
    }
}