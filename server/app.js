/* this file contains all the logic, algoithm for the game and its classes and methods */

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Game {
  constructor() {
    // this array keeps track of vistedNodes default 0 which is unvisited and sets 1 after it visits. 
    this.visited = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    /* it keeps the calculated possible current moves of currentStartNode for checking currentEndNode is Valid or not 
     updates after every checkFirstValidNode function*/
    this.possibleCurrentNodeMoves = [];

    // is used to determine if the called for setting the currentStartNode or currentEndNode
    this.firstCall = true;

    // keeps track which players turn is going on
    this.currentPlayer = Player.one;

    // is the very first Valid Node which is set and will be updated on valid moves
    this.startNode = null;

    // is the very Second Valid Node which is set and will be updated on valid moves
    this.endNode = null;

    // is any first Valid Node and will be updated on valid moves
    this.currentStartNode = null;

    // is any second Valid Node and will be updated on valid moves
    this.currentEndNode = null;

    // this array will keep tack all the edges of the Nodes called
    this.edges = [];

    /* this array will keep tack of all the possible moves from startNode and EndNode for the next player 
     updates after ever checkSecondValidNode function*/
    this.totalRemainingMoves = Number.MAX_VALUE;
  }

  setStartNode(x, y) {
    this.startNode = new Node(x, y);
  }

  setCurrentStartNode(x, y) {
    this.currentStartNode = new Node(x, y);
  }
  setCurrentEndNode(x, y) {
    this.currentEndNode = new Node(x, y);
  }

  setEndNode(x, y) {
    this.endNode = new Node(x, y);
  }

  setVisited(x, y) {
    this.visited[x][y] = 1;
  }
}

const Player = {
    one: `Player 1`,
    two: `Player 2`,
  };


// this swiches the player turns
function switchPlayer(game) {
  if (game.currentPlayer === Player.one) {
    game.currentPlayer = Player.two;
  } else {
    game.currentPlayer = Player.one;
  }
}

// this updates the real start and end nodes in the game state
function updateStartAndEndNodes(game) {
  if (game.currentStartNode.x === game.startNode.x && game.currentStartNode.y === game.startNode.y) {
    game.startNode = game.currentEndNode;
  } else if (game.currentStartNode.x === game.endNode.x && game.currentStartNode.y === game.endNode.y) {
    game.endNode = game.currentEndNode;
  }
}

// this sets start and end nodes as visited in visited array
function updateVisitedStartAndEndNodes(game) {
  game.setVisited(game.currentStartNode.x, game.currentStartNode.y);
  game.setVisited(game.currentEndNode.x, game.currentEndNode.y);
}



// checking for first client node is valid 
function checkFirstValidNode(a, b, game) {
 
  if (game.endNode === null) {
    game.setStartNode(a, b);
    game.setCurrentStartNode(a, b);
    // calculating the possible moves from this starting valid Node
    game.possibleCurrentNodeMoves = findValidMoves(game.currentStartNode,game.visited,game.edges);
    return true;
  } else if ((game.startNode.x === a && game.startNode.y === b) || (game.endNode.x === a && game.endNode.y === b)) {
    game.setCurrentStartNode(a, b);
     // calculating the possible moves from this starting valid Node
    game.possibleCurrentNodeMoves = findValidMoves(game.currentStartNode,game.visited,game.edges);
    return true;
  } else {
    return false;
  }
}


// checks for the second cliend Node is valid
function checkSecondValidNode(a, b, game) {
  if (game.endNode === null) {
    if (isValidNodeMoveAndUpdateVisitedAndEdges(a, b, game)) {
      game.setEndNode(a, b);
      game.setCurrentEndNode(a, b);
      switchPlayer(game);
      // console.log("first end");
      updateVisitedStartAndEndNodes(game);
      return true;
    } else {
      return false;
    }
  } else if ((game.startNode.x === a && game.startNode.y === b) || (game.endNode.x === a && game.endNode.y === b)) {
    return false;
  } else if (isValidNodeMoveAndUpdateVisitedAndEdges(a, b, game)) {
    // console.log("second node is valid");
    game.setCurrentEndNode(a, b);
    switchPlayer(game);
    // console.log("sencond end");
    updateVisitedStartAndEndNodes(game);
    updateStartAndEndNodes(game);
    findTotalReaminingMoves(game);
    return true;
  } else {
    return false;
  }
}



