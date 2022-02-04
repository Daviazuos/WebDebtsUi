import React, { useEffect, useState } from "react";
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from "../../api";
import "./CreditCard.css"
import { decimalAdjust } from "../../utils/valuesFormater";
import { Button, Container } from "react-bootstrap";
import ModalAddDebts from "../../components/modal/modalDebts";
import CustomModal from "../../components/customModal/CustomModal";
import CreditCardModal from "./CreditCardModal";
import ModalDelete from "../../components/modalDelete/ModalDelete";

function SetModalAddCard(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <Button className={props.className} variant='dark' onClick={() => setModalShow(true)}>
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

function SetModalAddDebts(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <Button className='btn btn-blue' variant='dark' onClick={() => setModalShow(true)}>
                <i className="fas fa-plus"></i> {props.modalName}
            </Button>

            <ModalAddDebts
                show={modalShow}
                onHide={() => setModalShow(false)}
                head={props.head}
                cardId={props.cardId}
            />
        </>
    );
}

function SetModalCredDebts(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <Button className='btn btn-green' onClick={() => setModalShow(true)}>
                <i className={props.simbol}></i> {props.modalName}
            </Button>
            <CustomModal
                id={props.value}
                show={modalShow}
                onHide={() => setModalShow(false)}
                head={props.name}
                month={props.month}
                totalValue={props.totalValue}
            />
        </>
    );
}


function SetModalDelete(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
      <>
        <Button className='btn btn-danger' variant='dark' onClick={() => setModalShow(true)}>
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
    const [cards, setCards] = useState([]);
    const [month, setMonth] = useState(localStorage.getItem("month"));
    const [year, setyear] = useState(localStorage.getItem("year"));

    useEffect(() => {
        let mounted = true;
        axiosInstance.get(Endpoints.card.filterCards(null, month, year))
            .then(res => {
                setCards(res.data);
            })
        return () => mounted = false;
    }, [month])

    const lis = cards.map(item => {
        let cardValue = 0.00

        for (const debt in item?.debts) {
            if (item?.debts[debt]?.installments[0]?.value != undefined) {
                cardValue = cardValue + item?.debts[debt]?.installments[0]?.value
            }
        }

        {
            return (
                <div class="debit-card card-2 mb-4" style={{ backgroundColor: `${(item.color != null && item.color != '') ? item.color : "#6F87E1"}` }}>
                    <div class="d-flex flex-column h-100"> <label class="d-block">
                        <div class="d-flex position-relative">
                            <div>
                                <p class="text-white fw-bold">{item.name}</p>
                            </div>
                        </div>
                        {<SetModalAddDebts modalName="" head={item.name} cardId={item.id}></SetModalAddDebts>}{" "}
                        {<SetModalCredDebts value={item.id} name={item.name} modalName="" month={month} simbol="fas fa-search" totalValue={decimalAdjust(cardValue)}></SetModalCredDebts>}{" "}
                        {<SetModalDelete id={item.id}></SetModalDelete>}
                    </label>
                        <div class="mt-auto fw-bold d-flex align-items-center justify-content-between">
                            <div className="creditBody">
                                <p id="cardText" class="m-0">Valor Total R$ {decimalAdjust(cardValue)}</p>
                                <p id="cardText" class="m-0">Fechamento {item.closureDate}/{month}/2022</p>
                                <p id="cardText" class="m-0">Vencimento {item.dueDate}/{month}/2022</p>
                            </div>
                        </div>
                    </div>
                </div >
            )
        }
    })

    return (
        <Container className="containerCardPage">
            <div class="cardCredit card px-4" id='cardCredit'>
                {lis}
            </div>
            {<SetModalAddCard name={'Adicionar novo cartão'} modalName="Adicionar" simbol="fas fa-plus" className="modalButton"></SetModalAddCard>}{" "}
        </Container>)
}


