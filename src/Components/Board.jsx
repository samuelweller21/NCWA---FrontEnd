import React from 'react'
import "./Board.css"

function Square(props) {
    return (
        <button className = "square justify-content-end" onClick={props.onClick}> 
        {props.label}
        </button>
    )
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

class BoardComp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            game: props.game,
            onClick: props.onClick
        }
    }

    render() {
        return (
            <div className="justify-content-end">
                <div className="board-row justify-content-end">
                    <Square label={getChar(this.props.game[0])} onClick={() => this.props.onClick(0)}></Square>
                    <Square label={getChar(this.props.game[1])} onClick={() => this.props.onClick(1)}></Square>
                    <Square label={getChar(this.props.game[2])} onClick={() => this.props.onClick(2)}></Square>
                </div>
                <div className="board-row justify-content-end">
                    <Square label={getChar(this.props.game[3])} onClick={() => this.props.onClick(3)}></Square>
                    <Square label={getChar(this.props.game[4])} onClick={() => this.props.onClick(4)}></Square>
                    <Square label={getChar(this.props.game[5])} onClick={() => this.props.onClick(5)}></Square>
                </div>
                <div className="board-row justify-content-end">
                    <Square label={getChar(this.props.game[6])} onClick={() => this.props.onClick(6)}></Square>
                    <Square label={getChar(this.props.game[7])} onClick={() => this.props.onClick(7)}></Square>
                    <Square label={getChar(this.props.game[8])} onClick={() => this.props.onClick(8)}></Square>
                </div>
            </div>
        )
    }

}

export default BoardComp