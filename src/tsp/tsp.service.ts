import { Injectable, NotImplementedException } from '@nestjs/common';
import { TspSolveResponseDto } from './dtos/response/solve.response.dto';
import { TspSolveRequestDto } from './dtos/request/solve.request.dto';
import { TspDistanceResponseDto, TspGenerateCitiesResponseDto } from './dtos/response/generate-cities.response.dto';
import { WorldGenerator } from './domain/world-generator/world-generator';
import { TspGenerateCitiesRequestDto } from './dtos/request/generate-cities.request.dto';
import { City } from './domain/world-generator/city';
import { TspSolver } from './domain/tsp-solver/tsp-solver';

/**
 * The TspService class is a NestJS service responsible for implementing the
 * core logic of solving the Traveling Salesman Problem (TSP) and generating
 * random city coordinates.
 */
@Injectable()
export class TspService {
    solve(payload: TspSolveRequestDto): TspSolveResponseDto {
        const optimizer = new TspSolver(payload);
        return optimizer.solve();
    }

    generateCities(
        payload: TspGenerateCitiesRequestDto,
    ): TspGenerateCitiesResponseDto {
        const worldGenerator = new WorldGenerator(payload.numOfCities, {
            x: payload.worldBoundX,
            y: payload.worldBoundY,
        });

        worldGenerator.generateCities();
        return this.calculateDistances(worldGenerator.getWorld().cities);
    }

    private calculateDistances(cities: City[]): TspGenerateCitiesResponseDto {
        const citiesNames = cities.map(city => city.name);
        let distances: TspDistanceResponseDto[] = [];

        for (let i = 0; i < cities.length; i++) {
            const { name: fromName, coordinates: fromCoord } = cities[i];
    
            for (let j = i + 1; j < cities.length; j++) {
    
                const { name: toName, coordinates: toCoord } = cities[j];
    
                const dx = fromCoord.x - toCoord.x;
                const dy = fromCoord.y - toCoord.y;
                const distanceValue = Math.hypot(dx, dy);
    
                distances.push({
                    from: fromName,
                    to: toName,
                    distance: distanceValue
                });
            }
        }

        return {cities: citiesNames, distances: distances};
    }
}
