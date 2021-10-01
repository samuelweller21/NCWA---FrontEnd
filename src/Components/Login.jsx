import { React, Component, createRef } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import SWNavBar from './SWNavBar'
import { History } from 'history'
import '../App.css'
import NCService from '../Services/NCService'

export default class Login extends Component {

    constructor() {
        super()
        this.state = {username: "", password: ""}
        this.login = this.login.bind(this)
    }

    login() {
        NCService.login(this.state.username, this.state.password)
    }

    render() {

        return (
            <div>

                <title> Login </title>

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
                                <Col sm="10">
                                    <Form.Control onChange={e => this.setState({ username: e.target.value })} type="text" type="text" value={this.state.username} placeholder="GreatestPlayer123" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="2">
                                    Password
                                </Form.Label>
                                <Col sm="10">
                                    <Form.Control onChange={e => this.setState({ password: e.target.value })} type="text" value={this.state.password} type="password" placeholder="Password" />
                                </Col>
                            </Form.Group>

                            <Form.Group>
                                <Button onClick={this.login}> Login </Button>
                            </Form.Group>
                        </Form>

                        </div>

                </div>

            </div>
        )

    }

}