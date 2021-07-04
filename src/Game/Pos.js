
export default class Pos {

    constructor(x, y) {
        this.x = x
        this.y = y
        this.special = ""
    }

    setSpecial(x) {
        this.special = x
    }

    toString() {
        return "Pos: {X: " + this.x + " - Y: " + this.y + "}"
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

    searchStr() {
        return this.x.toString() + this.y.toString()
    }

    getFormattedPos() {
        return this.getGrid(this.x) + this.y
    }

}