import React, { useEffect, useState } from "react";
import { Button, Card, Container, Table, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import WalletModal from "./WalletModal"

import "./Wallet.css";
import CustomCard from "../../components/customCard/CustomCard";
import { dateAdjust } from "../../utils/dateFormater";
import WalletModalDelete from "./WalletDeleteModal";


function SetModalDelete(props) {
  const [modalShow, setModalShow] = React.useState(false);
  console.log(props)
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
  const [sumAllValue, setSumAllValue] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [month, setMonth] = useState(localStorage.getItem("month"))
  const [year, setYear] = useState(localStorage.getItem("year"))

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.wallet.getEnable('Enable', month, year))
      .then(res => {
        setWallet(res.data);
      })
    return () => mounted = false;
  }, [month])

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, '', '', '', ''))
      .then(res => {
        setSumAllValue(res.data)
      })
    return () => mounted = false;
  }, [month])


  const valueTotal = wallet.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);


  const provisionedValue = valueTotal - sumAllValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);

  const sumAll = sumAllValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);

  const saldoTotal = wallet.reduce(function (prev, cur) {
    return prev + (cur.updatedValue === 0 ? cur.value : cur.updatedValue);
  }, 0);

  const lis = wallet.map(item => {
    {
      return (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>
            R$ {decimalAdjust(item.value)}
          </td>
          <td>
            R$ {item.updatedValue === 0 ? decimalAdjust(item.value) : decimalAdjust(item.updatedValue)}
          </td>
          <td>
            {item.finishAt ? 'Simples' : 'Fixa'}
          </td>
          <td className='tdd'>
            {<SetModal value={item.id} name={item.name} modalName="Editar" simbol="fas fa-edit" className='btn btn-primary'></SetModal>}{" "}
            {<SetModalDelete size="sm" className="btn btn-danger" simbol="fa fa-trash" modalName="Apagar" value={item}>Apagar</SetModalDelete>}{" "}
          </td>
        </tr>
      )
    }
  })


  return (
    <Container className="containerWallet">
      <div className="walletCards">
        <CustomCard
          title="Total carteira"
          children={decimalAdjust(valueTotal)}
          icon="fas fa-wallet blue fa-2x"
        >
        </CustomCard>
        <CustomCard
          title="Total Dividas"
          children={decimalAdjust(sumAll)}
          icon="fas fa-hand-holding-usd blue fa-2x"
        >
        </CustomCard>
        <CustomCard
          title="Saldo"
          children={saldoTotal === 0 ? decimalAdjust(valueTotal) : decimalAdjust(saldoTotal)}
          icon="fas fa-piggy-bank blue fa-2x"
        >
        </CustomCard>
        <CustomCard
          title="Provisionado"
          children={decimalAdjust(provisionedValue)}
          icon="fas fa-lightbulb blue fa-2x"
        >
        </CustomCard>

      </div>

      <Card className="cardWallet">
        <Table responsive hover variant="black" className="table" size="sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Saldo</th>
              <th>Tipo</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {lis}
          </tbody>
        </Table>
      </Card>
      {<SetModal name={'Adicionar'} modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></SetModal>}{" "}
    </Container>
  )
}
