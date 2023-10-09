import React, { useEffect } from "react";
import { Button, Card, Container, Table, Form, Modal } from "react-bootstrap";
import ModalAddDebts from "../../components/modal/modalDebts";
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from "../../api";

import { decimalAdjust } from "../../utils/valuesFormater";
import { debtInstallmentTransform, debtTypeTransform } from "../../utils/enumFormatter";

import "./Debts.css";
import ModalInstallments from "../../components/installments/Installments";
import ModalDelete from "../../components/modalDelete/ModalDelete";
import { dateAdjust } from "../../utils/dateFormater";
import PaginationComponent from "../../components/customPagination/paginationComponent";
import LoadingButton from "../../components/loadingButton/LoadingButton";
import DebtModal from "../../components/debtModal/DebtModal";


function SetModal(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button size="sm" className={props.className} variant='dark' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>

      <ModalAddDebts
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.modalName}
        value={props.value}
        data={props.data}
      />
    </>
  );
}

export default function Debts() {
  const [debts, setDebts] = React.useState([]);
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [origin, setOrigin] = React.useState('');
  const [pageNumber, setPageNumber] = React.useState(1);
  const [list_categories, setlist_categories] = React.useState([]);

  const nameChange = event => {
    setName(event.target.value);
  }

  const categoryChange = event => {
    setCategory(event.target.value);
  }

  const typeChange = event => {
    setType(event.target.value);
  }

  const originChange = event => {
    setOrigin(event.target.value);
  }

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.getCategories())
      .then(res => {
        const categories = res.data;

        const lis = categories.map(item => {
          return (
            <option value={item.name}>{item.name}</option>
          )
        })
        lis.unshift(<option value="">Escolha uma categoria</option>)
        setlist_categories(lis)
      })
  }, [])

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filter(pageNumber, 10, origin, name, type, category, null))
      .then(res => {
        setDebts(res.data)
      })
  }, [pageNumber, name, origin, type, category])
  const lis = debts.items?.map(item => {
    return (
      <tr key={item.id}>
        <td className='td1'>{item.name}</td>
        <td className='td1'>R$ {decimalAdjust(item.value)}</td>
        <td className='td1'>{debtInstallmentTransform(item.debtInstallmentType)}</td>
        <td className='td1'>{debtTypeTransform(item.debtType)}</td>
        <td className='td1'>{dateAdjust(item.date)}</td>
        <td className='td1'>{item.category}</td>
        {item.debtInstallmentType === 'Fixed' ?
          <td className='td1'> - </td> : <td className='td1'>{item.paidInstallment === null ? 0 : item.paidInstallment}/{item.numberOfInstallments === 0 ? 1 : item.numberOfInstallments}</td>
        }
        <td className='tdd'>
          {<DebtModal id={item.id}></DebtModal>}
        </td>
      </tr>
    )
  })

  return (
    <div>
      <Card className="cardTable">
        <Form className="filters">
          <Form.Group>
            <Form.Control type="search" placeholder="Filtrar por Nome" id="search" onChange={nameChange} />
          </Form.Group>
          <Form.Group>
            <Form.Control name='category' id='search' onChange={categoryChange} as="select">
              {list_categories}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Control id="search" type="search" as="select" name='debtInstallmentType' onChange={originChange}>
              <option value="">Filtrar por origem</option>
              <option value="Simple">Simples</option>
              <option value="Card">Cartão de crédito</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Control type="search" id="search" as="select" onChange={typeChange}>
              <option value="">Filtrar por tipo</option>
              <option value="Installment">Parcelado</option>
              <option value="Fixed">Fixo</option>
              <option value="Simple">Simples</option>
            </Form.Control>
          </Form.Group>
        </Form>
        <Table responsive hover variant="black" className="table" size="sm">
          <thead>
            <tr className='tr'>
              <th>Nome</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Origem</th>
              <th>Data Início</th>
              <th>Categoria</th>
              <th>Parcelas</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {lis}
          </tbody>
        </Table>
        {(debts.totalItems !== undefined) ?
          <PaginationComponent
            itemsCount={debts.totalItems}
            itemsPerPage={10}
            currentPage={debts.currentPage}
            setCurrentPage={setPageNumber}
            alwaysShown={false}
          /> : ""}
      </Card>
      <SetModal modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></SetModal>
    </div>);
};