function isValidNodeMoveAndUpdateVisitedAndEdges(a, b, game) {
  let isValidNode = false;
  // this loop check for the client move matches with any possible valid moves
  for (let nodeMove of game.possibleCurrentNodeMoves) {
    if (nodeMove.validNode.x === a && nodeMove.validNode.y === b) {
      // this block will run when the above conditon meets the second move made by the client is valid   
      isValidNode = true;
      
    //   console.log("Dependancy List", nodeMove.dependencyNodes.length);
       /* the below code will update the visited array except the current Start Node and current End node  
        also updates all the edges and its dependancy edges array including start node and end node i.e it 
        the start node , dependancy node is an edge and dependancy node , end node is an edge 
        ***start node , end node is an edge only if there are no dependacy nodes in between */
      let dependancyLength = nodeMove.dependencyNodes.length;
      if (dependancyLength === 0) {
        game.edges.push([{ x: game.currentStartNode.x, y: game.currentStartNode.y },{ x: a, y: b },]);
      } 
      else if (dependancyLength === 1) {
        game.edges.push([{ x: game.currentStartNode.x, y: game.currentStartNode.y },{ x: nodeMove.dependencyNodes[0].x, y: nodeMove.dependencyNodes[0].y }]);
        game.visited[nodeMove.dependencyNodes[0].x][nodeMove.dependencyNodes[0].y] = 1;
        game.edges.push([{ x: nodeMove.dependencyNodes[0].x, y: nodeMove.dependencyNodes[0].y },{ x: a, y: b }]);
      } 
      else if (dependancyLength > 1) {
        // console.log("dependency edge visited >1");
        game.edges.push([{ x: game.currentStartNode.x, y: game.currentStartNode.y },{ x: nodeMove.dependencyNodes[0].x, y: nodeMove.dependencyNodes[0].y }]);
        game.visited[nodeMove.dependencyNodes[0].x][nodeMove.dependencyNodes[0].y] = 1;

        for (let d = 1; d < dependancyLength; d++) {
            game.edges.push([{ x: nodeMove.dependencyNodes[d - 1].x, y: nodeMove.dependencyNodes[d - 1].y},{ x: nodeMove.dependencyNodes[d].x, y: nodeMove.dependencyNodes[d].y }]);
            game.visited[nodeMove.dependencyNodes[d].x][nodeMove.dependencyNodes[d].y] = 1;
        }
        game.edges.push([{x: nodeMove.dependencyNodes[dependancyLength - 1].x,y: nodeMove.dependencyNodes[dependancyLength - 1].y,}, { x: a, y: b }]);
      }

      break;
    }
    
  }
  return isValidNode;
}


// this function will update total Remaining moves left for the next player after client clicks a valid second Node 
function findTotalReaminingMoves(game) {
  let total = Number.MAX_VALUE;
  let totalStartMoves = findValidMoves(game.startNode, game.visited, game.edges);
  let totalEndMoves = findValidMoves(game.endNode, game.visited, game.edges);
  total = totalStartMoves.length + totalEndMoves.length;
  game.totalRemainingMoves = total;
}



// matrix size (N X N)
const N = 4;


// possible directions for the currentNode are north, northeast, east, southeast, south, southwest, west, northwest
const possibleDirections = [
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: -1, y: -1 },
];


// matrix boundaries
const [xMin, yMin, xMax, yMax] = [0, 0, N - 1, N - 1];




