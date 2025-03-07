import React, { useEffect, useState } from "react";
import { Endpoints } from '../../api/endpoints';
import { Form, Button, Alert } from 'react-bootstrap';
import { axiosInstance } from "../../api";
import { debtInstallmentTypeToNumber } from "../../utils/enumFormatter";
import MaskedFormControl from "../../utils/maskedInputs";
import "./form.css"
import CategoryModal from "../../pages/categories/CategoryModal";
import LoadingButton from "../loadingButton/LoadingButton";
import CardLayout from "../cardLayout/CardLayout";
import { refreshPage } from "../../utils/utils";
import { useGlobalContext } from "../../services/local-storage-event";
import ResponsibleParty from "../../pages/responsibleParty/ResponsibleParty";
import ResponsiblePartyModal from "../../pages/responsibleParty/ResponsiblePartyModal";

export default function DebtList(props) {
  const [name, setName] = useState('');
  const [values, setValues] = useState(['']); // Lista para armazenar valores dos campos de valor
  const [date, setDate] = useState('');
  const [numberOfInstallments, setNumberOfInstallments] = useState('0');
  const [debtInstallmentType, setDebtInstallmentType] = useState('');
  const [category, setCategory] = useState('');
  const [responsibleParty, setResponsibleParty] = useState('');
  const [list_categories, setlist_categories] = useState([]);
  const [list_responsibleParty, setlist_responsibleParty] = useState([]);
  const [refreshCategories, setRefreshCategories] = useState(false)
  const [refreshResponsibleParty, setRefreshResponsibleParty] = useState(false)
  const [isLoading, setIsLoading] = React.useState(false);
  const [onError, setOnError] = React.useState(false)
  const [check, setCheck] = React.useState(false)
  const { sharedValue, setSharedValue } = useGlobalContext();

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

  function SetModalAddResponsibleParty(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
      <>
        <Button variant="outline-secondary" className={props.classname} onClick={() => setModalShow(true)}><i className="fas fa-plus"></i> </Button>
        <ResponsiblePartyModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          refresh={() => setRefreshResponsibleParty(true)}
          head={props.name}
        />
      </>
    );
  }

  const nameChange = event => {
    setName(event.target.value)
  }

  // Atualiza um valor específico na lista de valores adicionais
  const valueChange = (event, value, maskedValue, index) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
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
  const responsiblePartyChange = event => {
    setResponsibleParty(event.target.value)
  }

  const checkChange = event => {
    if (event.target.checked) {
      setCheck(true)
  } else {
      setCheck(false)
  }
    
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

  useEffect(() => {
    axiosInstance.get(Endpoints.responsibleParty.getByUser())
      .then(res => {
        const responsiblePartyData = res.data;

        const lis = responsiblePartyData.map(item => {
          return (
            <option value={item.id}>{item.name}</option>
          )
        })
        lis.unshift(<option value="">Escolha uma pessoa</option>)
        setlist_responsibleParty(lis)
        setRefreshResponsibleParty(false)
      })

  }, [refreshResponsibleParty])

  function addFieldValue() {
    setValues([...values, '']); // Adiciona um novo campo vazio à lista de valores
  }

  function removeFieldValue(index) {
    const newValues = [...values];
    newValues.splice(index, 1); // Remove o campo de valor com o índice fornecido
    setValues(newValues);
  }

  function handleSubmit(event) {
    setIsLoading(true)
    event.preventDefault();
    const addDebts = {
      name: name || props.data?.name,
      value: values[0] || parseFloat(props.data?.value.replace(',', '.')),
      values: values[0] != '' ? [...values] : [parseFloat(props.data?.value.replace(',', '.'))], // Envia todos os valores da lista para a API
      date: date || props.data?.date,
      numberOfInstallments: numberOfInstallments || props.data?.numberOfInstallments,
      debtInstallmentType: debtInstallmentType || props.data?.debtInstallmentType,
      CategoryId: category || props.data?.category,
      ResponsiblePartyId: responsibleParty || props.data?.responsibleParty
    };
    if (props.id === undefined) {
      props.cardId === null ? axiosInstance.post(Endpoints.debt.add(), addDebts).then(response => {
        setIsLoading(false)
        setSharedValue(!sharedValue);
        props.update()
      }).catch(err => {
        setOnError(!onError);
        setIsLoading(false)
      }) : axiosInstance.post(Endpoints.card.addValues(props.cardId), addDebts).then(response => {
        setIsLoading(false)
        setSharedValue(!sharedValue);
        props.update(props.draftId)
      }).catch(err => {
        setOnError(!onError);
        setIsLoading(false)
      })
    }
    else {
      axiosInstance.put(Endpoints.debt.putDebt(props.id), addDebts).then(response => {
        setIsLoading(false)
        setSharedValue(!sharedValue);
        props.update()
      }).catch(err => {
        setOnError(!onError);
        setIsLoading(false)
      })
    }
  }

  return (
    <>
      <Alert show={onError} variant="danger">
        Erro ao salvar {props.error}
      </Alert>
      <Form onSubmit={handleSubmit} className="AddForm">
        <Form.Group className="inputGroup">
          <Form.Label>Nome</Form.Label>
          <Form.Control required="true" name="name" onChange={nameChange} placeholder="Entre com o nome" defaultValue={props.data?.name} />
        </Form.Group>

        {/* Renderiza campos de valor dinamicamente */}
        {values.map((value, index) => (
          <Form.Group className="inputGroup" key={index}>
            <Form.Label>Valor</Form.Label>
            <div style={{ display: 'flex' }}>
              <MaskedFormControl currency="BRL" required="true" defaultValue={props.data?.value} name={`value${index}`} value={value} onChange={(event, value, maskedValue) => valueChange(event, value, maskedValue, index)} placeholder="Entre com o valor total" />
              {(index !== 0) ? <Button variant="danger" onClick={() => removeFieldValue(index)}>-</Button> : ""}
            </div>
          </Form.Group>
        ))}
        <Button variant="outline-secondary" onClick={addFieldValue}><i className="fas fa-plus"></i> Adicionar mais Valores</Button> {/* Botão para adicionar campos de valor */}

        <Form.Group className="inputGroup">
          <Form.Label>Data</Form.Label>
          <Form.Control required="true" name='date' type="date" onChange={dateChange} placeholder="Entre com o data" defaultValue={props.data?.date.split('T')[0]} />
        </Form.Group>
        <Form.Group className="inputGroup">
          <Form.Label>Categoria</Form.Label>
          <div className="categorySelector">
            <Form.Control required="true" name='category' onChange={categoryChange} as="select" defaultValue={props.data?.category}>
              {list_categories}
            </Form.Control>
            <SetModal modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></SetModal>
          </div>
        </Form.Group>
        {props.cardId === null ? <Form.Check
          type="checkbox"
          id="custom-switch"
          label="Vincular a uma pessoa?"
          onChange={checkChange}
        /> : ''}
        
        {(check === true) ? <Form.Group className="inputGroup">
          <div className="ResponsiblePartySelector">
            <Form.Control required="true" name='responsibleParty' onChange={responsiblePartyChange} as="select">
              {list_responsibleParty}
            </Form.Control>
            <SetModalAddResponsibleParty modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></SetModalAddResponsibleParty>
          </div>
        </Form.Group> : ''}
        
        <Form.Group className="inputGroup">
          <Form.Label>Tipo de débito</Form.Label>
          <Form.Control required="true" as="select" name='debtInstallmentType' onChange={typeChange} defaultValue={debtInstallmentTypeToNumber(props.data?.debtInstallmentType)}>
            <option>Selecione o Tipo de debito</option>
            <option value="0">Parcelado</option>
            <option value="1">Fixo</option>
            <option value="2">Simples</option>
          </Form.Control>
        </Form.Group>
        {(debtInstallmentType === "0" || debtInstallmentTypeToNumber(props.data?.debtInstallmentType) == "0") ?
          <Form.Group className="inputGroup">
            <Form.Label>Quantidade de Parcelas</Form.Label>
            <Form.Control name='numberOfInstallments' type="number" onChange={installmentsChange} placeholder="Entre com o quantidade de parcelas" defaultValue={props.data?.numberOfInstallments} />
          </Form.Group> : ""}

        <LoadingButton variant="dark" type="submit" name="Adicionar" isLoading={isLoading}></LoadingButton>
      </Form>
    </>
  );
}
