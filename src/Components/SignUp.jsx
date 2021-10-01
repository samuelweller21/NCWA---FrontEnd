import { React, Component, createRef } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import SWNavBar from './SWNavBar'
import { History } from 'history'
import '../App.css'
import NCService from '../Services/NCService.js'

export default class SignUp extends Component {

    constructor() {
        super()
        this.state = {
            username: "",
            password: "",
            suggestion: "",
            accountCreation: "",
            creationColor: "green"
        }
        this.inputRef = createRef()
        this.handleSignUp = this.handleSignUp.bind(this)
        this.suggest = this.suggest.bind(this)
        this.getSuggestion = this.getSuggestion.bind(this)
        this.getAccountCreation = this.getAccountCreation.bind(this)
    }

    componentDidMount() {
        this.inputRef.current.focus()
    }

    changeUsername(event) {
        this.setState({
            username: event.target.value
        })
    }

    changePassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    handleSignUp() {
        NCService.sendCreateAccountRequest(this.state.username, this.state.password).then((res) => {
            console.log(res)
            if (res.status === 200) {
                this.setState({accountCreation: res.data, creationColor: "green"})
            } else if (res.status === 206) {
                this.setState({accountCreation: res.data, creationColor: "red"})
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    suggest() {
        NCService.suggestUsername(this.state.username).then((res) => {
            if (res.data === this.state.username) {
                this.setState({suggestion: "Looks good!"})
            } else {
                let str = "Try '" + res.data + "'"
                this.setState({ username: res.data, suggestion: str})
            }
        }).catch((err) => console.log(err))
    }

    getSuggestion() {
        if (this.state.suggestion === "") {
            return <> </>
        } else {
            return (
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextUsername">
                    <Form.Label className="green" column sm="12">
                        {this.state.suggestion}
                    </Form.Label>
                </Form.Group>
            )
        }
    }

    getAccountCreation() {
        if (this.state.accountCreation === "") {
            return <> </>
        } else {
            if (this.state.creationColor === "green") {
                return (
                    <div className="green">
                        {this.state.accountCreation}
                    </div>
                )
            } else {
                return (
                    <div className="red">
                        {this.state.accountCreation}
                    </div>
                )
            }
        }
    }

    render() {

        return (
            <div>

                <title> Sign Up </title>

                <SWNavBar history={this.props.history} />

                <div class="loginDivider">

                </div>

                <div class="row">

                    <div class="col-lg-3">

                    </div>

                    <div class="col-lg-6">

                        <Form>
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextUsername">
                                <Form.Label column sm="2">
                                    Username
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control className="test" ref={this.inputRef} onChange={event => this.changeUsername(event)} placeholder="GreatestPlayer123" value={this.state.username} />
                                </Col>
                                <Col sm="2">
                                    <Button onClick={() => this.suggest()}> Check/Suggest </Button>
                                </Col>
                            </Form.Group>

                            {this.getSuggestion()}

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="2">
                                    Password
                                </Form.Label>
                                <Col sm="10">
                                    <Form.Control class="red" onChange={event => this.changePassword(event)} type="password" placeholder="Password" />
                                </Col>
                            </Form.Group>

                            <Form.Group>
                                <Button onClick={() => this.handleSignUp()}> Sign Up </Button>
                            </Form.Group>
                        </Form>

                        {this.getAccountCreation()}

                    </div>

                </div>

            </div>
        )

    }

}