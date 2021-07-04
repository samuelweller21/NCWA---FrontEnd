import React, { Component } from 'react'
import './Game.css'
import { Button, Container, ProgressBar, Form } from 'react-bootstrap'
import SWNavBar from "./SWNavBar.jsx"
import Game from "../Game/Game.js"
import Sound from 'react-sound'
import oMark from '../Sounds/o Mark.mp3'
import xMark from '../Sounds/x Mark.mp3'
import { Helmet } from 'react-helmet'
import { gameTree, bestMove } from '../Game/AI'
import BoardCompA from './BoardA.jsx'
import Pos from '../Game/Pos.js'

class AnalysisBoard extends Component {

    constructor() {
        super()
        this.state = {
            game: new Game(),
            errorMessage: "",
            playX: false,
            playO: false,
            progress: 0,
            workChunk: 0,
            displayProgress: true,
            legals: new Map(),
            drawMoves: true,
            analysisOn: true,
            genMovesTime: 0
        }
        this.DBtimer = null
        this.progressTimer = null
        this.errorTimer = null
        this.getNC = this.getNC.bind(this)
        this.getHistoryBar = this.getHistoryBar.bind(this)
        this.getSound = this.getSound.bind(this)
        this.getHistoryRow = this.getHistoryRow.bind(this)
        this.getIndex = this.getIndex.bind(this)
        this.getHistoryItem = this.getHistoryItem.bind(this)
        this.getMoveEvalsBar = this.getMoveEvalsBar.bind(this)
        this.getMove = this.getMove.bind(this)
        this.handleWheel = this.handleWheel.bind(this)
        this.getEvalText = this.getEvalText.bind(this)
        this.startTimeout = this.startTimeout.bind(this)
        this.getProgressText = this.getProgressText.bind(this)
        this.getProgress = this.getProgress.bind(this)
        this.getEvalsBar = this.getEvalsBar.bind(this)
        this.getProgressValue = this.getProgressValue.bind(this)
        this.getX = this.getX.bind(this)
        this.getO = this.getO.bind(this)
        this.getAnimated = this.getAnimated.bind(this)
        this.scrollBack = this.scrollBack.bind(this)
        this.getButtonVariant = this.getButtonVariant.bind(this)
        this.doMove = this.doMove.bind(this)
        this.lookup = this.lookup.bind(this)
    }

    lookup(game) {
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

        console.log(game.board.generateAllHashes())
        //Else return 0
        return 0
    } 

    getAnimated() {
        if (!this.state.analysisOn) {
            return false
        }
        if (this.state.game.winner === 0) {
            return true
        } else {
            return false
        }
    }

    getX() {
        if (!this.state.analysisOn) {
            return <div className="drawingTextS">X</div>
        }
        if (this.state.game.winner === 1) {
            return <div className="losingTextS">X</div>
        } else if (this.state.game.winner === 2) {
            return <div className="winnerText">X</div>
        } else {
            let state = this.lookup(this.state.game)
            if (state === 1) {
                return <div className="losingTextS">X</div>
            } else if (state === 2) {
                return <div className="winnerText">X</div>
            } else if (state === -1) {
                return <div className="drawingTextS">X</div>
            } else if (state === 0) {
                return <div className="drawingTextS">X</div>
            }
        }
    }

    getO() {
        if (!this.state.analysisOn) {
            return <div className="drawingTextS">O</div>
        }
        if (this.state.game.winner === 1) {
            return <div className="winnerText">O</div>
        } else if (this.state.game.winner === 2) {
            return <div className="losingTextS">O</div>
        } else {
            let state = this.lookup(this.state.game)
            if (state === 1) {
                return <div className="winnerText">O</div>
            } else if (state === 2) {
                return <div className="losingTextS">O</div>
            } else if (state === -1) {
                return <div className="drawingTextS">O</div>
            } else if (state === 0) {
                return <div className="drawingTextS">O</div>
            }
        }
    }

    getProgressValue() {
        if (!this.state.analysisOn) {
            return 50
        }
        if (this.state.game.winner === 1) {
            return 75
        } else if (this.state.game.winner === 2) {
            return 25
        } else if (this.state.game.winner === -1) {
            return 50
        } else {
            let state = this.lookup(this.state.game)
            if (state === 1) {
                return 75
            } else if (state === 2) {
                return 25
            } else if (state === -1) {
                return 50
            }
        }
    }

    componentDidMount() {
        console.log(this.state.progress)
        this.startTimeout()
    }

