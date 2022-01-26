import React from "react";
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from "../../api";
import "./CreditCard.css"
import { decimalAdjust } from "../../utils/valuesFormater";
import { Button, Container } from "react-bootstrap";
import ModalAddDebts from "../../components/modal/modalDebts";
import CustomModal from "../../components/customModal/CustomModal";
import CreditCardModal from "./CreditCardModal";
import { getMonthYear } from "../../utils/utils";

const { month, year } = getMonthYear()


function refreshPage() {
    window.location.reload();
  }
  
  function Delete(id) {
    axiosInstance.delete(Endpoints.card.deleteById(id)).then(response => {
      const id = response.data.Body;
      refreshPage()
    })
    return (
      <>
      </>
    )
  }

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
                head="Adicionar débitos"
                cardId={props.cardId}
            />
        </>
    );
}

function SetModalCredDebts(props) {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <>
            <Button className='btn btn-blue' variant='dark' onClick={() => setModalShow(true)}>
                <i className={props.simbol}></i> {props.modalName}
            </Button>
            <CustomModal
                id={props.value}
                month={month}
                year={year}
                show={modalShow}
                onHide={() => setModalShow(false)}
                head={props.name}
            />
        </>
    );
}

export default class CardCredit extends React.Component {
    state = {
        cards: []
    }

    componentDidMount() {
        axiosInstance.get(Endpoints.card.filterCards(null, month, year))
            .then(res => {
                const cards = res.data;
                this.setState({ cards });
            })
    }

    render() {
        const lis = this.state.cards.map(item => {
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
                                    <p class="text-black fw-bold">{item.name}</p>
                                </div>
                            </div>
                            {<SetModalAddDebts modalName="" cardId={item.id}></SetModalAddDebts>}{" "}
                            {<SetModalCredDebts value={item.id} name={item.name} modalName="" simbol="fas fa-search"></SetModalCredDebts>}{" "}
                            <Button className="btn btn-danger" onClick={() => Delete(item.id)}>
                                <i className="fa fa-trash" aria-hidden="true"></i>
                            </Button>
                        </label>
                            <div class="mt-auto fw-bold d-flex align-items-center justify-content-between">
                                <div className="creditBody">
                                    <p class="m-0">Valor Total R$ {decimalAdjust(cardValue)}</p>
                                    <p class="m-0">Fechamento {item.closureDate}/{month}/{year}</p>
                                    <p class="m-0">Vencimento {item.dueDate}/{month}/{year}</p>
                                </div>
                            </div>
                        </div>
                    </div >
                )
            }
        })

        return (
            <Container className="containerCardPage">
                <div class="cardCredit card px-4">
                    {lis}
                </div>
                {<SetModalAddCard name={'Adicionar novo cartão'} modalName="Adicionar cartão" simbol="fas fa-plus" className="modalButton"></SetModalAddCard>}{" "}
            </Container>)
    }
};

