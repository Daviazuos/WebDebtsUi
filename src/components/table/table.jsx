import React, { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from "../../api";

import "./Table.css";
import ModalInstallments from "../installments/Installments"
import ModalAddDebts from "../../components/modal/modalDebts";

import { decimalAdjust } from "../../utils/valuesFormater";
import { debtInstallmentTransform } from "../../utils/enumFormatter";
import { CustomPagination } from "../customPagination/customPagination";

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

export default function DebtList() {
  const [debts, setDebts] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);

  const pageChange = event => {
    console.log(event.target.text)
    setPageNumber(event.target.text);
  }

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.debt.filter(pageNumber))
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
    <>
      <Table responsive striped bordered hover variant="white" className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {lis}
        </tbody>
      </Table>
      <CustomPagination currentPage={debts.currentPage} totalItems={debts.totalItems} totalPages={debts.totalPages} onChange={pageChange}></CustomPagination>
    </>
  )
}
