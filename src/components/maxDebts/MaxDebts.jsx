import React from "react";
import axios from "axios";
import { Card, Table } from "react-bootstrap";
import "./MaxDebts.css"

export default class MaxDebts extends React.Component {
    state = {
        installments: [],
    }

    componentDidMount() {
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const yyyy = today.getFullYear()
        axios.get(`https://localhost:5001/Debts/FilterInstallments?Month=${mm}&Year=${yyyy}&DebtInstallmentType=Fixed`)
            .then(res => {
                const installments = res.data;
                this.setState({ installments });
            })
    }

    render() {

        const valueTotal = this.state.installments.reduce(function (prev, cur) {
            return prev + cur.value;
        }, 0);

        return (
            <Card className='cardMaxDebts'>
                <h3 className='maxName'>Maiores despesas do mês</h3>
                <Table className='tableMaxDebts' striped bordered hover>
                    <tbody>
                        <tr>
                            <td>Comida</td>
                            <td>R$850,00</td>
                        </tr>
                        <tr>
                            <td>Casa</td>
                            <td>R$300,00</td>
                        </tr>
                        <tr>
                            <td>Eletronicos</td>
                            <td>R$4300,00</td>
                        </tr>
                        <tr>
                            <td>Casa</td>
                            <td>R$430,00</td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
            )
    }
}