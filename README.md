# Pathfinding algorithm using BFS

A JS implementation of a pathfinding algorithm using BFS (Breadth First Search) and rendering with HTML Canvas. Complete stack:

- HTML
- JS (ES6)
- Webpack

## Implementation details

The position of each occupied position is stored in an object in the format below:

```
{
  '0,0': 'player',
  '1,1': 'tree',
  '10,10': 'tree',
  '11,7': 'tree',
}
```

Storing positions this way we obtain time complexity of O(1) for checking a position.

Clicking at any position of the canvas will invoke a breadth-first search algorithm from the start position to the new one outputting the shortest possible distance.

At each step the start position is updated making it possible to change the target at any time changing directions smoothly.

## Live Demo
https://pathfinding-adriano.herokuapp.com/

## Preview
<img src="captured.gif" alt="Pathfinding"/>