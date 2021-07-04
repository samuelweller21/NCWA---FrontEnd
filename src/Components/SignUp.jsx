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
            password: ""
        }
        this.inputRef = createRef()
        this.handleSignUp = this.handleSignUp.bind(this)
        this.suggest = this.suggest.bind(this)
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
            console.log(res.data)
        }).catch((err) => console.log(err))
    }

    suggest() {
        NCService.suggestUsername(this.state.username).then((res) => {
            this.setState({username: res.data});
            console.log(res)
        }).catch((err) => console.log(err))
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
                                <Col sm="8">
                                    <Form.Control ref={this.inputRef} onChange={event => this.changeUsername(event)} placeholder="GreatestPlayer123" value={this.state.username}/>
                                </Col>
                                <Col sm="2">
                                    <Button onClick={() => this.suggest()}> Suggest </Button>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="2">
                                    Password
                                </Form.Label>
                                <Col sm="10">
                                    <Form.Control onChange={event => this.changePassword(event)}type="password" placeholder="Password" />
                                </Col>
                            </Form.Group>

                            <Form.Group>
                                <Button onClick={() => this.handleSignUp()}> Sign Up </Button>
                            </Form.Group>
                        </Form>

                        </div>

                </div>

            </div>
        )

    }

}