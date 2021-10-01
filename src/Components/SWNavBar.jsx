import logo from "../Logo.png"
import { Navbar, Nav } from 'react-bootstrap'
import React, { Component } from 'react'
import { History } from 'history'
import './Game.css'
import { Button, Row, ButtonGroup } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'

class SWNavBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            x: false,
            difficulty: "Random"
        }
        this.home = this.home.bind(this)
        this.analysis = this.analysis.bind(this)
        this.cpu = this.cpu.bind(this)
        this.showDialog = this.showDialog.bind(this)
        this.closeDialog = this.closeDialog.bind(this)
        this.playDialog = this.playDialog.bind(this)
        this.getNC = this.getNC.bind(this)
        this.login = this.login.bind(this)
        this.signup = this.signup.bind(this)
    }

    home() {
        this.props.history.push("/NC/")
    }

    analysis() {
        this.props.history.push("/NC/analysis")
    }

    login() {
        this.props.history.push("/NC/login")
    }

    signup() {
        this.props.history.push("/NC/signup")
    }

    cpu() {
        this.props.history.push({
            pathname: this.getNC() + "/cpgame",
            state: { X: this.state.x, diff: "Random" }
        })
    }

    closeDialog() {
        this.setState({ dialog: false })
    }

    getNC() {
        return "/NC"
    }

    playDialog() {
        this.props.history.push({
            pathname: this.getNC() + "/cpgame",
            state: { X: this.state.side, diff: this.state.difficulty }
        })
        console.log("To do - Play dialog")
    }

    showDialog() {
        return (

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

        )
    }

    

    render() {

        return (
            <Navbar bg="primary" variant="dark">

                <Navbar.Brand href="http://www.samuelweller.com">
                    <img alt={"logo"} src={logo} width="75" height="75" />
                </Navbar.Brand>

                <Navbar.Brand href="http://www.samuelweller.com">
                    SamuelWeller.com
                </Navbar.Brand>

                <Nav className="me-auto">
                    <Nav.Link onClick={this.home}>Home</Nav.Link>
                    <Nav.Link onClick={() => this.setState({ dialog: !this.state.dialog })}>Play vs AI</Nav.Link>
                    <Nav.Link onClick={this.analysis}>Analysis Board</Nav.Link>
                    {this.showDialog(this.state)}
                </Nav>

                {/* Needs updating for when logged in */}

                {/* <Nav className="ml-auto">
                    <Nav.Link onClick={this.login}>Log In</Nav.Link>
                    <Nav.Link onClick={this.signup}>Sign Up</Nav.Link>
                </Nav> */}

            </Navbar>
        )
    }

}

export default SWNavBar