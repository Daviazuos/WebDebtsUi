import { Component, Redirect } from "react";
import { Container, Card, Form, Button } from 'react-bootstrap';
import { GoogleLogin } from 'react-google-login';
import image from '../../assets/webdebts.png'

import "./Login.css"

const clientId = "466785017689-rg7m28fjjn3u7o87q2kbmdfhjepo5o74.apps.googleusercontent.com"

export default class Login extends Component {
    render() {

        const onSuccess = (res) => {
            console.log('Login Success: currentUser:', res.profileObj);
            //refreshTokenSetup(res);
        };

        const onFailure = (res) => {
            console.log('Login failed: res:', res);
            alert(
                `Failed to login. 😢`
            );
        };
        return (
            <Container className="loginContainer">
                <Card className="cardLogin">
                <Card.Img variant="top" src={image} />
                    <Card.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Senha</Form.Label>
                                <Form.Control type="password" placeholder="Enter password" />
                            </Form.Group>
                            <Button variant="primary" type="submit"> Entrar </Button>
                        </Form>

                        <div className="google">
                            <GoogleLogin
                                className="googleButton"
                                clientId={clientId}
                                buttonText="Login"
                                onSuccess={onSuccess}
                                onFailure={onFailure}
                                cookiePolicy={'single_host_origin'}
                                style={{ marginTop: '100px' }}
                                isSignedIn={true}
                            />
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}