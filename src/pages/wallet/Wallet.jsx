import React from "react";
import { Button, Card, Container, Table } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import WalletModal from "./WalletModal"


import "./Wallet.css";
import CustomCard from "../../components/customCard/CustomCard";
import { monthByNumber } from "../../utils/dateFormater";

const today = new Date();
const mm = String(today.getMonth() + 2).padStart(2, '0')
const yyyy = today.getFullYear()

function Delete(wallet) {
  const editWallet = {
    name: wallet.name,
    value: wallet.value,
    walletStatus: 'disable'
  };

  console.log(editWallet)
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

export default class Wallet extends React.Component {
  state = {
    wallet: [],
  }

  componentDidMount() {
    axiosInstance.get(Endpoints.wallet.getEnable())
      .then(res => {
        const wallet = res.data;
        this.setState({ wallet });
      })
  }

  render() {
    const valueTotal = this.state.wallet.reduce(function (prev, cur) {
      return prev + cur.value;
    }, 0);
    const lis = this.state.wallet.map(item => {
      {
        return (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>
              R$ {decimalAdjust(item.value)}
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
        <CustomCard
          title="Total do mês"
          subTitle={monthByNumber(mm-1)+"/"+yyyy}
          children={decimalAdjust(valueTotal)}
          icon="fas fa-wallet red font-large-2"
        >
        </CustomCard>
        
        <Card className="cardAnalitic">
          <Table responsive striped bordered hover variant="white" className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Valor</th>
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
}