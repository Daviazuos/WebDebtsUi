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
            <Form className="goalCreateForm" onSubmit={handleSubmit}>
                <Form.Group className="goalCreateField" controlId="goalName">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control required name="name" onChange={nameChange} placeholder="Ex.: Viagem, reserva de emergência" defaultValue={props.data?.name} />
                </Form.Group>
                <Form.Group className="goalCreateField" controlId="goalValue">
                    <Form.Label>Valor total necessário</Form.Label>
                    <MaskedFormControl currency="BRL" required name='value' onChange={valueChange} placeholder="Informe o valor total" defaultValue={props.data?.value} />
                </Form.Group>
                <Form.Group className="goalCreateField" controlId="goalDate">
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
                    <Form.Control required name='date' defaultValue={date} type="date" onChange={dateChange} />
                </Form.Group>
                <div className="goalProjection">
                    <span>Previsão de conclusão</span>
                    <strong>{(globalValue <= 12) ? addMonthsToDate(date, monthValue) : addYearsToDate(date, yearValue)}</strong>
                </div>
                <Form.Group className="goalCreateField goalTimelineField" controlId="goalTimeline">
                    <Form.Label>{`Tempo para alcançar a meta: ${(globalValue <= 12) ? `${monthValue} meses` : `${yearValue} anos`}`}</Form.Label>
                    <RangeSlider
                        value={(globalValue <= 12) ? monthValue : yearValue + 12}
                        step={1}
                        min={1}
                        max={52}
                        onChange={setCalculateGoalValue}
                        tooltip={false}
                    />
                </Form.Group>
                <div className="goalMonthlyAmount">
                    <span>Investimento mensal estimado</span>
                    <strong>R$ {decimalAdjust(goalValue)}</strong>
                </div>
                <LoadingButton className="goalCreateSubmit" type="submit" name="Adicionar meta" isLoading={isLoading} />
            </Form>
        </>
    );
}
