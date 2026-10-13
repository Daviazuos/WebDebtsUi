import React, { useEffect } from "react";
import { Table, Form } from "react-bootstrap";
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

  function updateValuesv2() {
    setModalShow(false)
  }

  return (
    <>
      <button type="button" className="debtsAddButton" onClick={() => setModalShow(true)}>
        <i className={props.simbol} aria-hidden="true"></i> {props.modalName}
      </button>

      <ModalAddDebts
        show={modalShow}
        onHide={() => setModalShow(false)}
        update={updateValuesv2}
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
    axiosInstance.get(Endpoints.debt.filter(pageNumber, 16, origin, name, type, category, null))
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
        <td className='td1'>{item.cardName}</td>
        <td className='td1'>{dateAdjust(item.date)}</td>
        <td className='td1'>{item.category}</td>
        {item.debtInstallmentType === 'Fixed' ?
          <td className='td1'> - </td> : <td className='td1'>{item.paidInstallment === null ? 0 : item.paidInstallment}/{item.numberOfInstallments === 0 ? 1 : item.numberOfInstallments}</td>
        }
        <td className='td1'>{item.responsibleParty?.name}</td>
        <td className='td1'>
          {<DebtModal id={item.id}></DebtModal>}
        </td>
      </tr>
    )
  })

  return (
    <main className="debtsPage">
      <header className="debtsPageHeader">
        <div>
          <span className="debtsEyebrow">FINANÇAS / COMPROMISSOS</span>
          <h1>Dívidas</h1>
          <p>Consulte, filtre e acompanhe seus compromissos financeiros.</p>
        </div>
        <SetModal modalName="Adicionar dívida" simbol="fas fa-plus" />
      </header>

      <section className="debtsPanel">
        <header className="debtsPanelHeader">
          <div>
            <span className="debtsPanelIcon"><i className="fas fa-list-ul" aria-hidden="true"></i></span>
            <div><h2>Lançamentos</h2><p>{debts.totalItems || 0} registros encontrados</p></div>
          </div>
        </header>
        <Form className="debtsFilters" aria-label="Filtros de dívidas">
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
        <div className="debtsTableWrap">
        <Table borderless responsive hover className="debtsTable" size="sm">
          <thead>
            <tr className='tr'>
              <th>Nome</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Origem</th>
              <th>Cartão</th>
              <th>Data Início</th>
              <th>Categoria</th>
              <th>Parcelas</th>
              <th>Pessoa vinculada</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {lis?.length ? lis : (
              <tr><td className="debtsEmptyState" colSpan="10">Nenhuma dívida encontrada com esses filtros.</td></tr>
            )}
          </tbody>
        </Table>
        </div>
        {(debts.totalItems !== undefined) ?
          <div className="debtsPagination"><PaginationComponent
            itemsCount={debts.totalItems}
            itemsPerPage={10}
            currentPage={debts.currentPage}
            setCurrentPage={setPageNumber}
            alwaysShown={false}
          /></div> : ""}
      </section>
    </main>);
};
