import React, { useEffect } from "react";
import 'react-circular-progressbar/dist/styles.css';

import { Table } from "react-bootstrap";
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
      <button type="button" className="peopleAddButton" onClick={() => setModalShow(true)}>
        <i className="fas fa-plus" aria-hidden="true"></i> Adicionar pessoa
      </button>
      <ResponsiblePartyModal
        className="peopleCreateModal"
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
    <main className="peoplePage">
      <header className="peoplePageHeader">
        <div>
          <span className="peopleEyebrow">FINANÇAS / RELACIONAMENTOS</span>
          <h1>Pessoas</h1>
          <p>Visualize os valores vinculados a cada pessoa.</p>
        </div>
        <SetModalAddResponsibleParty modalName="Adicionar pessoa" dataTable={dataRP} />
      </header>

      <section className="peoplePanel">
        <header className="peoplePanelHeader">
          <div>
            <span className="peoplePanelIcon"><i className="fas fa-users" aria-hidden="true"></i></span>
            <div><h2>Resumo por pessoa</h2><p>{data.length} {data.length === 1 ? "pessoa" : "pessoas"}</p></div>
          </div>
        </header>
        <div className="peopleTableWrap">
        <Table borderless responsive hover className="peopleTable" size="sm">
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
                <td className="peopleStatusCell">
                  <span className={`peopleStatus ${item.debtsAppModel?.length ? (item.debtsAppModel.some(debt => debt.installments?.some(inst => inst.status !== 'Paid')) ? 'peopleStatus--pending' : 'peopleStatus--paid') : 'peopleStatus--empty'}`}>
                    {item.debtsAppModel?.length ? (item.debtsAppModel.some(debt => debt.installments?.some(inst => inst.status !== 'Paid')) ? 'Pendente' : 'Pago') : 'Nada a pagar'}
                  </span>
                </td>
                <td className="td1">
                  <button type="button" className="peopleDetailsButton" aria-label={`Ver detalhes de ${item.name}`} onClick={() => { setSelectedRP(item); setModalShow(true); }}>
                    <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))}
            {!data.length && <tr><td className="peopleEmptyState" colSpan="5">Nenhuma pessoa cadastrada.</td></tr>}
          </tbody>
        </Table>
        </div>

      </section>
      <ResponsiblePartyDetailsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        responsibleParty={selectedRP}
        refresh={refreshData}
      />
    </main>
  )
}