    startTimeout() {
        this.DBtimer = setTimeout(() => {
            let start = new Date().getTime()
            bestMove(new Game(), -1) //Generate all moves
            gameTree.set("000000000",-1) //Hard set empty board as draw for convenience
            let dur = new Date().getTime() - start
            this.updateStateMoves()
            this.setState({genMovesTime: dur, progress: 100})
            this.progressTimer = setTimeout(() => {
                this.setState({ displayProgress: false })
            }, 1000)
        }, 1)
    }

    getNC() {
        return "/NC"
    }

    getHistoryItem(val) {
        if (val === null) {
            return <> </>
        } else {
            return <Button onClick={() => this.scrollBack(this.state.game.getTicksBack(val))} className="btnpad">{val.getFormattedPos()}</Button>
        }
    }

    getIndex(i) {
        if (Math.ceil((this.state.game.moveHistory.length) / 2) >= i) {
            return <> {i} </>
        } else {
            return <> </>
        }
    }

    getEvalText(i) {
        if (i === -1) {
            return "Draw"
        } else if (i === 1) {
            return "O Win"
        } else if (i === 2) {
            return "X Win"
        } else if (i === 0) {
            return "Drawn"
        }
    }

    getMove(i) {
        let legals = this.state.game.strictlegalMoves()
        if (legals !== null) {
            if (legals.length > i) {
                let newGame = new Game()
                newGame.setAs(this.state.game)
                newGame.moveEasy(legals[i].x, legals[i].y)
                if (newGame.winner !== 0) {
                    if (!this.state.analysisOn) {
                        return (
                        <div className="col">
                            <Button onClick={() => this.doMove(new Pos(legals[i].x, legals[i].y))}>
                                {(i + 1) + ". " + legals[i].getFormattedPos() + " - ?"}
                            </Button>
                        </div>)
                    } else {
                        return (
                        <div className="col">
                            <Button onClick={() => this.doMove(new Pos(legals[i].x, legals[i].y))} variant={this.getButtonVariant(newGame.winner)}>
                                {(i + 1) + ". " + legals[i].getFormattedPos() + " - " + this.getEvalText(newGame.winner)}
                            </Button>
                        </div>
                        )
                    }
                } else {
                    if (!this.state.analysisOn) {
                        return (
                            <div className="col">
                                <Button onClick={() => this.doMove(new Pos(legals[i].x, legals[i].y))}>
                                    {(i + 1) + ". " + legals[i].getFormattedPos() + " - ?"}
                                </Button>
                            </div>)
                    } else {
                        return (
                            <div className="col">
                                <Button onClick={() => this.doMove(new Pos(legals[i].x, legals[i].y))} variant={this.getButtonVariant(this.lookup(newGame))}>
                                    {(i + 1) + ". " + legals[i].getFormattedPos() + " - " + this.getEvalText(this.lookup(newGame))}
                                </Button>
                            </div>
                            )
                    }
                }
            } else {
                return <> </>
            }
        }
    }

    doMove(pos) {
        this.state.game.movePos(pos)
        this.updateStateMoves()
    }

    getButtonVariant(i) {
        if (i === 1) {
            if (this.state.game.turn) {
                return "success"
            } else {
                return "danger"
            }
        } else if (i === -1) {
            return "warning"
        } else if (i === 2) {
            if (this.state.game.turn) {
                return "danger"
            } else {
                return "success"
            }
        }
    }

    getEvalsBar() {
        if (this.state.progress < 100) {
            return null
        } else {
            if (!this.state.analysisOn) {
                return <div> Analysis Off </div>
            }
            if (this.state.game.winner === 1) {
                return <div> O Won </div>
            } else if (this.state.game.winner === 2) {
                return <div> X Won </div>
            } else {
                return <div> {this.getEvalText(this.lookup(this.state.game))} </div>
            }
        }
    }

    getMoveEvalsBar() {
        if (this.state.progress < 100) {
            return <> </>
        } else {
            return (
                <div className="analysismoves">
                    <div class=""> Moves: </div>
                    <div class="row divdivision"> {this.getMove(0)} </div>
                    <div class="row divdivision"> {this.getMove(1)} </div>
                    <div class="row divdivision"> {this.getMove(2)} </div>
                    <div class="row divdivision"> {this.getMove(3)} </div>
                    <div class="row divdivision"> {this.getMove(4)} </div>
                    <div class="row divdivision"> {this.getMove(5)} </div>
                    <div class="row divdivision"> {this.getMove(6)} </div>
                    <div class="row divdivision"> {this.getMove(7)} </div>
                    <div class="row divdivision"> {this.getMove(8)} </div>
                    <div class="row divdivision"> </div>
                </div>
            )
        }
    }

