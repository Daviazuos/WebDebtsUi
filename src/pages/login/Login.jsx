import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import image from '../../assets/webdebts.png'
import React from "react";
import "./Login.css"
import { refreshPage } from "../../utils/utils";
import LoadingButton from '../../components/loadingButton/LoadingButton';
import { Link } from 'react-router-dom'


export default function Login(props) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessageShow, setErrorMessageShow] = React.useState(false)

    const today = new Date();
    const actualMonth = String(today.getMonth() + 1).padStart(2, '0');
    const actualYear = String(today.getFullYear());

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
                localStorage.setItem("month", actualMonth);
                localStorage.setItem("year", actualYear);
                props.history.push("/");
                setIsLoading(false)
                refreshPage()
            }).catch(err => {
                setIsLoading(false)
                setErrorMessageShow(true)
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
                        <div className="d-grid gap-2">
                            <LoadingButton className="signButton" type="submit" isLoading={isLoading} name="Login"></LoadingButton>
                        </div>
                    </Form>
                    <p></p>
                    {/* <Button onClick={event => window.location.href = '/register'} className="register" variant="primary"> Criar usuário </Button> */}
                    <div className='signText'>Não tem conta ainda? <a className='registerButton' onClick={() => window.location.href = '/register'}>cadastre-se</a></div>

                    <Alert show={errorMessageShow} variant="red">
                        Erro ao logar!
                    </Alert>
                </Card.Body>
            </Card>
        </Container>
    );
}