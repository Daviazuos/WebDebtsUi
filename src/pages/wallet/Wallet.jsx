import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Form, Table } from "react-bootstrap";
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
import CustomCardSize from "../../components/customCardSize/CustomCardSize";


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
  const [wallets, setWallets] = useState([]);
  const [month, setMonth] = useState(localStorage.getItem("month"))
  const [year, setYear] = useState(localStorage.getItem("year"))
  const [status, setStatus] = useState(false)
  const [walletInstallments, setWalletInstallments] = useState([])

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
    axiosInstance.get(Endpoints.wallet.getResponsiblePartyWallets(month, year))
      .then(res => {
        setWallets(res.data);
        let walletInstallmentsTemp = [];

        for (let wallet of res.data) {
          for (let walletAppModel of wallet.walletAppModels) {
            walletInstallmentsTemp.push({
              ...walletAppModel.walletInstallments[0],
            });
          }
        }
        setWalletInstallments(walletInstallmentsTemp);
      })
  }, [month, status])

  const toReceiveValue = walletInstallments.filter(({ receivedStatus }) => receivedStatus === false).reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);

  const receivedValue = walletInstallments.filter(({ receivedStatus }) => receivedStatus === true).reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);

  const lis = wallets.map(item => {
    let hasPending = item.walletAppModels.some(walletAppModel =>
      walletAppModel.walletInstallments.some(installment => !installment.receivedStatus)
    );
    let showPending = hasPending === true ?
      <div className="pending">
        <i className="fas fa-exclamation-triangle red"></i>
        <div className="textPending">valores a receber</div></div> : '';

    let accordionName = <div className="accordionName">{`${item.name} - R$ ${decimalAdjust(item.value)}`}</div>
    return (
      <Accordion.Item eventKey={item.name}>
        <Accordion.Header>{accordionName}{showPending}</Accordion.Header>
        <Accordion.Body>
          <Table borderless striped responsive hover variant="black" size="sm">
            <thead>
              <tr className="walletTable">
                <th>Nome</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Parcelas</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {item.walletAppModels.map(itemWallet => {
                return (<tr key={itemWallet.id} className="walletTable">
                  <td>{itemWallet.name}</td>
                  <td>
                    R$ {decimalAdjust(itemWallet.walletInstallments[0].value)}
                  </td>
                  <td>
                    {debtInstallmentTransform(itemWallet.walletInstallmentType)}
                  </td>
                  {(itemWallet.walletInstallmentType === 'Installment') ?
                    <td>
                      {itemWallet.walletInstallments[0].installmentNumber}/{itemWallet.numberOfInstallments}
                    </td> : <td> 1/1</td>}
                  <td className='tdd'>
                    {<SetModal value={itemWallet.id} name={itemWallet.name} modalName="" simbol="fas fa-edit" className='btn btn-primary'></SetModal>}{" "}
                    {<SetModalDelete size="sm" className="btn btn-danger" simbol="fa fa-trash" modalName="" value={itemWallet}>Apagar</SetModalDelete>}{" "}
                    <Form>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        label={walletInstallmentStatusTransform(itemWallet.walletInstallments[0].receivedStatus)}
                        checked={itemWallet.walletInstallments[0].receivedStatus}
                        onClick={() => EditWalletStatus(itemWallet.name, itemWallet.value, !itemWallet.walletInstallments[0].receivedStatus, itemWallet.date, itemWallet.walletInstallments[0].id)}
                      />
                    </Form>
                  </td>
                </tr>)
              })}

            </tbody>
          </Table>

        </Accordion.Body>
      </Accordion.Item>
    )
  })


  return (
    <div>
      <span id="PagesTitle">Carteira</span>
      <div className="walletGroup">
        <Card className="cardWallet">
          <Accordion defaultActiveKey="0">
            {lis}
          </Accordion>
        </Card>
        <div className="cardGroup">
          <CustomCardSize
            title="Recebido"
            children={decimalAdjust(receivedValue)}
            icon="fas fa-arrow-down success custom-icon"
            data={700.00}
            size={260}></CustomCardSize>
          <CustomCardSize
            title="A receber"
            children={decimalAdjust(toReceiveValue)}
            icon="fas fa-arrow-down red custom-icon"
            data={700.00}
            size={260}></CustomCardSize>
        </div>
      </div>
      {<SetModalAdd name={'Adicionar'} modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></SetModalAdd>}{" "}
    </div>
  )
}