    getHistoryRow(i) {
        return (
            <>
                <div className="col-md-1">
                    {this.getIndex(i)}
                </div>
                <div className="col-md-4">
                    {this.getHistoryItem(this.state.game.getFirstCol(i))}
                </div>
                <div className="col-md-4">
                    {this.getHistoryItem(this.state.game.getSecondCol(i))}
                </div>
            </>
        )
    }

    getHistoryBar() {
        return (
            <div className="row historyanalysis justify-content-left">
                <div class="row">
                    {this.getHistoryRow(1)}
                </div>
                <div class="row">
                    {this.getHistoryRow(2)}
                </div>
                <div class="row">
                    {this.getHistoryRow(3)}
                </div>
                <div class="row">
                    {this.getHistoryRow(4)}
                </div>
                <div class="row">
                    {this.getHistoryRow(5)}
                </div>
            </div>
        )
    }

    scrollBack(ticksBack) {
        var stateMovesMap = new Map()
        if (this.state.game.moveHistory.length <= ticksBack) {
            let newGame = new Game()
            let legals = newGame.strictlegalMoves()
            if (legals === null) {
                this.setState({ legals: null })
                return null
            }
            for (let i = 0; i < legals.length; i++) {
                let newGameB = new Game()
                newGameB.setAs(newGame)
                newGameB.moveEasy(legals[i].x, legals[i].y)
                if (newGameB.winner !== 0) {
                    stateMovesMap.set(legals[i].x.toString() + legals[i].y.toString(), newGameB.winner)
                } else {
                    stateMovesMap.set(legals[i].x.toString() + legals[i].y.toString(), this.lookup(newGameB))
                }
            }
            this.setState({
                game: newGame,
                errorMessage: "",
                playX: false,
                playO: false,
                legals: stateMovesMap
            })
        } else {
            let newGame = new Game()
            let movesLeft = this.state.game.moveHistory.length - ticksBack
            let i = 0
            while (movesLeft > 0) {
                newGame.movePos(this.state.game.moveHistory[i])
                i++
                movesLeft--
            }
            let legals = newGame.strictlegalMoves()
            if (legals === null) {
                this.setState({ legals: null })
                return null
            }
            for (let i = 0; i < legals.length; i++) {
                let newGameB = new Game()
                newGameB.setAs(newGame)
                newGameB.moveEasy(legals[i].x, legals[i].y)
                if (newGameB.winner !== 0) {
                    stateMovesMap.set(legals[i].x.toString() + legals[i].y.toString(), newGameB.winner)
                } else {
                    stateMovesMap.set(legals[i].x.toString() + legals[i].y.toString(), this.lookup(newGameB))
                }
            }
            this.setState({ game: newGame, errorMessage: "", playX: false, playO: false, legals: stateMovesMap })
        }
    }

    handleWheel(event) {
        if (event.deltaY < 0) {
            return null
        }
        this.scrollBack(event.deltaY/100)
    }

