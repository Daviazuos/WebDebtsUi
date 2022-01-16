import React, { useState, useEffect } from "react";
import { Card, Table, Button } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import { dateAdjust, monthByNumber } from "../../utils/dateFormater";
import { statusTransform } from "../../utils/enumFormatter";
import ModalPaid from "../Modals/ModalPaid";

function SetStatus(id, status) {
  axiosInstance.put(Endpoints.debt.put(id, status)).then(response => {
    const id = response.data.Body;
    refreshPage()
  })
  return (
    <>
      Status Trocado!
    </>
  )
}

function SetModalPaid(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button className='btn btn-green' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
      <ModalPaid
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}

const today = new Date();
const mm = String(today.getMonth() + 1).padStart(2, '0')
const yyyy = today.getFullYear()

function refreshPage() {
  window.location.reload();
}

export default class PersonList extends React.Component {
  state = {
    installments: [],
    status: ""
  }

  componentDidMount() {
    axiosInstance.get(Endpoints.debt.filterInstallments(1, '', mm, yyyy, '', ''))
      .then(res => {
        const installments = res.data;
        this.setState({ installments });
      })
  }

  render() {

    const lis = this.state.installments.items?.map(item => {
      return (
        <tr>
          <td>{item.debtName}</td>
          <td>R$ {decimalAdjust(item.value)}</td>
          <td>{dateAdjust(item.date)}</td>
          <td>{statusTransform(item.status)}</td>
          <td className="buttonPaid">
            <SetModalPaid modalName="Pagar" value={item.id}></SetModalPaid>
            <Button className="btn btn-danger" onClick={() => SetStatus(item.id, "NotPaid")}>Pendente <i className="fas fa-times"></i>
            </Button>
          </td>
          <td>{dateAdjust(item.paymentDate)}</td>
        </tr>
      )
    })

    return (
      <>
        <Card className='cardTable'>
            <span className="month">{monthByNumber(mm)}/{yyyy}</span>
            <Table responsive striped bordered hover variant="white" className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Valor</th>
                  <th>Data de vencimento</th>
                  <th>Status</th>
                  <th>Ação</th>
                  <th>Data de pagamento</th>
                </tr>
              </thead>
              <tbody>
                {lis}
              </tbody>
            </Table>
        </Card>
      </>
    )
  }
}