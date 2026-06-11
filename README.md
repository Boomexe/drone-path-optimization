# Drone Path Optimizer Demo
A web-based drone route planner to generate the most efficient 3D path within urban environments through obstacles.

This project models buildings as 2D polygon footprints with heights (2.5D) and generates a waypoint map that uses A* to generate the shortest path between two positions that respects altitude limits and obstacle clearance.

## Features
- Generates offset waypoints (nodes) around obstacle vertices
- 3D graph edge generation between waypoints
- Supports altitude for ground-level and elevated flight over obstacles
- Rejects edges that collide with obstacles
- A* search with binary heap priority optimization
- Inputs can be lat/long, which gets automatically normalized to local coordinates, or xyz.
- GeoJSON building data (gathered via [overpass-turbo](https://overpass-turbo.eu)) to obstacle maps
- Includes 17 test cases
- Optimized to handle 200-400 obstacles in 1-4 seconds

## Research / Background
This project takes a visibility graph approach (as opposed to a grid). This is so we can create a smaller set of important nodes around obstacles instead of considering every important location in space. Then, the search algorithm must search through a graph to find the optimal path.

The search algorithm used in this project to find the shortest path through the graph is A*. A* combines an actual cost travelled with a heuristic estimate of the distance to the destination. This project measures both the cost and heuristic off of 3D distance.

## Algorithm
[One of the main limitations of A* is its restriction to paths only along grid lines or discrete headings, which is what Theta* aims to improve upon.](https://news.movel.ai/theta-star?x-host=news.movel.ai)
[<img width="1700" height="534" alt="image" src="https://github.com/user-attachments/assets/8d5c2619-4337-439e-a029-ba0d232ae20a" />](https://news.movel.ai/theta-star?x-host=news.movel.ai)
This restriction to neighboring grid cells often causes A* to not generate a true shortest path. Theta* helps solve this by checking whether a node can connect directly to an ancestor node, which allows for smooth any-angle paths.

Because this project does not restrict the path to a grid, it does not run into many of the issues conventional A* might face. It instead generates a visibility graph from nodes and then runs A* on the generated graph. Each edge in the graph is already a valid straight-line flight path between two visible nodes. Because of this, this planner already achieves the main benefit of Theta*: unrestricted angle movement. This implementation is still technically A*, however. Theta* creates line-of-sight shortcuts dynamically during a search when limited to a grid, but this project precomputes all the valid visible edges before the search begins.

## Performance Notes
The most expensive part of this planner is generating valid non-colliding edges. A* generally only took up 2% of the runtime cost, while edge generation took the other 98%. This is because edge generation scaled quadratically as nodes increased. While A* finished in under 200ms on the most expensive test case, generating the edges took 4.3 seconds. Therefore, most efforts went into optimizing the generation of edges.

Current optimizations include:
- Pruning long edges that do not contain the start/end node. Currently, I am removing edges with a length >200, which is an arbitrary value that still allows for precise results.
- Precomputing obstacle bounding boxes
- Skipping polygon collision checks when bounding boxes don't overlap.
- Several micro optimizations (like reducing sqrt calculations and instanced objects)
- Simplified height node generation
- Conservative height check for diagonal edges
- Heap optimization for A* (which reduced A* time greatly but not really overall)

Possible future optimizations:
-  Prune nodes that are greater than a specific distance away from the straight line from the origin to the destination (corridor).
-  Lazy edge generation during A*
-  Better obstacle collision checks.

## Current Limitations:
- The current height check for diagonal edges is conservative when one node is outside of the obstacle and another node is above the obstacle. Instead of checking of theres any point along the diagonal edge that clips into the height of the polygon (which would probably require some expensive lerp function to test N points on each diagonal edge that satisfies the requirements), this simply checks if both nodes clear the height. If both nodes clear the height, then we know for sure that it won't hit the obstacle. However, even if the drone has a chance of running through the height of an obstacle, we immediately discard it to save on time.
- The drone is modelled as a point and doesn't account for all real-world flight constraints.
- Edge length for edges not directly linked to the start and end is capped at MAX_EDGE_COST for performance.
- True cost calculations are not taken into account. Here, cost is directly linked to distance, which doesn't account for the fact that horizontal movement, climbing, and falling may all have different time/energy-costs.

## Useful Links
- [Sebastian Lague A* pathfinding in Unity tutorial](https://www.youtube.com/playlist?list=PLFt_AvWsXl0cq5Umv3pMC9SPnKjfp9eGW)
- [Overpass Turbo](https://overpass-turbo.eu) (for getting building GeoJson)
- [Simple A* Explaination](https://www.youtube.com/watch?v=qigPctCgR_k)
- [Theta* Comparison](https://news.movel.ai/theta-star?x-host=news.movel.ai)