    render() {
        if (this.state.game === null) {
            return (<SWNavBar history={this.props.history} />)
        } else {
            return (

                <div className="component" onWheel={this.handleWheel}>

                    <Helmet>
                        <title> Analysis Board </title>
                    </Helmet>

                    <SWNavBar history={this.props.history} />

                    <Container fluid>

                        <div class="row">

                            <div class="col-lg-3 container justify-content-end">
                                {this.getMoveEvalsBar()}
                                
                            </div>

                            <div class="col-lg-5">

                                <div class="row justify-content-center">
                                    <h1> Analysis</h1>
                                </div>

                                <div class="row justify-content-center">
                                    <BoardCompA draw={this.state.drawMoves} legals={this.state.legals} onClick={(i) => this.handleClick(i)} game={this.state.game.board.board} turn={this.state.game.turn} />
                                </div>

                                <div class="row pt-2">

                                    <div class="col-lg-2 justify-content-left">
                                        {this.getX()}
                                    </div>

                                    <div class="col-lg-8 justify-content-center">
                                        <div class="row pt-2">
                                        </div>
                                        <div class="pt-2">
                                            <ProgressBar animated={this.getAnimated()} now={this.getProgressValue()} label={this.getEvalsBar()}></ProgressBar>
                                        </div>
                                        <div class="row pt-2">
                                        </div>
                                    </div>

                                    <div class="col-lg-2 justify-content-left">
                                        {this.getO()}
                                    </div>

                                </div>

                                <div class="row justify-content-center">
                                    {/* {this.state.errorMessage} */}
                                </div>

                                <div class="row justify-content-center">
                                <Form>
                                    {['analysis'].map((type) => (
                                        <div key={`default-${type}`} className="mb-3">
                                            <Form.Check
                                                type={'switch'}
                                                id={`default-${type}`}
                                                label={'Analysis On'}
                                                checked={this.state.analysisOn}
                                                onChange={(event) => {
                                                    this.setState({analysisOn: event.target.checked});
                                                }}
                                            />
                                        </div>
                                    ))}
                                    {['checkbox'].map((type) => (
                                        <div key={`default-${type}`} className="mb-3">
                                            <Form.Check
                                                type={'switch'}
                                                id={`default-${type}`}
                                                label={'Show Move Hints'}
                                                checked={this.state.drawMoves}
                                                onChange={(event) => {
                                                    this.setState({drawMoves: event.target.checked});
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Form>
                                </div>

                            </div>

                            {<div class="col-lg-3 container justify-content-left">
                                {this.getHistoryBar()}
                                <div class="row justify-content-left">Tip: Scroll to undo moves</div>
                                
                            </div>}

                        </div>

                        {this.getProgressText()}

                        {this.getProgress()}

                    </Container>

                    <footer className="text-center">
                        © Samuel Weller 2021 - <a href="https://samuelweller.com">samuelweller.com</a>
                    </footer>

                    {this.getSound()}

                </div >
            )
        }
    }

    getProgressText() {
        if (this.state.progress === 0) {
            return <div>About to start building solved database</div>
        } else if (this.state.progress < 100) {
            return <div>Building solved database</div>
        } else if (this.state.progress >= 100) {
            if (this.state.displayProgress) {
                return <div>Completed solved game database in &lt; {this.state.genMovesTime} ms</div>
            } else {
                return null
            }
        }
    }

    getProgress() {
        if (this.state.displayProgress) {
            return <ProgressBar animated now={this.state.progress} label={this.state.progress} />
        } else {
            return null
        }
    }

    getSound() {
        if (this.state.playX) {
            return (<Sound url={xMark} playStatus={Sound.status.PLAYING} volume={100} playFromPosition={0} onFinishedPlaying={() => this.setState({ playX: false })} useConsole={false} />)
        } else if (this.state.playO) {
            return (<Sound url={oMark} playStatus={Sound.status.PLAYING} volume={100} playFromPosition={0} onFinishedPlaying={() => this.setState({ playO: false })} useConsole={false} />)
        }
    }

    goHome() {
        this.props.history.push("/NC/")
    }

    updateStateMoves() {
        let legals = this.state.game.strictlegalMoves()
        var stateMovesMap = new Map()
        if (legals === null) {
            this.setState({ legals: null })
            return null
        }
        for (let i = 0; i < legals.length; i++) {
            let newGame = new Game()
            newGame.setAs(this.state.game)
            newGame.moveEasy(legals[i].x, legals[i].y)
            if (newGame.winner !== 0) {
                stateMovesMap.set(legals[i].x.toString() + legals[i].y.toString(), newGame.winner)
            } else {
                stateMovesMap.set(legals[i].x.toString() + legals[i].y.toString(), this.lookup(newGame))
            }
        }
        this.setState({ legals: stateMovesMap })
    }

    handleClick(i) {
        if (this.state.game.winner !== 0) {
            this.setState({ errorMessage: 'The game is over' })
            //To Do: Play sound
            this.errorTimer = setTimeout(() => {
                this.setState({ errorMessage: '' })
            }, 1000)
        } else {
            const xPos = i % 3
            const yPos = (i - xPos) / 3
            //Do move
            if (this.state.game.board.board[i] === 0) {
                this.state.game.moveEasy(xPos, yPos)
                if (!this.state.game.turn) {
                    this.setState({ playO: true })
                } else {
                    this.setState({ playX: true })
                }
                this.setState({ errorMessage: '' })
            } else {
                this.setState({ errorMessage: 'You cannot play there' })
                //To Do: Play sound
                this.errorTimer = setTimeout(() => {
                    this.setState({ errorMessage: '' })
                }, 1000)
            }
        }
        this.updateStateMoves()
    }
}

export default AnalysisBoard