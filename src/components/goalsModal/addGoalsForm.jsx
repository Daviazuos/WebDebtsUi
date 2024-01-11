import React, { useState } from "react";
import { Endpoints } from '../../api/endpoints';
import { Form } from 'react-bootstrap';
import { axiosInstance } from "../../api";
import MaskedFormControl from "../../utils/maskedInputs";
import LoadingButton from "../loadingButton/LoadingButton";
import RangeSlider from 'react-bootstrap-range-slider';
import { decimalAdjust } from "../../utils/valuesFormater";
import { addMonthsToDate, addYearsToDate } from "../../utils/dateFormater";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


function refreshPage() {
    window.location.reload();
}


export default function AddGoalsForm(props) {
    const [name, setName] = useState('');
    const [value, setValue] = useState(0);
    const [globalValue, setGlobalValue] = useState(0);
    const [yearValue, setYearValue] = useState(1);
    const [monthValue, setMonthValue] = useState(1);
    const [goalValue, setGoalValue] = useState(0.00);
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [numberOfInstallments, setNumberOfInstallments] = useState('0');
    const [debtInstallmentType, setDebtInstallmentType] = useState(0);
    const [category, setCategory] = useState('29dc406d-04a3-4a88-9a94-5c8fb6af0092');
    const [isLoading, setIsLoading] = React.useState(false);


    const nameChange = event => {
        setName(event.target.value)
    }
    const valueChange = (event, value, maskedValue) => {
        setValue(value)
    }
    const dateChange = event => {
        setDate(event.target.value)
    }

    const setCalculateGoalValue = event => {
        setGlobalValue(event.target.value)
            
        if (event.target.value > 12) {
            var yearLessMonths = event.target.value - 12
            setYearValue(yearLessMonths)
            setGoalValue((value / (yearLessMonths * 12)))
            setNumberOfInstallments(yearLessMonths * 12)
        }
        else {
            setMonthValue(event.target.value)
            setGoalValue((value / event.target.value))
            setNumberOfInstallments(event.target.value)
        }
    }

    function handleSubmit(event) {
        setIsLoading(true)
        event.preventDefault();
        const addDebts = {
            name: name,
            value: (value / numberOfInstallments),
            date: date,
            numberOfInstallments: numberOfInstallments,
            debtInstallmentType: debtInstallmentType,
            CategoryId: category,
            IsGoal: true
        };
        axiosInstance.post(Endpoints.debt.add(), addDebts).then(response => {
                setIsLoading(false)
                refreshPage()
            })
        }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control required name="name" onChange={nameChange} placeholder="Entre com o nome" defaultValue={props.data?.name} />
                </Form.Group>
                <p></p>
                <Form.Group>
                    <Form.Label>Valor total necessário</Form.Label>
                    <MaskedFormControl currency="BRL" required name='value' onChange={valueChange} placeholder="Entre com o valor total" defaultValue={props.data?.value} />
                </Form.Group>
                <p></p>
                <Form.Group>
                    <OverlayTrigger
                        key='top'
                        placement='top'
                        overlay={
                            <Tooltip>
                                Essa é a data que você começará a investir!
                            </Tooltip>
                        }
                    >
                        <Form.Label>Data início</Form.Label>
                    </OverlayTrigger>
                    <Form.Control required name='date' defaultValue={date} type="date" onChange={dateChange} placeholder="Entre com o data" />
                </Form.Group>
                <p></p>
                <Form.Label>{`Previsão de fim: ${(globalValue <= 12) ? addMonthsToDate(date, monthValue) : addYearsToDate(date, yearValue)}`}</Form.Label>
                <p></p>            
                <Form.Group>
                    <Form.Label>{`Tempo para alcançar a meta: ${(globalValue <= 12) ? `${monthValue} meses.` : `${yearValue} anos.`}`}</Form.Label>
                    <RangeSlider
                        value={(globalValue <= 12) ? monthValue : yearValue + 12}
                        step={1}
                        min={1}
                        max={52}
                        onChange={setCalculateGoalValue}
                        tooltip={false}
                    />
                </Form.Group>
                 <Form.Group>
                    <Form.Label>{`Total de investimento por mês: R$ ${decimalAdjust(goalValue)}`}</Form.Label>
                </Form.Group>
                <p></p>

                <LoadingButton variant="dark" type="submit" name="Adicionar" isLoading={isLoading}></LoadingButton>
            </Form>
        </>
    );
}
