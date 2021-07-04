import React, { Component } from 'react'
import './Game.css'
import Board from './Board'
import DifficultyButtons from "./DifficultyButtons.jsx"
import { Button, Container, Row, Col, Alert } from 'react-bootstrap'
import Game from "../Game/Game.js"
import SWNavBar from './SWNavBar'
import MoveRequest from '../Game/MoveRequest'
import "../index.css"
import Sound from 'react-sound'
import oMark from '../Sounds/o Mark.mp3'
import xMark from '../Sounds/x Mark.mp3'
import GameOver from '../Sounds/GameOver.mp3'

class ComputerGame extends Component {

    constructor(props) {
        super(props)
        this.state = {
            game: new Game(),
            errorMessage: "",
            difficulty: props.location.state.diff,
            X: props.location.state.X,
            playWinner: false,
            playX: false,
            playO: false
        }
        if (!this.state.X) {
            this.makeComputerMove()
        }
        this.getErrorMessage = this.getErrorMessage.bind(this)
        this.changeDifficulty = this.changeDifficulty.bind(this)
        this.getNC = this.getNC.bind(this)
        this.makeComputerMove = this.makeComputerMove.bind(this)
        this.getDifficultyButtons = this.getDifficultyButtons.bind(this)
        this.getWinnerItem = this.getWinnerItem.bind(this)
        this.getErrorItem = this.getErrorItem.bind(this)
        this.goNewButton = this.goNewButton.bind(this)
        this.getHistoryBar = this.getHistoryBar.bind(this)
        this.getSound = this.getSound.bind(this)
        this.getWinnerSound = this.getWinnerSound.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.setState({
                game: new Game(),
                errorMessage: "",
                X: this.props.location.state.X,
                difficulty: this.props.location.state.diff
            })
        }
        if (prevState !== this.state) {
            if (this.state.game.board.board === [0,0,0,0,0,0,0,0,0]) {
                if (!this.state.X) {
                    this.makeComputerMove()
                }
            }
            this.forceUpdate()
        }
    }

    getNC() {
        return "/NC"
    }

    getDifficultyButtons() {
        return (<>
            <DifficultyButtons
                label="Random"
                difficulty={this.state.difficulty}
                onClick={() => this.changeDifficulty("Random")} />

            <DifficultyButtons
                label="Medium"
                difficulty={this.state.difficulty}
                onClick={() => this.changeDifficulty("Medium")} />

            <DifficultyButtons
                label="Perfect"
                difficulty={this.state.difficulty}
                onClick={() => this.changeDifficulty("Perfect")} />
        </>)
    }

    getWinnerItem() {
        return (
            (this.getWinnerMessage() !== "There is no winner yet") ?
                <Alert variant="success">
                    {this.getWinnerMessage()}
                </Alert>
                : <> </>
        )
    }

    getSound() {
        if (this.state.playX) {
            return (<Sound url={xMark} playStatus={Sound.status.PLAYING} volume={100} playFromPosition={0} onFinishedPlaying={() => this.setState({ playX: false })} useConsole={false}/>)
        } else if (this.state.playO) {
            return (<Sound url={oMark} playStatus={Sound.status.PLAYING} volume={100} playFromPosition={0} onFinishedPlaying={() => this.setState({ playO: false })} useConsole={false}/>)
        }
    }

    getWinnerSound() {
        if (this.state.playWinner) {
            return (<Sound url={GameOver} playStatus={Sound.status.PLAYING} volume={100} playFromPosition={0} onFinishedPlaying={() => this.setState({ playWinner: false })} useConsole={false}/>)
        }
    }

    getErrorItem() {
        (this.getErrorMessage() !== "") ?
            <Alert variant="warning">
                {this.getErrorMessage()}
            </Alert>
            : <> </>
    }

    getHistoryRow(i) {
        return (
            <>
                <div className="col-md-1">
                    i
                </div>
                <div className="col-md-2">
                    {this.state.game.getFirstRow(i)}
                </div>
                <div className="col-md-2">
                    {this.state.game.getSecondRow(i)}
                </div>
            </>
        )
    }

    getHistoryBar() {
        return (
            <div class="row history">
                {this.state.game.getHistory()}
            </div>
        )
    }

    render() {
        if (this.state.game === null) {
            return (<SWNavBar history={this.props.history} />)
        } else {
            return (
                <div className="component">

                    <SWNavBar history={this.props.history} />

                    <Container fluid>

                        <div class="row justify-content-center">

                            <div class="col-lg-5"></div>

                            <div class="col-lg-2">

                                <div class="row justify-content-center">
                                    <h1>Play vs AI</h1>
                                </div>

                                <div class="row justify-content-center py-1">
                                    Select Computer Difficulty:
                                    </div>

                                <div class="row justify-content-center py-1">
                                    {this.getDifficultyButtons()}
                                </div>

                                <div class="row justify-content-center py-1">
                                    <Board onClick={(i) => this.handleClick(i)} game={this.state.game.board.board} />
                                </div>

                                <div class="row justify-content-center py-1">
                                    {this.getWinnerItem()}
                                </div>

                                <div class="row justify-content-center py-1">
                                {this.getErrorItem()}
                            </div>

                            </div>

                            <div class="col-lg-5 container justify-content-left">
                                {this.getHistoryBar()}
                            </div>

                        </div>

                        <Row className="justify-content-center py-1">
                            <Col md="auto">
                                <Button variant="primary" onClick={() => this.goHome()}> {"<- Go Home"}</Button>
                            </Col>

                            <Col xs={1}></Col>

                            <Col md="auto">
                                {this.goNewButton()}
                            </Col>

                        </Row>

                        <footer className="text-center">
                            © Samuel Weller 2021 - <a href="https://samuelweller.com">samuelweller.com</a>
                        </footer>

                        {this.getSound()}
                        {this.getWinnerSound()}

                    </Container>

                </div>
            )
        }
    }

    goNewButton() {
        return (
            <Button variant="primary" onClick={() => {
                this.props.history.push({
                    pathname: this.getNC() + "/cpgame",
                    state: { X: this.state.X, diff: this.state.difficulty }
                })
            }
            }> {"New Game ->"}</Button>)
    }

    changeDifficulty(diff) {
        this.setState({ difficulty: diff })
    }

    getErrorMessage() {
        return (
            this.state.errorMessage
        )
    }

    componentDidCatch(error, errorInfo) {
        console.log(error)
        console.log(errorInfo)
    }

    getWinnerMessage() {
        let message = ''
        if (this.state.game.winner === 0) {
            message = 'There is no winner yet'
        } else if (this.state.game.winner === 1) {
            message = 'O\'s won'
        } else if (this.state.game.winner === -1) {
            message = 'It\'s a draw'
        } else {
            message = 'X\'s won'
        }
        return (
            message
        )
    }


    goHome() {
        this.props.history.push("/NC/")
    }

    makeComputerMove() {
        if (this.state.game.winner === 0) {
            if (this.state.difficulty === "Random") {
                this.state.game.randomComputerMove()
            } else if (this.state.difficulty === "Medium") {
                this.state.game.mediumComputerMove()
            } else {
                this.state.game.perfectComputerMove()
            }
        }
    }

    handleClick(i) {
        if (this.state.game.winner !== 0) {
            this.setState({ errorMessage: 'The game is over' })
        } else {
            //Create move
            const xPos = i % 3
            let move = new MoveRequest(
                xPos,
                (i - xPos) / 3,
                this.state.X
            )
            this.state.game.move(move.x, move.y, move.player ? 1 : 2)
            this.state.game.toString()
            this.makeComputerMove()
            this.state.game.toString()
            if (this.state.game.winner) {
                this.setState({ playWinner: true })
            } else {
                if (!this.state.X) {
                    this.setState({ playX: true })
                } else {
                    this.setState({ playO: true })
                }
            }
            this.forceUpdate()
            this.state.game.toString()
        }
    }
}

export default ComputerGame