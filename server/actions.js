/* this file contains all the json response body which needs to be send to the client*/

const INITIALIZE = () => {
    return {
        msg: "INITIALIZE",
        body: {
            newLine: null,
            heading: "Player 1",
            message: "Awaiting Player 1's Move",
        },
    };
};


const VALID_START_NODE = (nextPlayer) => {
    return {
        msg: "VALID_START_NODE",
        body: {
            newLine: null,
            heading: `${nextPlayer}`,
            message: "Select a second node to complete the line.",
        },
    };
};


const INVALID_START_NODE = (currentPlayer) => {
    return {
        msg: "INVALID_START_NODE",
        body: {
            newLine: null,
            heading: `${currentPlayer}`,
            message: "Not a valid starting position.",
        },
    };
};


const VALID_END_NODE = (x1, y1, x2, y2, nextPlayer) => {
    return {
        msg: "VALID_END_NODE",
        body: {
            newLine: {
                start: {
                    x: x1,
                    y: y1,
                },
                end: {
                    x: x2,
                    y: y2,
                },
            },
            heading: `${nextPlayer}`,
            message: null,
        },
    };
};


const INVALID_END_NODE = (currentPlayer) => {
    return {
        msg: "INVALID_END_NODE",
        body: {
            newLine: null,
            heading: `${currentPlayer}`,
            message: "Invalid move!",
        },
    };
};


const GAME_OVER = (x1, y1, x2, y2, nextPlayer) => {
    return {
        msg: "GAME_OVER",
        body: {
            newLine: {
                start: {
                    x: x1,
                    y: y1,
                },
                end: {
                    x: x2,
                    y: y2,
                },
            },
            heading: "Game Over",
            message: `${nextPlayer} Wins!`,
        },
    };
};

module.exports = {
    INITIALIZE,
    VALID_START_NODE,
    INVALID_START_NODE,
    VALID_END_NODE,
    INVALID_END_NODE,
    GAME_OVER,
};