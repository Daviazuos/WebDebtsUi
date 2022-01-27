import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Container, Table } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import WalletModal from "./WalletModal"


import "./Wallet.css";
import CustomCard from "../../components/customCard/CustomCard";
import { monthByNumber } from "../../utils/dateFormater";
import Context from "../../context/Context";

const today = new Date();
const mm = String(today.getMonth() + 2).padStart(2, '0')
const yyyy = today.getFullYear()

function Delete(wallet) {
  const editWallet = {
    name: wallet.name,
    value: wallet.value,
    walletStatus: 'disable'
  };

  axiosInstance.put(Endpoints.wallet.put(wallet.id), editWallet).then(response => {
    const id = response.data.Body;
    refreshPage()
  })
  return (
    <>
    </>
  )
}


function refreshPage() {
  window.location.reload();
}


function SetModal(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button className={props.className} variant='dark' onClick={() => setModalShow(true)}>
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
  const [sumAllValue, setSumAllValue] = React.useState([]);
  const [wallet, setWallet] = React.useState([]);
  const [month, setMonth] = useContext(Context);


  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.wallet.getEnable('Enable', month, '2022'))
      .then(res => {
        setWallet(res.data);
      })
    return () => mounted = false;
  }, [month])

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, '2022', '', '', '', ''))
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
          <td className='tdd'>
            {<SetModal value={item.id} name={item.name} modalName="Editar" simbol="fas fa-edit" className='btn btn-primary'></SetModal>}{" "}
            <Button className="btn btn-danger" onClick={() => Delete(item)}>
              <i className="fa fa-trash" aria-hidden="true"></i> Apagar
            </Button>
          </td>
        </tr>
      )
    }
  })


  return (
    <Container className="containerWallet">
      <div className="walletCards">
        <CustomCard
          title="Total"
          subTitle={monthByNumber(mm - 1) + "/" + yyyy}
          children={decimalAdjust(valueTotal)}
          icon="fas fa-wallet red fa-4x"
        >
        </CustomCard>
        <CustomCard
          title="Total Dividas"
          subTitle={monthByNumber(mm - 1) + "/" + yyyy}
          children={decimalAdjust(sumAll)}
          icon="fas fa-wallet red fa-4x"
        >
        </CustomCard>
        <CustomCard
          title="Saldo"
          children={saldoTotal === 0 ? decimalAdjust(valueTotal) : decimalAdjust(saldoTotal)}
          icon="fas fa-wallet red fa-4x"
        >
        </CustomCard>
        <CustomCard
          title="Saldo Provisionado"
          children={decimalAdjust(provisionedValue)}
          icon="fas fa-wallet red fa-4x"
        >
        </CustomCard>

      </div>

      <Card className="cardWallet">
        <Table responsive striped bordered hover variant="white" className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Saldo</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {lis}
          </tbody>
        </Table>
      </Card>
      {<SetModal name={'Adicionar novo valor'} modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></SetModal>}{" "}
    </Container>
  )
}