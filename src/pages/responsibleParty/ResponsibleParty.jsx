import React, { useEffect } from "react";
import 'react-circular-progressbar/dist/styles.css';

import { Button, Card, Modal, Table } from "react-bootstrap";
import { decimalAdjust } from "../../utils/valuesFormater";
import "./ResponsibleParty.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import ResponsiblePartyModal from "./ResponsiblePartyModal";
import ResponsiblePartyDetailsModal from "./ResponsiblePartyDetailsModal";
import { statusTransform } from "../../utils/enumFormatter";

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

export default function ResponsibleParty() {
  const [data, setData] = React.useState([]);
  const [dataRP, setDataRP] = React.useState(undefined);
  const [year, setYear] = React.useState(localStorage.getItem("year"))
  const [month, setMonth] = React.useState(localStorage.getItem("month"))
  const [selectedRP, setSelectedRP] = React.useState(null);
  const [modalShow, setModalShow] = React.useState(false);

  const refreshData = () => {
    axiosInstance.get(Endpoints.debt.getDebtresponsibleParties(month, year, undefined))
      .then(res => {
        setData(res.data);
      })
  };

  useEffect(() => {
    refreshData();
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
              <th className="td1">Status</th>
              <th className="td1">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.name}>
                <td className="td1">{item.name}</td>
                <td className="td1">R$ {decimalAdjust(item.debtValue)}</td>
                <td className="td1">R$ {decimalAdjust(item.walletValue)}</td>
                <td className="td1">{item.debtsAppModel && item.debtsAppModel.length > 0 ? (item.debtsAppModel.some(debt => debt.installments && debt.installments.some(inst => inst.status !== 'Paid')) ? 'Pendente' : 'Pago') : 'Nada a pagar'}</td>
                <td className="td1">
                  <i className="fas fa-search fa-lg" onClick={() => { setSelectedRP(item); setModalShow(true); }} style={{cursor: 'pointer', color: '#B3B8D4'}}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <SetModalAddResponsibleParty modalName="Adicionar" simbol="fas fa-plus" dataTable={dataRP}></SetModalAddResponsibleParty>

      <ResponsiblePartyDetailsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        responsibleParty={selectedRP}
        refresh={refreshData}
      />
    </div>
  )
}
