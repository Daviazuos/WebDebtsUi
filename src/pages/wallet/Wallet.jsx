import React, { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import WalletModal from "./WalletModal"

import "./Wallet.css";
import WalletModalDelete from "./WalletDeleteModal";
import { debtInstallmentTransform, walletStatusTransform } from "../../utils/enumFormatter";
import WalletModalEdit from "./WalletModalEdit";


function SetModalDelete(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button size="sm" className={props.className} variant='dark' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
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
      <Button size="sm" className={props.className} variant='dark' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
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
      <Button size="sm" className={props.className} variant='dark' onClick={() => setModalShow(true)}>
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

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.wallet.getEnable(month, year))
      .then(res => {
        setWallet(res.data);
      })
    return () => mounted = false;
  }, [month])

  const lis = wallet.map(item => {
    {
      return (
        <tr key={item.id}>
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

          <td>{walletStatusTransform(item.walletStatus)}</td>
          <td className='tdd'>
            {<SetModal value={item.id} name={item.name} modalName="Editar" simbol="fas fa-edit" className='btn btn-primary'></SetModal>}{" "}
            {<SetModalDelete size="sm" className="btn btn-danger" simbol="fa fa-trash" modalName="Apagar" value={item}>Apagar</SetModalDelete>}{" "}
          </td>
        </tr>
      )
    }
  })


  return (
    <div className="containerWallet">
      <Card className="cardWallet">
        <Table responsive hover variant="black" className="table" size="sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Parcelas</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {lis}
          </tbody>
        </Table>
      </Card>
      {<SetModalAdd name={'Adicionar'} modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></SetModalAdd>}{" "}
    </div>
  )
}
