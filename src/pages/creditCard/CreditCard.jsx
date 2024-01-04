import React, { useEffect, useState } from "react";
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from "../../api";
import "./CreditCard.css"
import { Link } from 'react-router-dom';
import { addLeadingZeros, decimalAdjust } from "../../utils/valuesFormater";
import { Button, Form } from "react-bootstrap";

import CreditCardModal from "./CreditCardModal";
import ModalDelete from "../../components/modalDelete/ModalDelete";
import CreditCardEditModal from "./CreditCardEditModal";

function SetModalAddCard(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <Button size="sm" className={props.className} variant='dark' onClick={() => setModalShow(true)}>
                <i className={props.simbol}></i> {props.modalName}
            </Button>
            <CreditCardModal
                value={props.value}
                show={modalShow}
                onHide={() => setModalShow(false)}
                head={props.name}
            />
        </>
    );
}


function SetModalEditCard(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <Button style={{ margin: '0px', color: 'white' }} className='btn-custom' variant='custom' onClick={() => setModalShow(true)}>
                <i className={props.simbol}></i> {props.modalName}
            </Button>

            <CreditCardEditModal
                value={props.value}
                show={modalShow}
                onHide={() => setModalShow(false)}
                head={props.name}
                name={props.name}
                closureDate={props.closureDate}
                dueDate={props.dueDate}
                color={props.color}
                id={props.id}
            />
        </>
    );
}


function SetModalCredDebts(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            {
                <Link to={`/CreditCardSelected/${props.value}`}>
                    <Button style={{ margin: '0px', color: 'white' }} className='btn-custom' variant='custom' onClick={() => setModalShow(true)}>
                        <i className={props.simbol}></i> {props.modalName}
                    </Button>
                </Link>
            }
        </>
    );
}


function SetModalDelete(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <Button style={{ margin: '0px', color: 'white' }} className='btn-custom' variant='custom' onClick={() => setModalShow(true)}>
                <i className="fa fa-trash"></i> {props.modalName}
            </Button>
            <ModalDelete
                show={modalShow}
                onHide={() => setModalShow(false)}
                head={props.name}
                deleteUrl={Endpoints.card.deleteById(props.id)}
            />
        </>
    );
}


export default function CardCredit() {
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState([]);
    const [month, setMonth] = useState(localStorage.getItem("month"));
    const [year, setyear] = useState(localStorage.getItem("year"));
    const [showZeros, setShowZeros] = useState(false);

    useEffect(() => {
        setLoading(true)
        axiosInstance.get(Endpoints.card.filterCards(null, month, year))
            .then(res => {
                setCards(res.data);
            })
        setLoading(false)
    }, [month])

    const filtered_list = cards.filter(item => {
        let cardValue = 0.00

        for (const debt in item?.debts) {
            if (item?.debts[debt]?.installments[0]?.value !== undefined) {
                cardValue = cardValue + item?.debts[debt]?.installments[0]?.value
            }
        }

        if (cardValue !== 0.00) {
            return item;
        }
        else if (showZeros === true) {
            return item;
        }
    })

    const lis = filtered_list.map(item => {
        let cardValue = 0.00

        for (const debt in item?.debts) {
            if (item?.debts[debt]?.installments[0]?.value !== undefined) {
                cardValue = cardValue + item?.debts[debt]?.installments[0]?.value
            }
        }

        return (
            <div class="debit-card card-2 mb-4" style={{ backgroundColor: `${(item.color != null && item.color != '') ? item.color : "#6F87E1"}` }} id="creditCardBlock">
                <div class="d-flex flex-column h-100"> <label class="d-block">
                    <div class="d-flex position-relative">
                        <div>
                            <h3 class="text-white fw-bold">{item.name}</h3>
                        </div>
                    </div>
                    <div id='textCard' class="mt-auto fw-bold d-flex align-items-center justify-content-between">
                        <div className="creditBody">
                            <p id="cardText" class="m-0">Fechamento {addLeadingZeros(item.closureDate, 2)}/{addLeadingZeros(month, 2)}/{year}</p>
                            <p id="cardText" class="m-0">Vencimento {addLeadingZeros(item.dueDate, 2)}/{addLeadingZeros(month, 2)}/{year}</p>
                        </div>
                        <h5 id="cardText" class="m-0">R$ {decimalAdjust(cardValue)}</h5>
                    </div>
                    <p></p>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {<SetModalCredDebts value={item.id} name={item.name} modalName="" month={month} simbol="fas fa-search" totalValue={decimalAdjust(cardValue)}></SetModalCredDebts>}{" "}
                        {<SetModalDelete id={item.id}></SetModalDelete>}
                        {<SetModalEditCard id={item.id} name={item.name} color={item.color} dueDate={item.dueDate} closureDate={item.closureDate} simbol="fas fa-edit" className="modalButton"></SetModalEditCard>}
                    </div>
                </label>
                </div>
            </div >
        )
    })

    const handleChange=(e)=>{
        setShowZeros(!showZeros)
         
     }

    return (
        <div className="containerCardPage">
            <Form className="switchButton">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Apenas com valor"
                    defaultChecked
                    onChange={handleChange}
                />

            </Form>
            {loading ? <i class="fas fa-spinner fa-spin"></i> :
                <div class="cardCredit card px-4" id='cardCredit'>
                    {lis}
                </div>}
            <SetModalAddCard name={'Adicionar novo cartão'} modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></SetModalAddCard>
        </div>)
}


