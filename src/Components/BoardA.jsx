import React from 'react'
import "./Board.css"

//This is the analysis version of the board

function getColorClassname(color) {
    if (color === "red") {
        return "squarefaintred justify-content-end"
    } else if (color === "green") {
        return "squarefaintgreen justify-content-end"
    } else if (color === "orange") {
        return "squarefaintorange justify-content-end"
    } else if (color === "yellow") {
        return "squarefaintyellow justify-content-end"
    }
}

function Square(props) {
    if (props.faint) {
        return (
        <button className = {getColorClassname(props.color)} onClick={props.onClick}> 
        {props.faintLabel}
        </button>
        )
    } else {
        return (
            <button className = "square justify-content-end" onClick={props.onClick}> 
            {props.label}
            </button>
        )
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
    //throw("Invalid square value " + square)
}

function getX(i) {
    return i % 3 
}

function getY(i) {
    return (i - (i % 3))/3
}

class BoardCompA extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            game: props.game,
            onClick: props.onClick
        }
        this.getFaint = this.getFaint.bind(this)
        this.getColor = this.getColor.bind(this)
        this.getTurnChar = this.getTurnChar.bind(this)
    }

    getFaint(i) {
        if (!this.props.draw) {
            return false
        }
        let x = getX(i)
        let y = getY(i)
        if (this.props.legals === null) {
            return false
        }
        if (this.props.legals.has(x.toString()+y.toString())) {
            return true 
        } else {
            return false
        }
    }

    getTurnChar(turn) {
        if (turn) {
            return "O"
        } else {
            return "X"
        }
    }

    getColor(i) {
        let x = getX(i)
        let y = getY(i)
        if (this.props.legals === null) {
            return null
        }
        if (this.props.legals.has(x.toString()+y.toString())) {
            let winner = this.props.legals.get(x.toString()+y.toString())
            if (winner === -1) {
                return "orange"
            } else if (winner === 1) {
                if (this.props.turn) {
                    return "green"
                } else {
                    return "red"
                }
            } else if (winner === 2) {
                if (this.props.turn) {
                    return "red"
                } else {
                    return "green"
                }
            }
        } else {
            return "yellow" //This should never be returned
        }
    }

    render() {
        return (
            <div className="justify-content-end">
                <div className="board-row justify-content-end">

                    <div className="labelsC">0 </div>

                    <Square color={this.getColor(0)} faint={this.getFaint(0)} faintLabel = {this.getTurnChar(this.props.turn)} label={getChar(this.props.game[0])} onClick={() => this.props.onClick(0)}></Square>

                    <Square color={this.getColor(1)} faint={this.getFaint(1)} faintLabel = {this.getTurnChar(this.props.turn)} label={getChar(this.props.game[1])} onClick={() => this.props.onClick(1)}></Square>

                    <Square color={this.getColor(2)} faint={this.getFaint(2)} faintLabel = {this.getTurnChar(this.props.turn)} label={getChar(this.props.game[2])} onClick={() => this.props.onClick(2)}></Square>

                </div>
                <div className="board-row justify-content-end">

                    <div className="labelsC">1 </div>

                    <Square color={this.getColor(3)} faint={this.getFaint(3)} faintLabel = {this.getTurnChar(this.props.turn)} label={getChar(this.props.game[3])} onClick={() => this.props.onClick(3)}></Square>

                    <Square color={this.getColor(4)} faint={this.getFaint(4)} faintLabel = {this.getTurnChar(this.props.turn)} label={getChar(this.props.game[4])} onClick={() => this.props.onClick(4)}></Square>

                    <Square color={this.getColor(5)} faint={this.getFaint(5)} faintLabel = {this.getTurnChar(this.props.turn)} label={getChar(this.props.game[5])} onClick={() => this.props.onClick(5)}></Square>

                </div>
                <div className="board-row justify-content-end">

                    <div className="labelsC">2 </div>

                    <Square color={this.getColor(6)} faint={this.getFaint(6)} faintLabel = {this.getTurnChar(this.props.turn)} label={getChar(this.props.game[6])} onClick={() => this.props.onClick(6)}></Square>

                    <Square color={this.getColor(7)} faint={this.getFaint(7)} faintLabel = {this.getTurnChar(this.props.turn)} label={getChar(this.props.game[7])} onClick={() => this.props.onClick(7)}></Square>

                    <Square color={this.getColor(8)} faint={this.getFaint(8)} faintLabel = {this.getTurnChar(this.props.turn)} label={getChar(this.props.game[8])} onClick={() => this.props.onClick(8)}></Square>

                </div>
                <div className="board-row justify-content-center">
                    <div className="board-pad"></div>
                    <div className="labelsR">a</div>
                    <div className="labelsR">b</div>
                    <div className="labelsR">c</div>
                </div>
            </div>
        )
    }

}

export default BoardCompA