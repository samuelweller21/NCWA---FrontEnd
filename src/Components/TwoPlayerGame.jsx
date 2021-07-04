import React, { Component } from 'react'
import './Game.css'
import BoardComp from './Board.jsx'
import NCService from '../Services/NCService.js'
import { Button, Container, Row, Col, Alert } from 'react-bootstrap'
import SWNavBar from "./SWNavBar.jsx"
import Game from "../Game/Game.js"
import Sound from 'react-sound'
import oMark from '../Sounds/o Mark.mp3'
import xMark from '../Sounds/x Mark.mp3'
import GameOver from '../Sounds/GameOver.mp3'

class TwoPlayerGame extends Component {
    constructor(props) {
        super(props)
        this.state = {
            game: new Game(),
            errorMessage: "",
            playX: false,
            playO: false,
            playWinner: false
        }
        this.state.game.id = this.props.match.params.id
        this.moveComplete = this.moveComplete.bind(this)
        this.moveFailed = this.moveFailed.bind(this)
        this.doGetID = this.doGetID.bind(this)
        this.getErrorMessage = this.getErrorMessage.bind(this)
        this.getNC = this.getNC.bind(this)
        this.getWinnerItem = this.getWinnerItem.bind(this)
        this.getErrorItem = this.getErrorItem.bind(this)
        this.goNewButton = this.goNewButton.bind(this)
        this.getHistoryBar = this.getHistoryBar.bind(this)
        this.getSound = this.getSound.bind(this)
        this.getWinnerSound = this.getWinnerSound.bind(this)
    }

    componentDidMount() {
        this.doGetID()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {

            // eslint-disable-next-line
            this.state = {
                game: new Game(),
                errorMessage: ""
            }
            // eslint-disable-next-line
            this.state.game.id = this.props.match.params.id
            this.doGetID()
        }
        if (prevState !== this.state) {
            this.forceUpdate()
        }
    }

    getNC() {
        return "/NC"
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

    getErrorItem() {
        return (
            (this.getErrorMessage() !== "") ?
                <Alert variant="warning">
                    {this.getErrorMessage()}
                </Alert>
                : <> </>)
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
            <div class="row historyplayer">
                {this.state.game.getHistory()}
            </div>
        )
    }

    doGetID() {
        NCService.setUpAuthentication()
        NCService.getTPGame(this.props.match.params.id)
            .then(res => {
                // eslint-disable-next-line
                this.setState({
                    game: new Game(),
                });
                // eslint-disable-next-line
                this.state.game.id = this.props.match.params.id
                // eslint-disable-next-line
                this.state.game.board.board = res.data.board
                // eslint-disable-next-line
                this.state.game.turn = res.data.turn
            })
            .catch(err => { this.props.history.push(`/error`) })
    }

    render() {
        if (this.state.game === null) {
            return (<SWNavBar history={this.props.history}/>)
        } else {
            return (
                <div className="component">

                    <SWNavBar history={this.props.history}/>

                    <Container fluid>

                        <div class="row justify-content-center">

                            <div class="col-lg-5"></div>

                            <div class="col-lg-2">

                                <div class="row justify-content-center">
                                    <h1>Two Player Game</h1>
                                </div>

                                <div className="row justify-content-center pb-1">
                                    Game Id: {this.state.game.id}
                                </div>

                                <div class="row justify-content-center py-1">
                                    <BoardComp onClick={(i) => this.handleClick(i)} game={this.state.game.board.board} />
                                </div>

                                <div class="row justify-content-center py-1">
                                    {this.getWinnerItem()}
                                </div>

                                <div class="row justify-content-center py-1">
                                    {this.getErrorItem()}
                                </div>

                            </div>

                            { <div class="col-lg-5 container justify-content-left">
                                {this.getHistoryBar()}
                            </div> }

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
                    </Container>

                    <footer className="text-center">
                        © Samuel Weller 2021 - <a href="https://samuelweller.com">samuelweller.com</a>
                    </footer>

                    {this.getSound()}
                    {this.getWinnerSound()}

                </div>
            )
        }
    }

    goNewButton() {
        return (
            <Button variant="primary" onClick={() => {
                this.props.history.push(
                    NCService.createTPGame()
                        .then(res => {
                            this.props.history.push(this.getNC() + "/tpgames/" + res.data);
                        })
                        .catch(err => console.log("Failed to create a new two player game"))
                )
            }}> { "New Game ->"}</Button >)
    }

    getSound() {
        if (this.state.playX) {
            return (<Sound url={xMark} playStatus={Sound.status.PLAYING} volume={100} playFromPosition={0} onFinishedPlaying={() => this.setState({ playX: false })} useConsole={false}/>)
        } else if (this.state.playO) {
            return (<Sound url={oMark} playStatus={Sound.status.PLAYING} volume={100} playFromPosition={0} onFinishedPlaying={() => this.setState({ playO: false })} useConsole={false} />)
        }
    }

    getWinnerSound() {
        if (this.state.playWinner) {
            return (<Sound url={GameOver} playStatus={Sound.status.PLAYING} volume={100} playFromPosition={0} onFinishedPlaying={() => this.setState({ playWinner: false })} useConsole={false}/>)
        }
    }

    getErrorMessage() {
        return (
            this.state.errorMessage
        )
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

    handleClick(i) {
        if (this.state.game.winner !== 0) {
            this.setState({ errorMessage: 'The game is over' })
        } else {
            //Create move
            const xPos = i % 3
            let move = {
                x: xPos,
                y: (i - xPos) / 3,
                player: this.state.game.turn ? 1 : 2
            }
            //Do move
            this.state.game.moveEasy(move.x, move.y)
            NCService.doTPMove(this.state.game.id, move)
                .then(res => this.moveComplete(res))
                .catch(err => this.moveFailed(err))
        }
    }

    moveComplete(res) {
        // eslint-disable-next-line
        this.state.game.board.board = res.data.board
        // eslint-disable-next-line
        this.state.game.turn = res.data.turn
        // eslint-disable-next-line
        this.state.game.winner = this.state.game.board.winner()
        if (this.state.game.winner) {
            this.setState({ playWinner: true })
        } else {
            if (!res.data.turn) {
                this.setState({ playO: true })
            } else {
                this.setState({ playX: true })
            }
        }

    }

    moveFailed(err) {
        console.log("Bad Move")
        console.log(err)
    }
}

export default TwoPlayerGame