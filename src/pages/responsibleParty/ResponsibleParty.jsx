import React, { useEffect } from "react";
import 'react-circular-progressbar/dist/styles.css';

import { Accordion, Button, Card, Modal, Table } from "react-bootstrap";
import { decimalAdjust } from "../../utils/valuesFormater";
import "./ResponsibleParty.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import ResponsiblePartyModal from "./ResponsiblePartyModal";

function SetModalAddResponsibleParty(props) {
  const [modalShow, setModalShow] = React.useState(false);
  const [refreshResponsibleParty, setRefreshResponsibleParty] = React.useState(false)

  return (
    <div className="ResponsibleModalButton">
      <Button variant="outline-secondary" onClick={() => setModalShow(true)}>Adicionar <i className="fas fa-plus"></i> </Button>
      <ResponsiblePartyModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        refresh={() => setRefreshResponsibleParty(true)}
        head={props.name}
        dataTable={props.dataTable}
      />
    </div>
  );
}

function SeeData(props) {
  const [modalShow, setModalShow] = React.useState(false);

  function updateValuesv2() {
    setModalShow(false)
  }

  return (
    <>
      <i className="fas fa-search fa-sm" onClick={() => setModalShow(true)} style={{ cursor: 'pointer', color: '#B3B8D4' }}></i>
      <Modal
        show={modalShow}
        size="lg"
        centered
        scrollable
        dialogClassName="GlobalModal"
        onHide={() => setModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped borderless hover size="sm" responsive>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {props.tdData}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

    </>
  );
}

export default function ResponsibleParty() {
  const [data, setData] = React.useState(undefined);
  const [responsiblePartyList, setResponsiblePartyList] = React.useState(undefined);
  const [dataRP, setDataRP] = React.useState(undefined);
  const [year, setYear] = React.useState(localStorage.getItem("year"))
  const [month, setMonth] = React.useState(localStorage.getItem("month"))
  const [modalShow, setModalShow] = React.useState(false);

  console.log(month)
  useEffect(() => {
    axiosInstance.get(Endpoints.debt.getDebtresponsibleParties(month, year, undefined))
      .then(res => {
        setData(res.data.map(item => {
          return (
            <tr>
              <td className="td1">{item.name}</td>
              <td className="td1">R$ {decimalAdjust(item.debtValue)} <SeeData tdData={item.debtsAppModel.map(valueItem => {
                return (
                  <tr>
                    <td>{valueItem.name}</td>
                    <td>R$ {decimalAdjust(valueItem?.installments[0]?.value)}</td>
                  </tr>
                )
              })} title='Valores a Pagar'></SeeData></td>
              <td className="td1">R$ {decimalAdjust(item.walletValue)} <SeeData tdData={item.walletAppModels.map(valueItem => {
                return (
                  <tr>
                    <td>{valueItem.name}</td>
                    <td>R$ {decimalAdjust(valueItem.value)}</td>
                  </tr>
                )
              })} title='Valores a Receber'></SeeData></td>
            </tr>
          )
        }));
      })
  }, [month])

  useEffect(() => {
    axiosInstance.get(Endpoints.responsibleParty.getByUser())
      .then(res => {
        setDataRP(res.data.map(item => {
          return (
            <tr>
              <td className="td1">{item.name}</td>
            </tr>
          )
        }));
      })
  }, [])


  return (
    <div>
      <span id="PagesTitle">Valor por pessoa</span>
      <Card className='cardTable'>
        <Table borderless striped responsive hover variant="white" className="tableFinancial" size="sm">
          <thead>
            <tr>
              <th className="td1">Nome</th>
              <th className="td1">Valor a pagar</th>
              <th className="td1">Valor a receber</th>
            </tr>
          </thead>
          <tbody>
            {data}
          </tbody>
        </Table>
      </Card>

      <SetModalAddResponsibleParty modalName="Adicionar" simbol="fas fa-plus" dataTable={dataRP}></SetModalAddResponsibleParty>
    </div>
  )
}
