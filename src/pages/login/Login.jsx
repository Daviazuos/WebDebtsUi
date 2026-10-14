import { Container, Card, Form, Alert } from 'react-bootstrap';
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
        <Container fluid className="loginPage">
            <Card className="loginCard">
                <Card.Img className="loginLogo" variant="top" src={image} alt="WebDebts" />
                <Card.Body>
                    <div className="loginHeading">
                        <h1>Bem-vindo de volta</h1>
                        <p>Entre na sua conta para acompanhar suas finanças.</p>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="loginFormGroup" controlId="loginUsername">
                            <Form.Label>Usuário</Form.Label>
                            <Form.Control required name="username" autoComplete="username" placeholder="Digite seu usuário" onChange={usernameChange} />
                        </Form.Group>
                        <Form.Group className="loginFormGroup" controlId="loginPassword">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control required name="password" type="password" autoComplete="current-password" placeholder="Digite sua senha" onChange={passwordChange} />
                        </Form.Group>
                        <div className="d-grid">
                            <LoadingButton className="loginSubmit" type="submit" isLoading={isLoading} name="Entrar" />
                        </div>
                    </Form>
                    <div className="loginRegister">
                        Não tem conta ainda? <Link to="/Register">Cadastre-se</Link>
                    </div>

                    <Alert show={errorMessageShow} variant="danger" className="loginError">
                        Erro ao logar!
                    </Alert>
                </Card.Body>
            </Card>
        </Container>
    );
}