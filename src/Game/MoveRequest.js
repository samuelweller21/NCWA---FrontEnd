
export default class MoveRequest {
    
    constructor(x, y, player) {
        this.x = x
        this.y = y
        this.player = player
    }

    toString() {
        return "X: " + this.x.toString() + " - Y: " + this.y.toString() + " - Player: " + this.player.toString()
    }

}