import React from "react";
import { Endpoints } from '../../api/endpoints';
import { Form, Button } from 'react-bootstrap';
import { axiosInstance } from "../../api";
import { debtInstallmentTypeToNumber } from "../../utils/enumFormatter";
import MaskedFormControl from "../../utils/maskedInputs";


function refreshPage() {
  window.location.reload();
}

export default class EditDebtForm extends React.Component {
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
  valueChange = (event, value, maskedValue) => {
    this.setState({ value: value });
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

    const editDebts = {
      name: this.state.name || this.props.data?.name,
      value: this.state.value || this.props.data?.value,
      date: this.state.date || this.props.data?.date,
      numberOfInstallments: this.state.numberOfInstallments || this.props.data?.numberOfInstallments,
      debtInstallmentType: this.state.debtInstallmentType || this.props.data?.debtInstallmentType
    };
    axiosInstance.put(Endpoints.debt.putDebt(this.props.id), editDebts).then(response => {
      refreshPage()
    })
  }

  render() {
    console.log(this.props.data?.date)
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control required="true" name="name" onChange={this.nameChange} placeholder="Entre com o nome" defaultValue={this.props.data?.name} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Valor</Form.Label>
            <MaskedFormControl currency="BRL" required="true" name='value' onChange={this.valueChange} placeholder="Entre com o valor total" defaultValue={this.props.data?.value}/>
          </Form.Group>

          <Form.Group>
            <Form.Label>Data</Form.Label>
            <Form.Control required="true" name='date' type="date" onChange={this.dateChange} placeholder="Entre com o data" defaultValue={this.props.data?.date}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Tipo de débito</Form.Label>
            <Form.Control required="true" as="select" name='debtInstallmentType' onChange={this.typeChange} defaultValue={debtInstallmentTypeToNumber(this.props.data?.debtInstallmentType)}>
              <option>Selecione o Tipo de debito</option>
              <option value="0">Parcelado</option>
              <option value="1">Fixo</option>
              <option value="2">Simples</option>
            </Form.Control>
          </Form.Group>
          {this.state.debtInstallmentType === "0"?
          <Form.Group>
            <Form.Label>Quantidade de Parcelas</Form.Label>
            <Form.Control name='numberOfInstallments' type="number" onChange={this.installmentsChange} placeholder="Entre com o quantidade de parcelas" defaultValue={this.props.data?.numberOfInstallments}/>
          </Form.Group>: ""}
          <Button variant="dark" type="submit"> Atualizar </Button>
        </Form>
      </>
    );
  }
}