import Game from "./Game.js"
import MoveRequest from "./MoveRequest.js"

export var gameTree = new Map()

export function bestMove(game, depth) {

    //I.e. -1 = perfect move
    if (depth === -1) {
        depth = 1000000
    }

    //Generate all legal moves
    let moveEvals = new Map()
    let legalMoves = game.legalMoves()

    for (let i = 0; i < legalMoves.length; i++) {

        //Generate some new games as to not mess with old ones
        let subEval = null
        let gameTreeGame = new Game()
        gameTreeGame.setAs(game)
        gameTreeGame.moveEasy(legalMoves[i].x, legalMoves[i].y)

        //First check database else do manual check
        let dbCheck = databaseCheck(gameTreeGame)

        if (dbCheck !== null) {
            subEval = dbCheck
        } else {
            subEval = AIeval(game, 
                new MoveRequest(legalMoves[i].x, legalMoves[i].y, game.turn ? 1 : 2),
                depth-1, true)
        }

        //Add to moveEvals map
        moveEvals.set(legalMoves[i], subEval)
        
        //Adding to gametree
        //We don't add any permutations, we always check for permutations
        gameTree.set(gameTreeGame.generateHash(), subEval)

    }

    //Depending on whos turn it is pick the min or max from this list
    
    let moveRandomiser = []

    //First try and get eval equal to your number
    for (let pos of moveEvals.keys()) {
        let value = moveEvals.get(pos)
        let evaluation = game.turn ? 1 : 2
        if (value === evaluation) {
            moveRandomiser.push(pos)
        }
    }
    if (moveRandomiser.length > 0) {
        return moveRandomiser[Math.floor(Math.random()*moveRandomiser.length)]
    }

    moveRandomiser = []

    //Then look for draws
    for (let pos of moveEvals.keys()) {
        if (moveEvals.get(pos) === -1) {
            moveRandomiser.push(pos)
        }
    }
    if (moveRandomiser.length > 0) {
        return moveRandomiser[Math.floor(Math.random()*moveRandomiser.length)]
    }

    moveRandomiser = []

    //Then look for unknown (only possible when there's a depth issue)
    for (let pos of moveEvals.keys()) {
        if (moveEvals.get(pos) === 0) {
            moveRandomiser.push(pos)
        }
    }
    if (moveRandomiser.length > 0) {
        return moveRandomiser[Math.floor(Math.random()*moveRandomiser.length)]
    }

    moveRandomiser = []

    //If nothing else then just return a losing move
    for (let pos of moveEvals.keys()) {
        moveRandomiser.push(pos)
    }
    if (moveRandomiser.length > 0) {
        return moveRandomiser[Math.floor(Math.random()*moveRandomiser.length)]
    }

    return null

}

export function databaseCheck(game) {

    //This function will check for all permutations of game board state (rotations etc) in a database
    //Nb. it assumes the existence of a global map 'gameTree'

    //First generate all hashes
    let hashes = game.board.generateAllHashes()
    for (let i = 0; i < hashes.length; i++) {

        //If it's in the game tree then then return it
        if (gameTree.has(hashes[i])) {
            return gameTree.get(hashes[i])
        }
    }

    //Else return null to be handled
    return null

}

export function AIeval(game, move, depth, add) {

    //This function returns the board state after the move passed is added to the game
    //If depth reaches 0 it will return 0
    //If add it will add it to a global variable 'gameTree'

    //Make a copy so we don't mess with the one passed to fn
    let newGame = new Game()
    newGame.setAs(game)

    //If we are at depth then return unknown
    if (depth > 0) {

        //Make move passed
        newGame.moveByRequest(move)

        //If that generates a winner then that's just the board eval
        if (newGame.winner !== 0) {
            return newGame.winner
        } else {

            //Otherwise we need to evaluate all sub moves
            let moveEvals = new Map()
            let legalMoves = newGame.legalMoves()

            //Evaluate each move            
            for (let i = 0; i < legalMoves.length; i++) {

                //Generate some new games as to not mess with old ones
                let subEval = null
                let gameTreeGame = new Game()
                gameTreeGame.setAs(newGame)
                gameTreeGame.moveEasy(legalMoves[i].x, legalMoves[i].y)

                //First check database else do manual check
                let dbCheck = databaseCheck(gameTreeGame)
                if (dbCheck !== null) {
                    subEval = dbCheck
                } else {
                    subEval = AIeval(newGame, 
                        new MoveRequest(legalMoves[i].x, legalMoves[i].y, move.player === 1 ? 2 : 1),
                        depth-1, true)
                }

                //Add to moveEvals map
                moveEvals.set(legalMoves[i], subEval)

                //Adding to gametree
                if (add) {
                    //We don't add any permutations, we always check for permutations
                    gameTree.set(gameTreeGame.generateHash(), subEval)
                }

            }

            //First try and get eval equal to your number
            for (let pos of moveEvals.keys()) {
                let value = moveEvals.get(pos)
                let evaluation = newGame.turn ? 1 : 2
                if (value === evaluation) {
                    return moveEvals.get(pos)
                }
            }

            //Then look for draws
            for (let pos of moveEvals.keys()) {
                if (moveEvals.get(pos) === -1) {
                    return -1
                }
            }

            //Then look for unknown (only possible when there's a depth issue)
            for (let pos of moveEvals.keys()) {
                if (moveEvals.get(pos) === 0) {
                    return 0
                }
            }

            //If nothing else then just return a losing move
            for (let pos of moveEvals.keys()) {
                return moveEvals.get(pos)
            }
        }
    } else {
        //If we run out of depth then return 0
        return 0
    }

}
