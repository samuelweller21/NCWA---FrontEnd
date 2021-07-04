import React, { Component } from 'react'
import NCService from '../Services/NCService'
import { Button, Container, Row, Form, Col, Image, Alert, ButtonGroup } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import logo from '../BoardImage.png'
import SWNavBar from './SWNavBar'

class Welcome extends Component {

    constructor() {
        super()
        this.state = {
            error: "",
            id: 10000001,
            dialog: false,
            difficulty: "Random",
            side: true
        }
        this.goToGamePage = this.goToGamePage.bind(this)
        this.goToTwoPlayerGame = this.goToTwoPlayerGame.bind(this)
        this.goToComputerGame = this.goToComputerGame.bind(this)
        this.getNC = this.getNC.bind(this)
        this.getErrorMessage = this.getErrorMessage.bind(this)
        this.inputChange = this.inputChange.bind(this)
        this.closeDialog = this.closeDialog.bind(this)
        this.playDialog = this.playDialog.bind(this)
        this.goToAnalysis = this.goToAnalysis.bind(this)
    }

    getNC() {
        return "/NC"
    }

    render() {
        return (
            <>

                <SWNavBar history={this.props.history} />

                <Container fluid>

                    <Row className="justify-content-center">
                        <h1>Welcome to Noughts & Crosses</h1>
                    </Row >


                    <Row className="justify-content-center">
                        <Image
                            src={logo} rounded />
                    </Row>


                    <Row className="justify-content-center">
                        <Form className="justify-content-center">
                            <Form.Group as={Row} className="justify-content-center" >

                                <Form.Label column sm={2.5}>Game Id:</Form.Label>

                                <Col sm={5}>
                                    <Form.Control onChange={event => this.inputChange(event)} type="text" name="gameId" placeholder={10000001} ref={(ref) => this.gameId = ref}>
                                    </Form.Control>
                                </Col>

                                <Button column="true" variant="success" onClick={this.goToGamePage}> Go </Button>

                            </Form.Group>
                        </Form>
                    </Row>

                    {this.getErrorMessage()}

                    <Row className="justify-content-center py-1">
                        <Button variant="success" onClick={this.goToTwoPlayerGame}> Play vs Player </Button>
                    </Row>

                    <Row className="justify-content-center py-1">
                        <Button variant="success" onClick={this.goToAnalysis}> Analysis </Button>
                    </Row>

                    {/* <Row className="justify-content-center py-1">
                        <Button variant="success" onClick={() => this.goToComputerGame(true)}> Play new Computer Game as O's </Button>
                    </Row>

                    <Row className="justify-content-center py-1">
                        <Button variant="success" onClick={() => this.goToComputerGame(false)}> Play new Computer Game as X's </Button>
                    </Row> */}

                    <Row className="justify-content-center py-1">
                        {this.showDialog(this.state)}
                    </Row>

                </Container>

                <footer className="text-center">
                    © Samuel Weller 2021 - <a href="https://samuelweller.com">samuelweller.com</a>
                </footer>


            </>
        )
    }

    inputChange(event) {
        this.setState({
            gameId: event.target.value
        })
    }

    goToAnalysis() {
        this.props.history.push({
            pathname: this.getNC() + "/analysis",
        })
    }

    getErrorMessage() {
        if (this.state.error === "") {
            return null
        } else {
            return (
                <Row className="justify-content-center py-1">
                    <Alert variant="warning">
                        {this.state.error}
                    </Alert>
                </Row>)
        }
    }

    goToGamePage() {
        NCService.searchGame(this.gameId.value).then(res => {
            if (res === -1) {
                this.setState({
                    error: "Could not find that game"
                })
            } else if (res === 1) {
                this.props.history.push({
                    pathname: this.getNC() + "/cpgames/" + this.gameId.value,
                    state: { X: true }
                })
            } else {
                this.props.history.push({
                    pathname: this.getNC() + "/tpgames/" + this.gameId.value,
                })
            }
        }).catch(err => console.log(err))
        console.log(this.gameId.value)
    }

    //Computer Routing

    goToComputerGame(x) {
        this.props.history.push({
            pathname: this.getNC() + "/cpgame",
            state: { X: x, diff: "Random" }
        })
    }

    closeDialog() {
        this.setState({ dialog: false })
    }

    playDialog() {
        this.props.history.push({
            pathname: this.getNC() + "/cpgame",
            state: { X: this.state.side, diff: this.state.difficulty }
        })
    }

    showDialog() {
        return (

            <>
                <Button variant="success" onClick={() => this.setState({ dialog: !this.state.dialog })}>
                    Play vs AI
                </Button>

                <Modal show={this.state.dialog} onHide={this.closeDialog}>

                    <Modal.Header closeButton>
                        <Modal.Title>Set up AI Game</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Row className="justify-content-center">
                            Select a difficulty:
                        </Row >

                        <Row className="justify-content-center">
                            <ButtonGroup id="1" className="mr-2" aria-label="AI Difficulty">
                                <Button onClick={() => { this.setState({ difficulty: "Random" }) }} variant={this.state.difficulty === "Random" ? "success" : "secondary"}>Random</Button>
                                <Button onClick={() => { this.setState({ difficulty: "Medium" }) }} variant={this.state.difficulty === "Medium" ? "success" : "secondary"}>Medium</Button>
                                <Button onClick={() => { this.setState({ difficulty: "Perfect" }) }} variant={this.state.difficulty === "Perfect" ? "success" : "secondary"}>Perfect</Button>
                            </ButtonGroup>
                        </Row >

                        <Row className="justify-content-center">
                            Select a side (O's start):
                        </Row >

                        <Row className="justify-content-center">
                            <ButtonGroup id="2" className="mr-2" aria-label="AI Side">
                                <Button onClick={() => { this.setState({ side: true }) }} variant={this.state.side ? "success" : "secondary"}>O</Button>
                                <Button onClick={() => { this.setState({ side: false }) }} variant={!this.state.side ? "success" : "secondary"}>X</Button>
                            </ButtonGroup>
                        </Row >

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeDialog}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.playDialog}>
                            Play
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>

        )
    }

    //Two Player Routing

    goToTwoPlayerGame() {
        NCService.createTPGame()
            .then(res => this.props.history.push(this.getNC() + "/tpgames/" + res.data))
            .catch(err => console.log("Failed to create a new two player game"))
    }
}

export default Welcome