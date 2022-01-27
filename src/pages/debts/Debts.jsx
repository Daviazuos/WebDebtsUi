import React, { useEffect } from "react";
import { Button, Card, Container, Table } from "react-bootstrap";
import ModalAddDebts from "../../components/modal/modalDebts";
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from "../../api";

import { decimalAdjust } from "../../utils/valuesFormater";
import { debtInstallmentTransform, debtTypeTransform } from "../../utils/enumFormatter";

import "./Debts.css";
import { CustomPagination } from "../../components/customPagination/customPagination";
import ModalInstallments from "../../components/installments/Installments";


function SetModal(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button className='addButton' variant='dark' onClick={() => setModalShow(true)}>
        <i className="fas fa-plus"></i> {props.modalName} Adicionar
      </Button>

      <ModalAddDebts
        show={modalShow}
        onHide={() => setModalShow(false)}
        head="Adicionar débitos"
      />
    </>
  );
}

function SetModalInstallments(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button className='btn btn-secondary' variant='dark' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
      <ModalInstallments
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}

function SetModalEdit(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button className={props.className} variant='dark' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>

      <ModalAddDebts
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}

function refreshPage() {
  window.location.reload();
}

function Delete(id) {
  axiosInstance.delete(Endpoints.debt.deleteById(id)).then(response => {
    const id = response.data.Body;
    refreshPage()
  })
  return (
    <>
    </>
  )
}


export default function Debts() {
  const [debts, setDebts] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);

  const pageChange = event => {
    setPageNumber(event.target.text);
  }

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.debt.filter(pageNumber, 10, ''))
      .then(res => {
        setDebts(res.data)
      })
    return () => mounted = false;
  }, [pageNumber])

  const lis = debts.items?.map(item => {
    {
      return (
        <tr key={item.id}>
          <td className='td1'>{item.name}</td>
          <td className='td1'>R$ {decimalAdjust(item.value)}</td>
          <td className='td1'>{debtInstallmentTransform(item.debtInstallmentType)}</td>
          <td className='td1'>{debtTypeTransform(item.debtType)}</td>
          <td className='tdd'>
            {<SetModalEdit value={item.id} name={item.name} modalName="" simbol="fas fa-edit" className='btn btn-primary'></SetModalEdit>}{" "}
            <Button className="btn btn-danger" onClick={() => Delete(item.id)}>
              <i className="fa fa-trash" aria-hidden="true"></i>
            </Button>
            {<SetModalInstallments value={item.id} name={item.name} modalName="" simbol="fas fa-search"></SetModalInstallments>}{" "}
          </td>
        </tr>
      )
    }
  })

  return (
    <div className="debts">
      <Container className="containerDebtpage">
        <Card className="cardTable">
          <Table responsive striped bordered hover variant="white" className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Origem</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {lis}
            </tbody>
          </Table>
          <CustomPagination currentPage={debts.currentPage} totalItems={debts.totalItems} totalPages={debts.totalPages} onChange={pageChange}></CustomPagination>
        </Card>
        {<SetModal modalName=""></SetModal>}{" "}
      </Container>
    </div>);
};