// helper function used by findValidMoves to check if the current Node move has edges to its adjacent nodes which it should not pass through 
// return true if it passes else returns false
function checkEdge(a1,b1,a2,b2,edges){
    for (let edge of edges) {
        let vertex1 = edge[0];
        let vertex2 = edge[1];
        if ((vertex1.x === a1 && vertex1.y === b1 && vertex2.x === a2 && vertex2.y === b2) || (vertex1.x === a2 && vertex1.y === b2 && vertex2.x === a1 && vertex2.y === b1)) {
        return true;
        }
      }
    return false;
}

/***********  main algorithm to find and return the all possible valid moves from the current node *************/
function findValidMoves(node, arr, edges) {

    //here currentNode is the node provided for searching its possible moves 
  let currentNode = { x: node.x, y: node.y };

    //inTransitNodes is an array which keeps the track of all the nodes it pass through to reach the valid Node moves
  let inTransitNodes = [];

    //validMoves keep all the valid moves for the currentnode and its dependancies those are inTransistNodes for the current valid Node move
  let validMoves =[];  

    for(let k=0;k<8;k++){
    let direction = possibleDirections[k];
    let a = currentNode.x + direction.x;
    let b = currentNode.y + direction.y;
    inTransitNodes = [];

    // this while loop checks for  the boundaries and checks if the current possible node move is not already visited
    label: while (a >= xMin && a <= xMax &&b >= yMin && b <= yMax && arr[a][b] !== 1) {
    

        /*this if block checks for the current possible node move is not made by passing through any existing edges
        if it is passing an existing edges then it breaks the while loop with label and move froward with next direction
         think that move has already made check if the there are any ajacent valid nodes to this node */
      if (k % 2 !== 0 && a >= xMin && a <= xMax && b >= yMin && b <= yMax && arr[a][b] !== 1) {
        
        /* k===1 this move was made towards northeast and need to check if there is an edge cases between its west and south adjacent Nodes  */
        if (k === 1) {  
          let a1 = a - 1;
          let b1 = b;
          let a2 = a;
          let b2 = b + 1;
          if (a1 >= xMin && a2 >= xMin && b1 <= yMax && b2 <= yMax && checkEdge(a1,b1,a2,b2,edges)) {
            break label;
          }
        }
         /* k===3 this move was made towards southeast and need to check if there is an edge cases between its north and west adjacent Nodes  */
        else if (k === 3) {
          let a1 = a;
          let b1 = b - 1;
          let a2 = a - 1;
          let b2 = b;
          if (a1 >= xMin && a2 >= xMin && b1 <= yMax && b2 <= yMax && checkEdge(a1,b1,a2,b2,edges)) {

            break label;
          }

        } 
       /* k===5 this move was made towards southwest and need to check if there is an edge cases between its north and east adjacent Nodes  */
        else if (k === 5) {
          let a1 = a;
          let b1 = b - 1;
          let a2 = a + 1;
          let b2 = b;
          if (a1 >= xMin && a2 >= xMin && b1 <= yMax && b2 <= yMax && checkEdge(a1,b1,a2,b2,edges)) {
            break label;
          }
        } 
        /* k===7 this move was made towards northwest and need to check if there is an edge cases between its east and south adjacent Nodes  */
        else if (k === 7) {
          let a1 = a + 1;
          let b1 = b;
          let a2 = a;
          let b2 = b + 1;
          if (a1 >= xMin && a2 >= xMin && b1 <= yMax && b2 <= yMax && arr && checkEdge(a1,a2,b1,b2,edges)) {
                break label;
          }
        }
      }
      /* if there are no edges in between the current move the algo will move further in this direction
          and count this current Node move as valid Node move
          adds this valid Node move to the ValidMoves array and attaches 
          the dependancyNodes  array though which it has traversed if they exist.*/
        validMoves.push({validNode: { x: a, y: b },dependencyNodes: [...inTransitNodes]});
        // inTransitNodes keep the track of the dependancy Nodes for next Valid Node search in this direction.
        inTransitNodes.push({ x: a, y: b });
        a += direction.x;
        b += direction.y;
   
    }
  }
  return validMoves;
}


module.exports = { checkFirstValidNode, checkSecondValidNode, Game };