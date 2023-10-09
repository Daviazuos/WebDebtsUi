import React, { useEffect } from "react";

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { Button, Card, Table } from "react-bootstrap";
import CustomModal from "../../components/customModal/CustomModal";
import ModalGoals from "../../components/goalsModal/modalGoals";
import { decimalAdjust } from "../../utils/valuesFormater";
import "./Goals.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { dateAdjust } from "../../utils/dateFormater";
import DebtModal from "../../components/debtModal/DebtModal";



function AddGoalsModal(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button size="sm" className={props.className} variant='dark' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>

      <ModalGoals
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.modalName}
        value={props.value}
        data={props.data}
      />
    </>
  );
}


function SetModalCredDebts(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button style={{ margin: '0px', color: 'white' }} className='btn-custom' variant='custom' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
      <CustomModal
        id={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
        month={props.month}
        totalValue={props.totalValue}
      />
    </>
  );
}


export default function Goals() {
  const [data, setData] = React.useState({ 'items': [] });

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filter(1, 9999, '', '', '', '', true))
      .then(res => {
        setData(res.data);
      })
  }, [])


  const lis = data.items.map(item => {
    return (
      <tr>
        <td className="td1">{item.name}</td>
        <td className="td1">R$ {decimalAdjust(item.value)}</td>
        <td className="td1">{dateAdjust(item.date)}</td>
        <td className="td1"><DebtModal id={item.id}></DebtModal></td>
      </tr>
    )
  })


  return (
    <div>
      <Card className='cardTable'>
        <Table responsive hover variant="white" className="tableFinancial" size="sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {lis}
          </tbody>
        </Table>
      </Card>
      <AddGoalsModal modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></AddGoalsModal>
    </div>
  )
}
