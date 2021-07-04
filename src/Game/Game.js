import Board from "./Board.js"
import Pos from "./Pos.js"
import {bestMove} from "./AI.js"

var IDcounter = 10000001

export default class Game {

    constructor() {
        this.id = IDcounter
        IDcounter++
        this.turn = true
        this.board = new Board()
        this.winner = 0
		this.moveHistory = []
		this.special = ""
    }

	getChar(square) {
		if (square === 0) {
			return " "
		} else if (square === 1) {
			return "O"
		} else if (square === 2) {
			return "X"
		} 
		throw(new Error("Invalid square value " + square))
	}

    setAs(game) {
        this.id = game.id
        this.turn = game.turn
		this.board = new Board()
		for (var i = 0; i < 9; i++) {
			this.board.board[i] = game.board.board[i]
		}
        this.winner = this.board.winner()
    }

    moveByRequest(move) {
        this.move(move.x, move.y, move.player)
    }

    getIndex(x, y) {
        return 3*y + x
    }

	getX(i) {
		return i % 3 
	}

	getY(i) {
		return (i - (i % 3))/3
	}

	getFirstCol(i) {
		if (2*i-2 >= this.moveHistory.length) {
			return null
		} else {
			return (this.moveHistory[2*i-2])
		}
	}

	getSecondCol(i) {
		if (2*i-1 >= this.moveHistory.length) {
			return null
		} else {
			return (this.moveHistory[2*i-1])
		}
	}

    moveEasy (x, y) {
        this.move(x, y, this.turn ? 1 : 2)
    }

	movePos(pos) {
		this.moveEasy(pos.x, pos.y)
	}

    move(x, y, p) {
		//this.printHistory()
        if (p === 1 && !this.turn) {
			console.log("It's X's turn");
			return false;
		} else if (p === 2 && this.turn) {
			console.log("It's O's turn");
			return false;
		} else {
			if (this.board.move(x, y, p)) {
				this.turn = !this.turn;
				var pos = new Pos(x,y)
				this.winner = this.board.winner();
				if (this.winner === -1) {
					pos.setSpecial("=")
					this.moveHistory.push(pos);
				} else if (this.winner !== 0) {
					pos.setSpecial("#")
					this.moveHistory.push(pos);
				} else {
					this.moveHistory.push(pos);
				}
				return true;
			} else {
				return false;
			}
		}
    }

	winner() {
		this.winner = this.board.winner()
	}

    toString() {
		console.log(this.board.board)
		console.log("{");
		console.log("Game of Noughts and Crosses!");
		console.log("");
		console.log("Id: " + this.id.toString());
		console.log("Turn: " + this.turn.toString());
        console.log("Winner: " + this.winner.toString())
		console.log("Board:");
		console.log("/-----------\\");
		console.log("| " + this.getChar(this.board.board[0]) + " | " + this.getChar(this.board.board[1]) + " | " + this.getChar(this.board.board[2]) + " |");
		console.log("| " + this.getChar(this.board.board[3]) + " | " + this.getChar(this.board.board[4]) + " | " + this.getChar(this.board.board[5]) + " |");
		console.log("| " + this.getChar(this.board.board[6]) + " | " + this.getChar(this.board.board[7]) + " | " + this.getChar(this.board.board[8]) + " |");
		console.log("\\-----------/");
		console.log("}");
    }

    legalMoves() {
        var legalMoves = [];
		var i, j = 0
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				if (this.board.board[this.getIndex(i,j)] === 0) {
					legalMoves.push(new Pos(i,j));
				}
			}
		}
		
		if (legalMoves.length === 0) {
			return null;
		} else {
			return legalMoves;
		}
    }

	strictlegalMoves() {
		if (this.winner !== 0) {
			return null
		} else {
			var legalMoves = [];
			var i, j = 0
			for (i = 0; i < 3; i++) {
				for (j = 0; j < 3; j++) {
					if (this.board.board[this.getIndex(i,j)] === 0) {
						legalMoves.push(new Pos(i,j));
					}
				}
			}
			
			if (legalMoves.length === 0) {
				return null;
			} else {
				return legalMoves;
			}
		}
    }

    randomComputerMove() {
        //Get legal moves
		var legalMoves = this.legalMoves();
		if (legalMoves === null) {
			return false;
		}
		var r = Math.floor(Math.random()*legalMoves.length)
		//Choose random move from legal moves
		var move = legalMoves[r];
		//Make chosen move
		this.move(move.x, move.y, this.turn ? 1 : 2);
		return true;
    }

	AIMove(depth) {
		this.movePos(bestMove(this, depth))
	}

	mediumComputerMove() {
		this.AIMove(2)
	}

	perfectComputerMove() {
		this.AIMove(-1)
	}

	generateHash() {
		return (this.board.board[0].toString()
		+ this.board.board[1].toString()
		+ this.board.board[2].toString()
		+ this.board.board[3].toString()
		+ this.board.board[4].toString()
		+ this.board.board[5].toString()
		+ this.board.board[6].toString()
		+ this.board.board[7].toString()
		+ this.board.board[8].toString())
	}

	getGrid(n) {
		if (n===0) {
			return 'a'
		} else if (n===1) {
			return 'b'
		} else if (n===2) {
			return 'c'
		} else {
			console.log("Incorrect pos in getGrid")
		}
	}

	printHistory() {
		var i = this.moveHistory.length
		var row = 1
		while (i > 1) {
			console.log(row + " - " + this.getGrid(this.moveHistory[this.moveHistory.length-i].x) + (this.moveHistory[this.moveHistory.length-i].y+1) + " , " + this.getGrid(this.moveHistory[this.moveHistory.length-i+1].x) + (this.moveHistory[this.moveHistory.length-i+1].y+1))
			row++
			i = i - 1
			i = i - 1
		}
		while (i > 0) {
			console.log(row + " - " + this.getGrid(this.moveHistory[this.moveHistory.length-i].x) + (this.moveHistory[this.moveHistory.length-i].y+1))
			i = i - 1
		}
		console.log("---------")
	}

	getHistory() {
		let str = ""
		var i = this.moveHistory.length
		var row = 1
		while (i > 1) {
			str = str + row + "  " + this.getGrid(this.moveHistory[this.moveHistory.length-i].x) + (this.moveHistory[this.moveHistory.length-i].y+1) + "  " + this.getGrid(this.moveHistory[this.moveHistory.length-i+1].x) + (this.moveHistory[this.moveHistory.length-i+1].y+1) + (this.moveHistory[this.moveHistory.length-i+1].special) + "\n"
			row++
			i = i - 1
			i = i - 1
		}
		while (i > 0) {
			str = str + row + "  " + this.getGrid(this.moveHistory[this.moveHistory.length-i].x) + (this.moveHistory[this.moveHistory.length-i].y+1) + (this.moveHistory[this.moveHistory.length-i].special) + "\n"
			i = i - 1
		}
		return str
	}

	getTicksBack(pos) {
		//Returns number of ticks need to be undone to get to passed pos
		let index = this.getHistoryPos(pos)
		return this.moveHistory.length - index - 1
	}

	getHistoryPos(pos) {
		//First generate a string array (searchable and unique)
		var strHist = []
		for (let i = 0; i < this.moveHistory.length; i++) {
			strHist[i] = this.moveHistory[i].searchStr()
		}
		return strHist.indexOf(pos.searchStr())

	}

}