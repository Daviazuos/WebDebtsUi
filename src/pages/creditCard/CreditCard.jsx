import React, { useEffect, useState } from "react";
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from "../../api";
import "./CreditCard.css"
import { Link } from 'react-router-dom';
import { addLeadingZeros, decimalAdjust } from "../../utils/valuesFormater";
import { Form } from "react-bootstrap";

import CreditCardModal from "./CreditCardModal";
import ModalDelete from "../../components/modalDelete/ModalDelete";
import CreditCardEditModal from "./CreditCardEditModal";

function SetModalAddCard(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <button type="button" className="creditAddButton" onClick={() => setModalShow(true)}>
                <i className={props.simbol} aria-hidden="true"></i>
                <span>{props.modalName}</span>
            </button>
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
            <button type="button" className="creditIconAction" aria-label={`Editar ${props.name}`} title="Editar cartão" onClick={() => setModalShow(true)}>
                <i className={props.simbol} aria-hidden="true"></i>
            </button>

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
    return (
        <Link className="creditDetailsButton" to={`/CreditCardSelected/${props.value}`}>
            <span>Ver lançamentos</span>
            <i className={props.simbol} aria-hidden="true"></i>
        </Link>
    );
}


function SetModalDelete(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <button type="button" className="creditIconAction creditIconAction--danger" aria-label={`Excluir ${props.name}`} title="Excluir cartão" onClick={() => setModalShow(true)}>
                <i className="fas fa-trash" aria-hidden="true"></i>
            </button>
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
        setLoading(true);
        setCards([]);

        axiosInstance.get(Endpoints.card.filterCards(1, 9999, null, month, year, showZeros))
            .then(res => {
                setCards(res.data.items || []);
            })
            .catch(() => {
                setCards([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [month, showZeros, year]);

    const getCardValue = item => (item?.debts || []).reduce((total, debt) => {
        return total + (Number(debt?.installments?.[0]?.value) || 0);
    }, 0);

    const filtered_list = cards.filter(item => getCardValue(item) !== 0 || showZeros);

    const lis = filtered_list.map(item => {
        const cardValue = getCardValue(item);

        let closingDate = item.closureDate > item.dueDate ? `${addLeadingZeros(item.closureDate, 2)}/${addLeadingZeros(month - 1, 2)}/${year}` : `${addLeadingZeros(item.closureDate, 2)}/${addLeadingZeros(month, 2)}/${year}`

        return (
            <article className="creditCardItem" key={item.id} style={{ "--credit-card-accent": item.color || "#5840d8" }}>
                <div className="creditCardItemHeader">
                    <span className="creditCardMark" aria-hidden="true"><i className="fas fa-credit-card"></i></span>
                    <span className="creditCardType">CARTÃO DE CRÉDITO</span>
                    <i className="fas fa-wifi creditCardContactless" aria-hidden="true"></i>
                    <div className="creditCardActions">
                        <SetModalEditCard id={item.id} name={item.name} color={item.color} dueDate={item.dueDate} closureDate={item.closureDate} simbol="fas fa-pen" />
                        <SetModalDelete id={item.id} name={item.name} />
                    </div>
                </div>

                <div className="creditCardIdentity">
                    <h2>{item.name}</h2>
                </div>

                <span className="creditCardChip" aria-hidden="true"><i className="fas fa-sim-card"></i></span>

                <div className="creditCardAmount">
                    <span>Fatura do período</span>
                    <strong>R$ {decimalAdjust(cardValue)}</strong>
                </div>

                <div className="creditCardDates">
                    <div><span>Fechamento</span><strong>{closingDate}</strong></div>
                    <div><span>Vencimento</span><strong>{addLeadingZeros(item.dueDate, 2)}/{addLeadingZeros(month, 2)}/{year}</strong></div>
                </div>

                <SetModalCredDebts value={item.id} simbol="fas fa-arrow-right" />
            </article>
        )
    })

    const handleChange = (e) => {
        setShowZeros(!showZeros)
    }

    return (
        <main className="creditCardsPage">
            <header className="creditCardsHeader">
                <div>
                    <span className="creditCardsEyebrow">FINANÇAS / CRÉDITO</span>
                    <h1>Cartões</h1>
                    <p>Acompanhe suas faturas e os cartões cadastrados.</p>
                </div>
                <SetModalAddCard name="Adicionar novo cartão" modalName="Adicionar cartão" simbol="fas fa-plus" />
            </header>

            <div className="creditCardsToolbar">
                <span className="creditCardsCount">{filtered_list.length} {filtered_list.length === 1 ? "cartão" : "cartões"}</span>
                <Form className="creditCardsFilter">
                    <Form.Check
                        type="switch"
                        id="show-all-credit-cards"
                        label="Mostrar cartões sem fatura"
                        checked={showZeros}
                        onChange={handleChange}
                    />
                </Form>
            </div>
            {loading ? (
                <div className="creditCardsState" aria-live="polite">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            ) : (
                filtered_list.length ? (
                    <section className="creditCardsGrid" aria-label="Cartões cadastrados">{lis}</section>
                ) : (
                    <div className="creditCardsState">
                        <i className="fas fa-credit-card" aria-hidden="true"></i>
                        <strong>Nenhum cartão neste período</strong>
                        <span>Adicione um cartão ou habilite a exibição dos cartões sem fatura.</span>
                    </div>
                )
            )}
        </main>)
}


