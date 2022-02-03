import React, { useEffect } from "react";
import { Button, Card, Container, Table, Form } from "react-bootstrap";
import ModalAddDebts from "../../components/modal/modalDebts";
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from "../../api";

import { decimalAdjust } from "../../utils/valuesFormater";
import { debtInstallmentTransform, debtTypeTransform } from "../../utils/enumFormatter";

import "./Debts.css";
import { CustomPagination } from "../../components/customPagination/customPagination";
import ModalInstallments from "../../components/installments/Installments";
import ModalDelete from "../../components/modalDelete/ModalDelete";


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
  const [origin, setOrigin] = React.useState('');
  const [pageNumber, setPageNumber] = React.useState(1);

  const pageChange = event => {
    setPageNumber(event.target.text);
  }

  const nameChange = event => {
    setName(event.target.value);
  }
  
  const originChange = event => {
    setOrigin(event.target.value);
  }

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.debt.filter(pageNumber, 8, '', ''))
      .then(res => {
        setDebts(res.data)
      })
    return () => mounted = false;
  }, [pageNumber])

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.debt.filter(pageNumber, 8, origin, name))
      .then(res => {
        setDebts(res.data)
      })
    return () => mounted = false;
  }, [name, origin])

  const lis = debts.items?.map(item => {
    {
      return (
        <tr key={item.id}>
          <td className='td1'>{item.name}</td>
          <td className='td1'>R$ {decimalAdjust(item.value)}</td>
          <td className='td1'>{debtInstallmentTransform(item.debtInstallmentType)}</td>
          <td className='td1'>{debtTypeTransform(item.debtType)}</td>
          <td className='tdd'>
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
              <Form.Control type="search" placeholder="Nome" id="nameSearch" onChange={nameChange} />
            </Form.Group>
            <Form.Control  id="nameSearch" as="select" name='debtInstallmentType' onChange={originChange}>
              <option value="">Selecione a origem</option>
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
