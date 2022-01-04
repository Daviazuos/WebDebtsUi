import React from "react";
import { Button, Card, Container } from "react-bootstrap";
import Table from "../table/table"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import WalletModal from "./WalletModal"


import "./Wallet.css";



function SetModal(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
      <>
        <Button className='modalButton' variant='dark' onClick={() => setModalShow(true)}>
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
        wallet: "",
    }
  
    componentDidMount() {
      const today = new Date();
      const mm = String(today.getMonth() + 2).padStart(2, '0')
      const yyyy = today.getFullYear()
      axiosInstance.get(Endpoints.wallet.getEnable())
        .then(res => {
          const wallet = res.data;
          this.setState({ wallet });
        })
    }
  
    render() { 
        console.log(this.state.wallet)
      return (
        <Container className="containerWallet">
        <Card className="cardWallet">
              <span className="totalAllValue"><i className="fas fa-wallet"></i> Valor por mês</span>
              <span className="allValue"> R$ {decimalAdjust(this.state.wallet.value)} </span>
              {<SetModal value={this.state.wallet.id} name={this.state.wallet.name} modalName="Ajustar Valor" simbol="fas fa-align-justify"></SetModal>}{" "}
        </Card>
      </Container>
      )
    }
  }