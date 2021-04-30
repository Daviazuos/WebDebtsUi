import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Card } from "react-bootstrap";
import axios from "axios";
import "./Table.css";
import ModalInstallments from "../installments/Installments"

function SetModal(props) {
  const [modalShow, setModalShow] = React.useState(false);
  const debtName = `Lista de Parcelas do ${props.name}`;
  return (
    <>
      <Button className='modalButton' variant='dark' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
      <ModalInstallments
        value = {props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={debtName}
      />
    </>
  );
}

function refreshPage(){ 
  window.location.reload(); 
}

function Delete(id){
  axios.delete(`https://localhost:5001/Debts/Delete?Id=${id}`)
  refreshPage()
  return(
    <>
      deletado!
    </>
  )
}


export default class DebtList extends React.Component {
  state = {
    debts: []
  }

  componentDidMount() {

    axios.get(`https://localhost:5001/Debts/FilterDebt`)
      .then(res => {
        const debts = res.data;
        this.setState({ debts });
      })
  }

  render() {
    const lis = this.state.debts.map(item => {
      if (item.debtInstallmentType == this.props.type) {
        return (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>
              R$ {item.value}
            </td>
            <td>{item.debtInstallmentType}</td>
            <td className='tdd'>
              <Button className="btn btn-primary">
                <i className="fas fa-edit"></i>
              </Button>
              <Button className="btn btn-danger" onClick={() => Delete(item.id)}>
                <i className="fa fa-trash" aria-hidden="true"></i>
              </Button>
              {<SetModal value={item.id} name={item.name} modalName="Parcelas" simbol="fas fa-align-justify"></SetModal>}{" "}
            </td>
          </tr>
        )
      }
    })
    return (
      <Table striped bordered hover variant="white" className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {lis}
        </tbody>
      </Table>
    )
  }
}
