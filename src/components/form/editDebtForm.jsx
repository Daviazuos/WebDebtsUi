import React, { useEffect, useState } from "react";
import { Endpoints } from '../../api/endpoints';
import { Form, Button } from 'react-bootstrap';
import { axiosInstance } from "../../api";
import MaskedFormControl from "../../utils/maskedInputs";
import "./form.css"
import CategoryModal from "../../pages/categories/CategoryModal";
import LoadingButton from "../loadingButton/LoadingButton";

function refreshPage() {
  window.location.reload();
}


export default function EditDebtForm(props) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [list_categories, setlist_categories] = useState([]);
  const [refreshCategories, setRefreshCategories] = useState(false)
  const [month, setMonth] = useState(localStorage.getItem("month"));
  const [year, setyear] = useState(localStorage.getItem("year"));
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

  let installmentOfMonth = props.data?.installments[0]

  if (props.data.debtInstallmentType !== 'Simple') {
     installmentOfMonth = props.data?.installments.filter(({ date }) => new Date(date).getMonth() + 1 === parseInt(month) && new Date(date).getFullYear() === parseInt(year))[0]
  } else {
     installmentOfMonth = props.data.installments[0]
  }

  function handleSubmit(event) {
    setIsLoading(true)
    event.preventDefault();
    const addDebts = {
      name: name || props.data?.name,
      value: value || installmentOfMonth.value,
      date: installmentOfMonth.date,
      numberOfInstallments: props.data?.numberOfInstallments,
      debtInstallmentType: props.data?.debtInstallmentType,
      CategoryId: category || props.data?.category
    };
    axiosInstance.put(Endpoints.debt.putDebt(props.id), addDebts).then(response => {
      setIsLoading(false)
      props.update()
    })
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
          <MaskedFormControl currency="BRL" required="true" name='value' onChange={valueChange} defaultValue={installmentOfMonth?.value} />
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
        <LoadingButton variant="dark" type="submit" name="Salvar" isLoading={isLoading}></LoadingButton>
      </Form>
    </>
  );
}
