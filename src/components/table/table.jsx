import React from "react";
import { Button, Table } from "react-bootstrap";
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from "../../api";

import "./Table.css";
import ModalInstallments from "../installments/Installments"
import ModalAddDebts from "../../components/modal/modalDebts";

import { decimalAdjust } from "../../utils/valuesFormater";
import { debtInstallmentTransform } from "../../utils/enumFormatter";

function SetModalInstallments(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button className='btn btn-secondary' variant='dark' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
      <ModalInstallments
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}

function SetModalEdit(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button className={props.className} variant='dark' onClick={() => setModalShow(true)}>
       <i className="fas fa-plus"></i> {props.modalName} 
      </Button>

      <ModalAddDebts
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}

function refreshPage() {
  window.location.reload();
}

function Delete(id) {
  axiosInstance.delete(Endpoints.debt.deleteById(id)).then(response => {
    const id = response.data.Body;
    refreshPage()
  })
  return (
    <>
    </>
  )
}


export default class DebtList extends React.Component {
  state = {
    debts: []
  }

  componentDidMount() {
    axiosInstance.get(Endpoints.debt.filter(1))
      .then(res => {
        const debts = res.data;
        this.setState({ debts });
      })
  }

  render() {
    const lis = this.state.debts.items?.map(item => {
      {
        return (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>
              R$ {decimalAdjust(item.value)}
            </td>
            <td>{debtInstallmentTransform(item.debtInstallmentType)}</td>
            <td className='tdd'>
              {<SetModalEdit value={item.id} name={item.name} modalName="Editar" simbol="fas fa-edit" className='btn btn-primary'></SetModalEdit>}{" "}
              <Button className="btn btn-danger" onClick={() => Delete(item.id)}>
                <i className="fa fa-trash" aria-hidden="true"></i> Apagar
              </Button>
              {<SetModalInstallments value={item.id} name={item.name} modalName="Parcelas" simbol="fas fa-align-justify"></SetModalInstallments>}{" "}
            </td>
          </tr>
        )
      }
    })
    return (
      <Table responsive striped bordered hover variant="white" className="table">
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
