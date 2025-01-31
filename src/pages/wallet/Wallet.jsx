import React, { useEffect, useState } from "react";
import { Button, Card, Form, Table } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import WalletModal from "./WalletModal"

import "./Wallet.css";
import WalletModalDelete from "./WalletDeleteModal";
import { debtInstallmentTransform, walletInstallmentStatusTransform, walletStatusTransform } from "../../utils/enumFormatter";
import WalletModalEdit from "./WalletModalEdit";
import CustomCard from "../../components/customCard/CustomCard";
import { refreshPage } from "../../utils/utils";


function SetModalDelete(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <i className={props.simbol} onClick={() => setModalShow(true)}></i> {props.modalName}
      <WalletModalDelete
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}


function SetModal(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <i className={props.simbol} onClick={() => setModalShow(true)}></i> {props.modalName}
      <WalletModalEdit
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}

function SetModalAdd(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button size="sm" className={props.className} style={{ backgroundColor: "#1A4173", borderColor: "#1A4173" }} variant='dark' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
      <WalletModal
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}

export default function Wallet() {
  const [wallet, setWallet] = useState([]);
  const [month, setMonth] = useState(localStorage.getItem("month"))
  const [year, setYear] = useState(localStorage.getItem("year"))
  const [status, setStatus] = useState(false)

  function EditWalletStatus(name, value, walletStatus, date, id) {
    const editWallet = {
      ReceivedStatus: walletStatus,
    }
    axiosInstance.put(Endpoints.wallet.putInstallment(id), editWallet).then(res => {
      setStatus(!status)
    }
    )
  }

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.wallet.getEnable(month, year))
      .then(res => {
        setWallet(res.data);
      })
    return () => mounted = false;
  }, [month, status])

  const toReceiveValue = wallet.filter(({ receivedStatus }) => receivedStatus === false).reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);

  const receivedValue = wallet.filter(({ receivedStatus }) => receivedStatus === true).reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);
  const lis = wallet.map(item => {
    return (
      <tr key={item.id} className="walletTable">
        <td>{item.name}</td>
        <td>
          R$ {decimalAdjust(item.value)}
        </td>
        <td>
          {debtInstallmentTransform(item.walletInstallmentType)}
        </td>
        {(item.walletInstallmentType === 'Installment') ?
          <td>
            {item.installmentNumber}/{item.numberOfInstallments}

          </td> : <td> 1/1</td>}
        <td>
          {item.responsiblePartyName}
        </td>
        <td className='tdd'>
          {<SetModal value={item.id} name={item.name} modalName="" simbol="fas fa-edit" className='btn btn-primary'></SetModal>}{" "}
          {<SetModalDelete size="sm" className="btn btn-danger" simbol="fa fa-trash" modalName="" value={item}>Apagar</SetModalDelete>}{" "}
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label={walletInstallmentStatusTransform(item.receivedStatus)}
              checked={item.receivedStatus}
              onClick={() => EditWalletStatus(item.name, item.value, !item.receivedStatus, item.date, item.installmentId)}
            />
          </Form>
        </td>
      </tr>
    )
  })


  return (
    <div>
      <span id="PagesTitle">Carteira</span>
      <div className="walletGroup">
        <Card className="cardWallet">
          <Table  borderless striped responsive hover variant="black" size="sm">
            <thead>
              <tr className="walletTable">
                <th>Nome</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Parcelas</th>
                <th>Pessoa vinculada</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {lis}
            </tbody>
          </Table>
        </Card>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <CustomCard
            title="Recebido"
            children={decimalAdjust(receivedValue)}
            icon="fas fa-arrow-down success fa-2x"
            data={700.00}></CustomCard>
          <CustomCard
            title="A receber"
            children={decimalAdjust(toReceiveValue)}
            icon="fas fa-arrow-down red fa-2x"
            data={700.00}></CustomCard>
        </div>
      </div>
      {<SetModalAdd name={'Adicionar'} modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></SetModalAdd>}{" "}
    </div>
  )
}
