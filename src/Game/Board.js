export default class Board {

    constructor() {
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    getIndex(x, y) {
		//2d array form to 1d array
        return 3*y + x
    }

	onlyUnique(value, index, self) {
		//Helper for generateAllHashes (for filtering)
		return self.indexOf(value) === index
	}

	generateHash() {
		//Return a unique hash to look up a unique board
		return (this.board[0].toString()
		+ this.board[1].toString()
		+ this.board[2].toString()
		+ this.board[3].toString()
		+ this.board[4].toString()
		+ this.board[5].toString()
		+ this.board[6].toString()
		+ this.board[7].toString()
		+ this.board[8].toString())
	}

	generateAllHashes() {

		//For each of the 4 rotations return as is, TP, LR and TPLR
		let hashes = []
		let newBoard = new Board()
		newBoard.board = this.board

		//All 4 rotations
		for (let r = 0; r < 4; r++) {
			for (let i = 0; i < r; i++) {
				newBoard = newBoard.rotate()
			}
			hashes.push(newBoard.generateHash())
		}

		//All 4 symmetries
		hashes.push(newBoard.swapLR().generateHash())
		hashes.push(newBoard.swapTB().generateHash())
		hashes.push(newBoard.swapLD().generateHash())
		hashes.push(newBoard.swapBD().generateHash())

		//Filter (unsure if any speed improvement)
		hashes = hashes.filter(this.onlyUnique)

		//Return
		return hashes
	}

	swapLD() {
		//Returns a board with leading diag swapping
		let newBoard = new Board()
		newBoard.board[0] = this.board[8]
		newBoard.board[1] = this.board[5]
		newBoard.board[2] = this.board[2]
		newBoard.board[3] = this.board[7]
		newBoard.board[4] = this.board[4]
		newBoard.board[5] = this.board[1]
		newBoard.board[6] = this.board[6]
		newBoard.board[7] = this.board[3]
		newBoard.board[8] = this.board[0]
		return newBoard
	}

	swapBD() {
		//Returns a board with leading diag swapping
		let newBoard = new Board()
		newBoard.board[0] = this.board[0]
		newBoard.board[1] = this.board[3]
		newBoard.board[2] = this.board[6]
		newBoard.board[3] = this.board[1]
		newBoard.board[4] = this.board[4]
		newBoard.board[5] = this.board[7]
		newBoard.board[6] = this.board[2]
		newBoard.board[7] = this.board[5]
		newBoard.board[8] = this.board[8]
		return newBoard
	}

	swapLR() {
		//Returns a board with left col and right col swapped
		let newBoard = new Board()
		newBoard.board[0] = this.board[2]
		newBoard.board[1] = this.board[1]
		newBoard.board[2] = this.board[0]
		newBoard.board[3] = this.board[5]
		newBoard.board[4] = this.board[4]
		newBoard.board[5] = this.board[3]
		newBoard.board[6] = this.board[8]
		newBoard.board[7] = this.board[7]
		newBoard.board[8] = this.board[6]
		return newBoard
	}

	swapTB() {
		//Returns a board with top row and bottom row swapped
		let newBoard = new Board()
		newBoard.board[0] = this.board[6]
		newBoard.board[3] = this.board[3]
		newBoard.board[6] = this.board[0]
		newBoard.board[1] = this.board[7]
		newBoard.board[4] = this.board[4]
		newBoard.board[7] = this.board[1]
		newBoard.board[2] = this.board[8]
		newBoard.board[5] = this.board[5]
		newBoard.board[8] = this.board[2]
		return newBoard
	}

	rotate() {
		//Returns a board rotated 90 deg
		let newBoard = new Board()
		newBoard.board[0] = this.board[6]
		newBoard.board[1] = this.board[3]
		newBoard.board[2] = this.board[0]
		newBoard.board[3] = this.board[7]
		newBoard.board[4] = this.board[4]
		newBoard.board[5] = this.board[1]
		newBoard.board[6] = this.board[8]
		newBoard.board[7] = this.board[5]
		newBoard.board[8] = this.board[2]
		return newBoard
	}

    move(x, y, player) {

		//Health checks
		if (typeof(x) === 'undefined') {
			throw(new Error("Tried to move undefined"))
		}
		if (typeof(y) === 'undefined') {
			throw(new Error("Tried to move undefined"))
		}
		if (typeof(player) === 'undefined') {
			throw(new Error("Tried to move undefined"))
		}
        if (x > 2 || y > 2) {
			console.log("You must make a move on the this.board");
			return false;
		}
		if (x < 0 || y < 0) {
			console.log("You must make a move on the this.board");
			return false;
		}
        var index = this.getIndex(x,y)
		
		//Check if the square is occupied, else play the move
        if (this.board[index] !== 0) {
            console.log("Warning - " + getChar(player) + " tried to play at " + x + " , " + y + " but there is already an " + getChar(this.board[index]) + " there")
        } else {
            this.board[index] = player
            return true
        }
    }

    winner() {

		//Checking 1 and 2 for winners
        var test = 1
        for (test = 1; test < 3; test++) {
            if ((this.board[this.getIndex(0,0)] === test) && (this.board[this.getIndex(1,0)] === test) && (this.board[this.getIndex(2,0)] ===test)) {
				return test;
			} else if (this.board[this.getIndex(0,1)] === test && this.board[this.getIndex(1,1)] === test && this.board[this.getIndex(2,1)] ===test) {
				return test;  
			} else if (this.board[this.getIndex(0,2)] === test && this.board[this.getIndex(1,2)] === test && this.board[this.getIndex(2,2)] ===test) {
				return test;  
			} else if (this.board[this.getIndex(0,0)] === test && this.board[this.getIndex(0,1)] === test && this.board[this.getIndex(0,2)] ===test) {
				return test;  
			} else if (this.board[this.getIndex(1,0)] === test && this.board[this.getIndex(1,1)] === test && this.board[this.getIndex(1,2)] ===test) {
				return test;  
			} else if (this.board[this.getIndex(2,0)] === test && this.board[this.getIndex(2,1)] === test && this.board[this.getIndex(2,2)] ===test) {
				return test;  
			} else if (this.board[this.getIndex(0,0)] === test && this.board[this.getIndex(1,1)] === test && this.board[this.getIndex(2,2)] ===test) {
				return test;  
			} else if (this.board[this.getIndex(0,2)] === test && this.board[this.getIndex(1,1)] === test && this.board[this.getIndex(2,0)] ===test) {
				return test;
			}

        }

        //Is this.board full -> Draw
		var counter = 0;
		var i,j = 0;
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				if (this.board[this.getIndex(i,j)] === 0) {
					counter++;
					break;
				}
			}
			if (counter !== 0) {
				break;
			}
		}
		if (counter === 0) {
			return -1;
		}
		 
		//No winner
		return 0;
    } 

    print() {
		console.log("/-----------\\");
		console.log("| " + getChar(this.board[0]) + " | " + getChar(this.board[1]) + " | " + getChar(this.board[2]) + " |");
		console.log("| " + getChar(this.board[3]) + " | " + getChar(this.board[4]) + " | " + getChar(this.board[5]) + " |");
		console.log("| " + getChar(this.board[6]) + " | " + getChar(this.board[7]) + " | " + getChar(this.board[8]) + " |");
		console.log("\\-----------/");
    }

}

function getChar(square) {
    if (square === 0) {
        return " "
    } else if (square === 1) {
        return "O"
    } else if (square === 2) {
        return "X"
    } 
    throw(new Error("Invalid square value " + square))
}