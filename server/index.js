/* this file is a server which need to be run first then the client should send initialize request to start the game
if Node is clicked before the client initializing at start please refresh the client page to iniitalize the game 
after seeing /initialize Game Started in the node console the game is ready for playing*/
const util = require('util');
const express = require("express");
const PORT = 5000;
const app = express();
const cors = require("cors");
const {
    INITIALIZE,
    VALID_START_NODE,
    INVALID_START_NODE,
    VALID_END_NODE,
    INVALID_END_NODE,
    GAME_OVER,
} = require("./actions");
const { checkFirstValidNode, checkSecondValidNode, Game } = require("./app");

app.use(cors());
app.use(express.json());

// game is variable reference will handle the whole game and its state
let game;

// initializing the game state
app.get("/initialize", (req, res) => {
    console.log(req.url);
    console.log('Game Started');
    //start the game 
    game = new Game();
    res.json(INITIALIZE());
    res.end();
});

app.post("/node-clicked", (req, res) => {
    const { x, y } = req.body;
    if(game===undefined){
        console.log('Please refresh the page');
      }else{
    // checks and tracks if the client made a start Node call or end Node call
    if (game.firstCall === true) {

        //checking the start Node from client is valid 
        if (checkFirstValidNode(x, y, game)) {
            game.firstCall = false;
          
            console.log(`\n\n\n client clicked valid Start Node: ${x}, ${y}`,util.inspect(VALID_START_NODE(game.currentPlayer),false,null,true));
            console.log("\n\n\n current game state after 1st valid Node:",util.inspect(game,false,null,true));
            res.json(VALID_START_NODE(game.currentPlayer));
            res.end();
        } else {
     
            console.log(`client clicked Invalid Start Node: ${x}, ${y}`,util.inspect(INVALID_START_NODE(game.currentPlayer),false,null,true));
            res.json(INVALID_START_NODE(game.currentPlayer));
            res.end();
        }
    } else {
        //checking end Node from client is valid
        if (checkSecondValidNode(x, y, game)) {
            game.firstCall = true;
            const lastX = game.currentStartNode.x;
            const lastY = game.currentStartNode.y;
                // if no possible moves are remaining from StartNode and EndNode the next player wins
            if (game.totalRemainingMoves === 0) {
                console.log("\n\n\n Game Over");
                console.log(`\n\n\n client clicked valid End Node: ${x}, ${y}`,util.inspect(GAME_OVER(lastX, lastY, x, y, game.currentPlayer),false,null,true));
                console.log("\n\n\n current game state after Game Over:",util.inspect(game,false,null,true));
                res.json(GAME_OVER(lastX, lastY, x, y, game.currentPlayer));
                res.end();
            } else {
                console.log(`\n\n\n client clicked valid End Node: ${x}, ${y}`,util.inspect(VALID_END_NODE(lastX, lastY, x, y, game.currentPlayer),false,null,true));
                console.log("\n\n\n current game state after Valid End Node:",util.inspect(game,false,null,true));
                res.json(VALID_END_NODE(lastX, lastY, x, y, game.currentPlayer));
                res.end();
            }
        } else {
            game.firstCall = true;
            console.log(`\n\n\n client clicked Invalid End Node: ${x}, ${y}`,util.inspect(INVALID_END_NODE(game.currentPlayer),false,null,true));
            res.json(INVALID_END_NODE(game.currentPlayer));
            res.end();
        }
    }
}
});

app.post("/error", (req, res) => {
    console.log("error occured");
});


app.listen(PORT, () => {
    console.log(`game server is listening to ${PORT}`);
});