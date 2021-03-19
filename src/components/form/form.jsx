import React from "react";
import axios from 'axios';

import { Form, Button } from 'react-bootstrap';

export default class DebtList extends React.Component {
  state = {
    name: '',
    value: '',
    date: '',
    numberOfInstallments: '',
    debtInstallmentType: '',
  }

  nameChange = event => {
    this.setState({ name: event.target.value });
  }
  valueChange = event => {
    this.setState({ value: event.target.value });
  }
  dateChange = event => {
    this.setState({ date: event.target.value });
  }
  installmentsChange = event => {
    this.setState({ numberOfInstallments: event.target.value });
  }
  typeChange = event => {
    this.setState({ debtInstallmentType: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();

    const addDebts = {
      name: this.state.name,
      value: this.state.value,
      date: this.state.date,
      numberOfInstallments: this.state.numberOfInstallments,
      debtInstallmentType: this.state.debtInstallmentType
    };

    console.log({addDebts})

    axios.post(`https://localhost:5001/Debts/Create`, addDebts)
 }

  render() {
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control name="name" onChange={this.nameChange} placeholder="Entre com o nome" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Valor</Form.Label>
            <Form.Control name='value' type="number" step=".01" onChange={this.valueChange} placeholder="Entre com o valor total" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Data</Form.Label>
            <Form.Control name='date' type="date" onChange={this.dateChange} placeholder="Entre com o data" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Quantidade de Parcelas</Form.Label>
            <Form.Control name='numberOfInstallments' type="number" onChange={this.installmentsChange} placeholder="Entre com o quantidade de parcelas" />
          </Form.Group>

          <Form.Group>
          <Form.Label>Tipo de débito</Form.Label>
            <Form.Control as="select" name='debtInstallmentType' onChange={this.typeChange}>
              <option></option>
              <option value="0">Parcelado</option>
              <option value="1">Fixo</option>
              <option value="2">Simples</option>
            </Form.Control>
          </Form.Group> 

          <Button variant="dark" type="submit" > Adicionar </Button>

        </Form>
      </>
    );
  }
}