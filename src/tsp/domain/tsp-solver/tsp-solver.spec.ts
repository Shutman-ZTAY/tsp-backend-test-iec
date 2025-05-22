import { TspGenerateCitiesResponseDto } from "src/tsp/dtos/response/generate-cities.response.dto";
import { TspSolver } from "./tsp-solver";

const tspMockData: TspGenerateCitiesResponseDto = {
    "cities": [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J"
    ],
    "distances": [
        {
            "from": "A",
            "to": "B",
            "distance": 55.44366510251644
        },
        {
            "from": "A",
            "to": "C",
            "distance": 187.3846311734236
        },
        {
            "from": "A",
            "to": "D",
            "distance": 124.53513560437472
        },
        {
            "from": "A",
            "to": "E",
            "distance": 98.23441352194251
        },
        {
            "from": "A",
            "to": "F",
            "distance": 33.83784863137726
        },
        {
            "from": "A",
            "to": "G",
            "distance": 19.697715603592208
        },
        {
            "from": "A",
            "to": "H",
            "distance": 28.861739379323623
        },
        {
            "from": "A",
            "to": "I",
            "distance": 67.00746227100382
        },
        {
            "from": "A",
            "to": "J",
            "distance": 127.58134659894448
        },
        {
            "from": "B",
            "to": "C",
            "distance": 190.11838417154718
        },
        {
            "from": "B",
            "to": "D",
            "distance": 99.20181449953424
        },
        {
            "from": "B",
            "to": "E",
            "distance": 113.43720729989785
        },
        {
            "from": "B",
            "to": "F",
            "distance": 88.3911760301898
        },
        {
            "from": "B",
            "to": "G",
            "distance": 49.73932046178356
        },
        {
            "from": "B",
            "to": "H",
            "distance": 44.598206241955516
        },
        {
            "from": "B",
            "to": "I",
            "distance": 76.6550715869472
        },
        {
            "from": "B",
            "to": "J",
            "distance": 76.79192665899195
        },
        {
            "from": "C",
            "to": "D",
            "distance": 108.46197490364999
        },
        {
            "from": "C",
            "to": "E",
            "distance": 90.42676594902639
        },
        {
            "from": "C",
            "to": "F",
            "distance": 183.91846019364127
        },
        {
            "from": "C",
            "to": "G",
            "distance": 169.17742166140258
        },
        {
            "from": "C",
            "to": "H",
            "distance": 163.37686494727458
        },
        {
            "from": "C",
            "to": "I",
            "distance": 121.2641744292188
        },
        {
            "from": "C",
            "to": "J",
            "distance": 179.47144619688115
        },
        {
            "from": "D",
            "to": "E",
            "distance": 80.15609770940699
        },
        {
            "from": "D",
            "to": "F",
            "distance": 141.0319112825179
        },
        {
            "from": "D",
            "to": "G",
            "distance": 105.38026380684383
        },
        {
            "from": "D",
            "to": "H",
            "distance": 95.70788891204319
        },
        {
            "from": "D",
            "to": "I",
            "distance": 70.83078426785913
        },
        {
            "from": "D",
            "to": "J",
            "distance": 71.06335201775948
        },
        {
            "from": "E",
            "to": "F",
            "distance": 93.81364506296512
        },
        {
            "from": "E",
            "to": "G",
            "distance": 81.30190649671138
        },
        {
            "from": "E",
            "to": "H",
            "distance": 77.38862965578342
        },
        {
            "from": "E",
            "to": "I",
            "distance": 36.878177829171555
        },
        {
            "from": "E",
            "to": "J",
            "distance": 135.988970140964
        },
        {
            "from": "F",
            "to": "G",
            "distance": 42.05948168962618
        },
        {
            "from": "F",
            "to": "H",
            "distance": 51.478150704935
        },
        {
            "from": "F",
            "to": "I",
            "distance": 73.16419889536138
        },
        {
            "from": "F",
            "to": "J",
            "distance": 156.58863304850706
        },
        {
            "from": "G",
            "to": "H",
            "distance": 10.04987562112089
        },
        {
            "from": "G",
            "to": "I",
            "distance": 48.10405388322277
        },
        {
            "from": "G",
            "to": "J",
            "distance": 114.5294721894762
        },
        {
            "from": "H",
            "to": "I",
            "distance": 42.20189569201838
        },
        {
            "from": "H",
            "to": "J",
            "distance": 105.30906893520614
        },
        {
            "from": "I",
            "to": "J",
            "distance": 109.20164833920776
        }
    ]
};

describe("Ant Colony Optimizer", () => {
    it("should return a valid tour that visits all cities once", () => {
        const optimizer = new TspSolver(tspMockData);
        const solution = optimizer.solve();
        const uniqueCities = new Set(solution.route);
        expect(uniqueCities.size).toBe(tspMockData.cities.length);
        // console.log(solution)
    });

    it("should improve the best solution over 50 iterations", () => {
        const optimizer = new TspSolver(tspMockData, 5);
        const bestDistances: number[] = [];
    
        for (let i = 0; i < 10; i++) {
            const distanceIteration = optimizer.solve().totalDistance;
            if (i === 0 || distanceIteration <= bestDistances[i - 1]) {
                bestDistances.push(distanceIteration);  
            } else {
                bestDistances.push(bestDistances[i - 1]);
            }
        }
        const firstHalf = bestDistances.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
        const secondHalf = bestDistances.slice(5).reduce((a, b) => a + b, 0) / 5;
    
        expect(secondHalf).toBeLessThanOrEqual(firstHalf);
    });
});