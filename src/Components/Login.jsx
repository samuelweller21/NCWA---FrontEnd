import { React, Component, createRef } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import SWNavBar from './SWNavBar'
import { History } from 'history'
import '../App.css'

export default class Login extends Component {

    constructor() {
        super()
        this.inputRef = createRef()
    }

    componentDidMount() {
        this.inputRef.current.focus()
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
                                    <Form.Control ref={this.inputRef} placeholder="GreatestPlayer123" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="2">
                                    Password
                                </Form.Label>
                                <Col sm="10">
                                    <Form.Control type="password" placeholder="Password" />
                                </Col>
                            </Form.Group>

                            <Form.Group>
                                <Button> Login </Button>
                            </Form.Group>
                        </Form>

                        </div>

                </div>

            </div>
        )

    }

}