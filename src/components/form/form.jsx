import React, { useEffect, useState } from "react";
import { Endpoints } from '../../api/endpoints';
import { Form, Button } from 'react-bootstrap';
import { axiosInstance } from "../../api";
import { debtInstallmentTypeToNumber } from "../../utils/enumFormatter";
import MaskedFormControl from "../../utils/maskedInputs";
import "./form.css"
import CategoryModal from "../../pages/categories/CategoryModal";
import LoadingButton from "../loadingButton/LoadingButton";
import CardLayout from "../cardLayout/CardLayout";
import { refreshPage } from "../../utils/utils";

export default function DebtList(props) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [numberOfInstallments, setNumberOfInstallments] = useState('0');
  const [debtInstallmentType, setDebtInstallmentType] = useState('');
  const [category, setCategory] = useState('');
  const [list_categories, setlist_categories] = useState([]);
  const [refreshCategories, setRefreshCategories] = useState(false)
  const [isLoading, setIsLoading] = React.useState(false);


  function SetModal(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
      <>
        <Button variant="outline-secondary" className={props.classname} onClick={() => setModalShow(true)}><i className="fas fa-plus"></i> </Button>
        <CategoryModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          refresh={() => setRefreshCategories(true)}
          head={props.name}
        />
      </>
    );
  }

  const nameChange = event => {
    setName(event.target.value)
  }
  const valueChange = (event, value, maskedValue) => {
    setValue(value)
  }
  const dateChange = event => {
    setDate(event.target.value)
  }
  const installmentsChange = event => {
    setNumberOfInstallments(event.target.value)
  }
  const typeChange = event => {
    setDebtInstallmentType(event.target.value)
  }
  const categoryChange = event => {
    setCategory(event.target.value)
  }

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.getCategories())
      .then(res => {
        const categories = res.data;

        const lis = categories.map(item => {
          return (
            <option value={item.id}>{item.name}</option>
          )
        })
        lis.unshift(<option value="">Escolha uma categoria</option>)
        setlist_categories(lis)
        setRefreshCategories(false)
      })

  }, [refreshCategories])


  function handleSubmit(event) {
    setIsLoading(true)
    event.preventDefault();
    const addDebts = {
      name: name || props.data?.name,
      value: value || props.data?.value,
      date: date || props.data?.date,
      numberOfInstallments: numberOfInstallments || props.data?.numberOfInstallments,
      debtInstallmentType: debtInstallmentType || props.data?.debtInstallmentType,
      CategoryId: category || props.data?.category
    };
    if (props.id === undefined) {
      props.cardId === null ? axiosInstance.post(Endpoints.debt.add(), addDebts).then(response => {
        setIsLoading(false)
        props.update()
      }) : axiosInstance.post(Endpoints.card.addValues(props.cardId), addDebts).then(response => {
        setIsLoading(false)
        props.update()
      })
    }
    else {
      axiosInstance.put(Endpoints.debt.putDebt(props.id), addDebts).then(response => {
        setIsLoading(false)
        props.update()
      })
    }
    refreshPage()
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control required="true" name="name" onChange={nameChange} placeholder="Entre com o nome" defaultValue={props.data?.name} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Valor</Form.Label>
          <MaskedFormControl currency="BRL" required="true" name='value' onChange={valueChange} placeholder="Entre com o valor total" defaultValue={props.data?.value} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Data</Form.Label>
          <Form.Control required="true" name='date' type="date" onChange={dateChange} placeholder="Entre com o data" defaultValue={props.data?.date.split('T')[0]} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Categoria</Form.Label>
          <div className="categorySelector">
            <Form.Control required="true" name='category' onChange={categoryChange} as="select" defaultValue={props.data?.category}>
              {list_categories}
            </Form.Control>
            <SetModal modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></SetModal>
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Tipo de débito</Form.Label>
          <Form.Control required="true" as="select" name='debtInstallmentType' onChange={typeChange} defaultValue={debtInstallmentTypeToNumber(props.data?.debtInstallmentType)}>
            <option>Selecione o Tipo de debito</option>
            <option value="0">Parcelado</option>
            <option value="1">Fixo</option>
            <option value="2">Simples</option>
          </Form.Control>
        </Form.Group>
        {(debtInstallmentType === "0" || debtInstallmentTypeToNumber(props.data?.debtInstallmentType) == "0") ?
          <Form.Group>
            <Form.Label>Quantidade de Parcelas</Form.Label>
            <Form.Control name='numberOfInstallments' type="number" onChange={installmentsChange} placeholder="Entre com o quantidade de parcelas" defaultValue={props.data?.numberOfInstallments} />
          </Form.Group> : ""}
        <LoadingButton variant="dark" type="submit" name="Adicionar" isLoading={isLoading}></LoadingButton>
      </Form>
    </>
  );
}
