import React, { useEffect } from "react";
import { Button, Card, Container, Table, Form, Modal } from "react-bootstrap";
import ModalAddDebts from "../../components/modal/modalDebts";
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from "../../api";

import { decimalAdjust } from "../../utils/valuesFormater";
import { debtInstallmentTransform, debtTypeTransform } from "../../utils/enumFormatter";

import "./Debts.css";
import { CustomPagination } from "../../components/customPagination/customPagination";
import ModalInstallments from "../../components/installments/Installments";
import ModalDelete from "../../components/modalDelete/ModalDelete";
import EditDebtForm from "../../components/form/editDebtForm";
import { dateAdjust } from "../../utils/dateFormater";


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
      <Button size="sm" className='btn btn-secondary' variant='dark' onClick={() => setModalShow(true)}>
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
      <Button size="sm" className='btn btn-secondary' variant='dark' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
      <Modal
        show={modalShow ? modalShow : props.show}
        onHide={props.onHide ? props.onHide : () => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Card>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {props.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditDebtForm data={props.data} id={props.value}></EditDebtForm>
          </Modal.Body>
        </Card>
      </Modal>
    </>
  );
}

function SetModalDelete(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button size="sm" className='btn btn-danger' variant='dark' onClick={() => setModalShow(true)}>
        <i className="fa fa-trash"></i> {props.modalName}
      </Button>
      <ModalDelete
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
        deleteUrl={Endpoints.debt.deleteById(props.id)}
      />
    </>
  );
}


export default function Debts() {
  const [debts, setDebts] = React.useState([]);
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('');
  const [origin, setOrigin] = React.useState('');
  const [pageNumber, setPageNumber] = React.useState(1);

  const pageChange = event => {
    setPageNumber(event.target.text);
  }

  const nameChange = event => {
    setName(event.target.value);
  }

  const typeChange = event => {
    setType(event.target.value);
  }

  const originChange = event => {
    setOrigin(event.target.value);
  }

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filter(pageNumber, 15, origin, name, type))
      .then(res => {
        setDebts(res.data)
      })
  }, [pageNumber, name, origin, type])
  const lis = debts.items?.map(item => {
    {
      return (
        <tr key={item.id}>
          <td className='td1'>{item.name}</td>
          <td className='td1'>R$ {decimalAdjust(item.value)}</td>
          <td className='td1'>{debtInstallmentTransform(item.debtInstallmentType)}</td>
          <td className='td1'>{debtTypeTransform(item.debtType)}</td>
          <td className='td1'>{dateAdjust(item.date)}</td>
          <td className='td1'>{(item.numberOfInstallments == 0) ? '-' : item.numberOfInstallments}</td>
          <td className='td1'>{(item.paidInstallment == 0 || item.paidInstallment == null) ? '-' : item.paidInstallment}</td>
          <td className='tdd'>
            {<SetModalEdit value={item.id} data={item} name={item.name} modalName="Editar" simbol="fas fa-edit" className='btn btn-primary'></SetModalEdit>}{" "}
            {<SetModalDelete id={item.id} modalName="Apagar"></SetModalDelete>}
            {<SetModalInstallments value={item.id} name={item.name} modalName="Parcelas" simbol="fas fa-search"></SetModalInstallments>}{" "}
          </td>
        </tr>
      )
    }
  })

  return (
    <div className="debts">
      <Container className="containerDebtpage">
        <Card className="cardTable">
          <Form className="formTable">
            <Form.Group className="mb-3">
              <Form.Control type="search" placeholder="Filtrar por Nome" id="nameSearch" onChange={nameChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="search" id="typeSearch" as="select" onChange={typeChange}>
              <option value="">Filtrar por tipo</option>
              <option value="Installment">Parcelado</option>
              <option value="Fixed">Fixo</option>
              <option value="Simple">Simples</option>
              </Form.Control>
            </Form.Group>
            <Form.Control id="nameSearch" type="search" as="select" name='debtInstallmentType' onChange={originChange}>
              <option value="">Filtrar por origem</option>
              <option value="Simple">Simples</option>
              <option value="Card">Cartão de crédito</option>
            </Form.Control>
          </Form>
          <Table responsive hover variant="black" className="table" size="sm">
            <thead>
              <tr className='tr'>
                <th>Nome</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Origem</th>
                <th>data Início</th>
                <th>Parcelas</th>
                <th>Parcela pagas</th>
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
