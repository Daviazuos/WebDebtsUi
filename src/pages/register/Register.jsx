import { Component } from "react";
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import "./Register.css"
import image from '../../assets/webdebts.png'


export default class Register extends Component {
    state = {
        username: '',
        password: '',
        name: '',
        show: false
    }

    usernameChange = event => {
        this.setState({ username: event.target.value });
    }

    nameChange = event => {
        this.setState({ name: event.target.value });
    }

    passwordChange = event => {
        this.setState({ password: event.target.value });
    }

    handleCreate = event => {
        event.preventDefault();
        const user = {
            name: this.state.name,
            username: this.state.username,
            password: this.state.password,
            imageUrl: "",
            document: ""
        }
        axiosInstance.post(Endpoints.user.add(), user)
            .then(response => {
                if (response.status == 200) {
                    this.setState({ show: true });
                }
                return response.data;
            });
    }

    render() {
        return (
            <Container className="loginContainer">
                <Alert show={this.state.show} variant="success">
                    {this.state.name}, agora você ja pode logar com o seu usuário e senha!
                </Alert>
                <Card className="cardLogin">
                    <Card.Img variant="top" src={image} />
                    <Card.Body>
                        <Form onSubmit={this.handleCreate}>
                            <Form.Group>
                                <Form.Label>Nome</Form.Label>
                                <Form.Control required="true" type="text" name='username' placeholder="Entre com o seu nome" onChange={this.nameChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Usuário</Form.Label>
                                <Form.Control required="true" name='username' placeholder="Entre com o usuário" onChange={this.usernameChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Senha</Form.Label>
                                <Form.Control required="true" name='password' type="password" placeholder="Entre com a senha" onChange={this.passwordChange} />
                            </Form.Group>
                            <Button variant="primary" type="submit"> Criar </Button>
                            <Button variant="primary" onClick={event => window.location.href = '/sign-in'} className="register"> Voltar </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}