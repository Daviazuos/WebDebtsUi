import { Component } from "react";
import { Container, Card, Form, Button } from 'react-bootstrap';
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import image from '../../assets/webdebts.png'
import { useHistory } from "react-router-dom";

import "./Login.css"


export default class Login extends Component {
    state = {
        username: '',
        password: '',
        loading: false,
        message: ""
    }

    usernameChange = event => {
        this.setState({ username: event.target.value });
    }

    passwordChange = event => {
        this.setState({ password: event.target.value });
    }

    handleLogin = event => {
        event.preventDefault();
        const login = {
            username: this.state.username,
            password: this.state.password
        }
        axiosInstance.post(Endpoints.user.login(), login)
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                    this.props.history.push("dash");
                    window.location.reload();
                }
                return response.data;
            });
    }

    render() {
        return (
            <Container className="loginContainer">
                <Card className="cardLogin">
                    <Card.Img variant="top" src={image} />
                    <Card.Body>
                        <Form onSubmit={this.handleLogin}>
                            <Form.Group>
                                <Form.Label>Usuário</Form.Label>
                                <Form.Control required="true" name='username' placeholder="Entre com o usuário" onChange={this.usernameChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Senha</Form.Label>
                                <Form.Control required="true" name='password' type="password" placeholder="Entre com a senha" onChange={this.passwordChange} />
                            </Form.Group>
                            <Button variant="primary" type="submit"> Entrar </Button>
                            <Button onClick={event =>  window.location.href='/register'} className="register" variant="primary" type="submit"> Criar usuário </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}