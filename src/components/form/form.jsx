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
  const [valueType, setValueType] = useState('total');

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
    setNumberOfInstallments(event.target.value);
  }
  const typeChange = event => {
    setDebtInstallmentType(event.target.value)
    if (event.target.value !== "0") {
      setValueType('total')
    }
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
    const installmentCount = Math.max(
      parseInt(numberOfInstallments || props.data?.numberOfInstallments, 10) || 1,
      1
    );
    const isInstallmentPurchase =
      (debtInstallmentType || debtInstallmentTypeToNumber(props.data?.debtInstallmentType)) === "0";
    const enteredValues = values.map((value, index) => {
      const parsedValue = Number(value);
      if (Number.isFinite(parsedValue) && parsedValue !== 0) {
        return parsedValue;
      }

      return index === 0
        ? parseFloat(String(props.data?.value || '').replace(',', '.')) || 0
        : 0;
    });
    const selectedValues = isInstallmentPurchase && valueType === 'total'
      ? enteredValues.map(value => value / installmentCount)
      : enteredValues;
    const selectedValue = selectedValues[0];
    const addDebts = {
      name: name || props.data?.name,
      value: selectedValue,
      values: selectedValues,
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

  const isInstallment = debtInstallmentType === "0" || debtInstallmentTypeToNumber(props.data?.debtInstallmentType) === "0";

  const formatCurrency = value => {
    const numericValue = Number(value) || 0;

    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const currentTotalValue =
    parseFloat(values[0]) ||
    parseFloat(String(props.data?.value || '').replace(',', '.')) ||
    0;

  const currentInstallments = parseInt(numberOfInstallments, 10) || 1;

  const calculatedInstallment =
    currentInstallments > 0
      ? currentTotalValue / currentInstallments
      : 0;

  const selectedType =
    debtInstallmentType ||
    debtInstallmentTypeToNumber(props.data?.debtInstallmentType);

  const isInstallmentType = selectedType === "0";

  return (
    <>
      <Alert show={onError} variant="danger" className="formAlert">
        Erro ao salvar {props.error}
      </Alert>

      <Form onSubmit={handleSubmit} className="AddForm">

        <section className="formSection">
          <div className="sectionHeader">
            <div className="sectionIcon">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <div>
              <h3>Compra</h3>
              <span>Informações básicas da compra</span>
            </div>
          </div>

          <div className="formGrid formGridPurchase">
            <Form.Group className="inputGroup">
              <Form.Label>Nome da compra</Form.Label>
              <Form.Control
                required
                name="name"
                onChange={nameChange}
                placeholder="Ex.: COBASI POA IPIRANGA"
                defaultValue={props.data?.name}
              />
            </Form.Group>

            <Form.Group className="inputGroup">
              <Form.Label>Categoria</Form.Label>
              <div className="selectorWithAction">
                <Form.Control
                  required
                  name="category"
                  onChange={categoryChange}
                  as="select"
                  defaultValue={props.data?.category}
                >
                  {list_categories}
                </Form.Control>

                <SetModal
                  modalName="Adicionar"
                  simbol="fas fa-plus"
                  classname="modalButton"
                />
              </div>
            </Form.Group>
          </div>
        </section>

        <section className="formSection">
          <div className="sectionHeader">
            <div className="sectionIcon">
              <i className="fas fa-credit-card"></i>
            </div>
            <div>
              <h3>Pagamento</h3>
              <span>Defina como essa compra será lançada</span>
            </div>
          </div>

          <div className="formGrid paymentGrid">
            <Form.Group className="inputGroup">
              <Form.Label>Tipo de pagamento</Form.Label>

              <div className="paymentTypeSelector" role="radiogroup">
                <button
                  type="button"
                  className={`paymentTypeOption ${selectedType === "2" ? "active" : ""}`}
                  onClick={() => {
                    setDebtInstallmentType("2");
                    setValueType("total");
                  }}
                >
                  <i className="fas fa-check"></i>
                  À vista
                </button>

                <button
                  type="button"
                  className={`paymentTypeOption ${selectedType === "0" ? "active" : ""}`}
                  onClick={() => {
                    setDebtInstallmentType("0");
                    setValueType("total");
                  }}
                >
                  <i className="fas fa-calendar-check"></i>
                  Parcelado
                </button>

                <button
                  type="button"
                  className={`paymentTypeOption ${selectedType === "1" ? "active" : ""}`}
                  onClick={() => {
                    setDebtInstallmentType("1");
                    setValueType("total");
                  }}
                >
                  <i className="fas fa-sync-alt"></i>
                  Fixo
                </button>
              </div>
            </Form.Group>

            {isInstallmentType && (
              <Form.Group className="inputGroup">
                <Form.Label>Número de parcelas</Form.Label>

                <div className="installmentControl">
                  <button
                    type="button"
                    aria-label="Diminuir número de parcelas"
                    onClick={() => {
                      const next = Math.max(1, currentInstallments - 1);
                      setNumberOfInstallments(String(next));
                    }}
                  >
                    −
                  </button>

                  <span>{currentInstallments}</span>

                  <button
                    type="button"
                    aria-label="Aumentar número de parcelas"
                    onClick={() => {
                      const next = currentInstallments + 1;
                      setNumberOfInstallments(String(next));
                    }}
                  >
                    +
                  </button>
                </div>

                <Form.Control
                  className="installmentHiddenInput"
                  name="numberOfInstallments"
                  type="number"
                  min="1"
                  required
                  value={numberOfInstallments === "0" ? "" : numberOfInstallments}
                  onChange={installmentsChange}
                  aria-label="Número de parcelas"
                />
              </Form.Group>
            )}
          </div>

          <Form.Group className="inputGroup valueGroup">
            <Form.Label>Valor</Form.Label>

            {isInstallmentType && (
              <div className="valueTabs" role="radiogroup">
                <button
                  type="button"
                  className={`valueTab ${valueType === "total" ? "active" : ""}`}
                  onClick={() => setValueType("total")}
                >
                  <i className="fas fa-check-circle"></i>
                  Valor total
                </button>

                <button
                  type="button"
                  className={`valueTab ${valueType === "divided" ? "active" : ""}`}
                  onClick={() => setValueType("divided")}
                >
                  Valor da parcela
                </button>
              </div>
            )}

            <div className="valueInputWrapper">
              <span className="currencyPrefix">R$</span>
              <MaskedFormControl
                currency="BRL"
                required
                defaultValue={props.data?.value}
                name="value0"
                value={values[0]}
                onChange={(event, value) =>
                  valueChange(event, value, null, 0)
                }
                placeholder="0,00"
              />
            </div>

            {isInstallmentType && (
              (valueType === "divided" ?
                 <div className="installmentHint">
                <i className="fas fa-calculator"></i>
                <span>
                  Dividido em {currentInstallments} parcela(s) de{" "}
                  <strong>{formatCurrency(currentTotalValue)}</strong>
                  {" "}e somando o valor total de <strong>{formatCurrency((currentInstallments * currentTotalValue))}</strong>
                </span>
              </div> :
              <div className="installmentHint">
                <i className="fas fa-calculator"></i>
                <span>
                  Dividido em {currentInstallments} parcela(s) de{" "}
                  <strong>{formatCurrency(calculatedInstallment)}</strong>
                </span>
              </div>
            ))}
          </Form.Group>

          {values.length > 1 && (
            <div className="additionalValues">
              {values.slice(1).map((value, index) => {
                const realIndex = index + 1;

                return (
                  <div className="additionalValueRow" key={realIndex}>
                    <MaskedFormControl
                      currency="BRL"
                      required
                      value={value}
                      name={`value${realIndex}`}
                      onChange={(event, newValue) =>
                        valueChange(event, newValue, null, realIndex)
                      }
                      placeholder="0,00"
                    />

                    <Button
                      variant="outline-danger"
                      type="button"
                      onClick={() => removeFieldValue(realIndex)}
                      aria-label="Remover valor"
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="button"
            className="addValueButton"
            onClick={addFieldValue}
          >
            <i className="fas fa-plus"></i>
            Adicionar outro valor
          </button>
        </section>

        {isInstallmentType && (
          <div className="purchaseSummary">
            <div className="summaryIcon">
              <i className="fas fa-receipt"></i>
            </div>

            <div className="summaryContent">
              <span className="summaryTitle">Resumo da compra</span>

              <div className="summaryData">
                {valueType === "divided" ? (
                  <span className="summaryInstallmentText">
                    Dividido em {currentInstallments} parcela(s) de{" "}
                    <strong>{formatCurrency(currentTotalValue)}</strong>
                    {" "}e somando o valor total de{" "}
                    <strong>{formatCurrency(currentInstallments * currentTotalValue)}</strong>
                  </span>
                ) : (
                  <>
                    <div>
                      <span>Total da compra</span>
                      <strong>{formatCurrency(currentTotalValue)}</strong>
                    </div>

                    <div>
                      <span>Parcelas</span>
                      <strong>
                        {currentInstallments}x de{" "}
                        {formatCurrency(calculatedInstallment)}
                      </strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <section className="formSection">
          <div className="sectionHeader">
            <div className="sectionIcon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div>
              <h3>Data</h3>
              <span>Quando essa compra aconteceu?</span>
            </div>
          </div>

          <Form.Group className="inputGroup">
            <Form.Label>Data da compra</Form.Label>
            <Form.Control
              required
              name="date"
              type="date"
              onChange={dateChange}
              defaultValue={props.data?.date?.split('T')[0]}
            />
          </Form.Group>
        </section>

        {props.cardId === null && (
          <section className="responsibleSection">
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Vincular esta compra a uma pessoa"
              onChange={checkChange}
            />

            {check && (
              <div className="selectorWithAction responsibleSelector">
                <Form.Control
                  required
                  name="responsibleParty"
                  onChange={responsiblePartyChange}
                  as="select"
                >
                  {list_responsibleParty}
                </Form.Control>

                <SetModalAddResponsibleParty
                  modalName="Adicionar"
                  simbol="fas fa-plus"
                  classname="Button"
                />
              </div>
            )}
          </section>
        )}

        <div className="formFooter">
          <Button
            type="button"
            variant="light"
            className="cancelButton"
            onClick={props.onHide}
          >
            Cancelar
          </Button>

          <LoadingButton
            variant="dark"
            type="submit"
            name="Adicionar compra"
            isLoading={isLoading}
            className="submitButton"
          />
        </div>
      </Form>
    </>
  );
}