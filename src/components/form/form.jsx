import React from "react";
import { Endpoints } from '../../api/endpoints';

import { Form, Button } from 'react-bootstrap';
import { axiosInstance } from "../../api";


function refreshPage() {
  window.location.reload();
}

export default class DebtList extends React.Component {
  state = {
    name: '',
    value: '',
    date: '',
    numberOfInstallments: '0',
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
    this.props.cardId === null ? axiosInstance.post(Endpoints.debt.add(), addDebts).then(response => {
      const id = response.data.Body;
      refreshPage()
    }) : axiosInstance.post(Endpoints.card.addValues(this.props.cardId), addDebts).then(response => {
      const id = response.data.Body;
      refreshPage()
    }) 
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
            <Form.Label>Tipo de débito</Form.Label>
            <Form.Control as="select" name='debtInstallmentType' onChange={this.typeChange}>
              <option>Selecione o Tipo de debito</option>
              <option value="0">Parcelado</option>
              <option value="1">Fixo</option>
              <option value="2">Simples</option>
            </Form.Control>
          </Form.Group>
          {this.state.debtInstallmentType === "0"?
          <Form.Group>
            <Form.Label>Quantidade de Parcelas</Form.Label>
            <Form.Control name='numberOfInstallments' type="number" onChange={this.installmentsChange} placeholder="Entre com o quantidade de parcelas" />
          </Form.Group>: ""}
          <Button variant="dark" type="submit"> Adicionar </Button>
        </Form>
      </>
    );
  }
}