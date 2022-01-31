import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import image from '../../assets/webdebts.png'
import React from "react";
import "./Login.css"
import { refreshPage } from "../../utils/utils";


export default function Login(props) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const usernameChange = event => {
        setUsername(event.target.value);
    }

    const passwordChange = event => {
        setPassword(event.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)
        const login = {
            username: username,
            password: password
        }
        axiosInstance.post(Endpoints.user.login(), login)
            .then(response => {
                localStorage.setItem("user", JSON.stringify(response.data));
                props.history.push("dash");
                refreshPage()
            });
    }

    return (
        <Container className="loginContainer">
            <Card className="cardLogin">
                <Card.Img variant="top" src={image} />
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Usuário</Form.Label>
                            <Form.Control required="true" name='username' placeholder="Entre com o usuário" onChange={usernameChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Senha</Form.Label>
                            <Form.Control required="true" name='password' type="password" placeholder="Entre com a senha" onChange={passwordChange} />
                        </Form.Group>
                        <Button type="submit" variant="primary" disabled={isLoading == true ? true : false}>
                            <span>Entrar </span>
                            {isLoading == true ? <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> : ''}
                        </Button>
                        <Button onClick={event => window.location.href = '/register'} className="register" variant="primary"> Criar usuário </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}