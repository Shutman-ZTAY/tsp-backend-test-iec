# Traveling Salesman Problem (TSP) Solution Using Ant Colony Optimization

This documentation explains the approach taken to solve the Traveling Salesman Problem (TSP) using the Ant Colony Optimization (ACO) algorithm.

## 1. Problem Approach

The Traveling Salesman Problem (TSP) aims to find the shortest route that visits a set of cities exactly once and returns to the starting point. It is an NP-hard problem, so an approximate algorithm was chosen to maintain efficiency and scalability. It is worth mentioning that in this problem, every city is reachable from any other city.

## 2. Chosen Algorithm: Ant Colony Optimization (ACO)

ACO is inspired by how a colony of ants finds its way to food. Experiments determined that the ants' memory lasts no longer than 3 minutes. It was also found that one of the key factors guiding the ants path is the pheromones they leave on their trails.

The decision to use ACO was based on:

- Flexibility to adjust parameters to balance precision and performance.
- Ability to explore paths that Nearest Neighbor would not explore due to randomness.
- Effectiveness in small to medium-sized TSPs (N ≤ 50).

### Performance Expectations

When using the Ant Colony Optimization algorithm, my expectations were:

- That the pheromone weight (`alpha`) would be the main driver to find a solution.
- That a lower heuristic distance weight (`beta`) would allow ants to explore more paths at the start.
- Regarding the number of ants and iterations, I expected a gradual improvement in total distance as the algorithm repeated the process.

## 3. Design and Implementation (OOP)

The algorithm implementation includes around 4 main classes:
- **DistanceMatrix:** Stores the distances between cities.
- **PheromoneMap:** Stores the amount of pheromone on the paths.
- **Ant:** Represents a single ant. This class is modified from the traditional algorithm to ensure each city is visited only once.
- **TspSolver:** The orchestrator of the optimizer; through it, constants, iterations, and the number of ants can be adjusted.

## 4. Testing and Parameter Selection

### Untested Classes

The classes PheromoneMap and DistanceMatrix were not included in unit tests since their sole purpose is data storage. Both implement simple and predictable logic, so explicit validation was deemed unnecessary. These classes serve as support structures representing two-dimensional pheromone and distance matrices, respectively.

### Testing the Ant Class

The Ant class was tested to ensure:

- The tour always starts and ends at city A.
- The size of the visited cities set (excluding the final return to city A) matches the total number of cities minus one.
- All cities are visited exactly once before returning to the starting point.

These validations ensure each ant generates a valid tour respecting problem constraints.

### Testing the TspSolver Class

Two main tests were performed:

1. **Tour Validity:** Confirming the `solve` method returns a route that includes all cities exactly once.
2. **Progressive Improvement of Solutions:** To evaluate if the algorithm improves over time, a simulation of 50 iterations of `solve` was designed, recording only the best distance obtained so far. Since `solve` resets internal optimizer state on each call, a simulation was created to manually accumulate the best results and check if the average best solution improves over time.

#### Parameter Selection

Using unit tests, results from multiple runs on randomly generated 10-city graphs (via the POST route `/tsp/generate-cities`) were logged.

From these runs, key algorithm parameters were adjusted:
- **`alpha`:** Increasing `alpha` (pheromone importance) too much caused the algorithm to get stuck in local minima.
- **`beta`:** Assigning higher weight to `beta` (visibility importance) yielded better solutions by favoring shorter paths early on.
- **`evaporateRate`:** A 0.2 evaporation rate produced more stable results, allowing older routes to gradually lose influence and encouraging exploration without completely forgetting previous paths.
- **`numAnts`:** To compensate for the high weight on `beta` and encourage more solution space exploration, the number of ants per iteration was increased.
- **`iterations`:** A moderate 50-cycle value was chosen since the algorithm can find near-optimal routes early on.

Final parameter settings:
- `alpha`: 1
- `beta`: 5
- `evaporateRate`: 0.2
- `numAnts`: 300
- `iterations`: 50

## 5. Possible Improvements

Several opportunities to extend and optimize the current solution were identified:

- **Parallelization per ant:** Since each ant’s tour is independent, running each ant in a separate thread or process is feasible.
- **Improved route visualization:** Currently, route results are delivered as numerical values. Real-time communication via WebSockets could be implemented to send iteration states to the frontend for better visualization.
- **Reinforcement of optimal routes:** The current algorithm does not add extra rewards for the best routes nor explicitly penalizes worse ones. Implementing positive reinforcement for shorter routes and penalties for longer routes could accelerate convergence to more efficient solutions.

## 6. Conclusion

The implemented ant colony algorithm showed good performance in scenarios with a small to moderate number of cities. Specifically:

- For 10 cities, the average response time was about 130 ms in a local environment.
- In tests with 100 cities, execution time increased to around 30 seconds, which remains acceptable for applications not requiring real-time response.

Additionally, the algorithm’s randomness helps prevent getting stuck in local minima, promoting better exploration of the solution space.
