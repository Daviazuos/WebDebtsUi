import React from "react";
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from "../../api";
import "./CreditCard.css"
import { decimalAdjust } from "../../utils/valuesFormater";
import { Button, Container } from "react-bootstrap";
import ModalAddDebts from "../../components/modal/modalDebts";
import CustomModal from "../../components/customModal/CustomModal";



const today = new Date();
const mm = String(today.getMonth() + 1).padStart(2, '0')
const yyyy = today.getFullYear()


function SetModal(props) {
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
                month={mm}
                year={yyyy}
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
        axiosInstance.get(Endpoints.card.filterCards(null, 2, yyyy))
            .then(res => {
                const cards = res.data;
                this.setState({ cards });
            })
    }

    render() {
        const lis = this.state.cards.map(item => {
            let valueTotal = 0
            for (const debt in item?.debts) {
                valueTotal = valueTotal + item?.debts[debt].installments.reduce(function (prev, cur) {
                    return prev + cur.value;
                }, 0);
            }

            {
                return (
                    <div class="debit-card card-2 mb-4" >
                        <div class="d-flex flex-column h-100"> <label class="d-block">
                            <div class="d-flex position-relative">
                                <div>
                                    <p class="text-white fw-bold">{item.name}</p>
                                </div>
                                <div class="input"></div>
                            </div>
                            {<SetModal modalName=""></SetModal>}{" "}
                            {<SetModalCredDebts value={item.id} name={item.name} modalName="" simbol="fas fa-search"></SetModalCredDebts>}{" "}
                        </label>
                            <div class="mt-auto fw-bold d-flex align-items-center justify-content-between">
                                <div className="creditBody">
                                    <p class="m-0">Valor Total R$ {decimalAdjust(valueTotal)}</p>
                                    <p class="m-0">Fechamento {item.closureDate}/{mm}/{yyyy}</p>
                                    <p class="m-0">Vencimento {item.dueDate}/{mm}/{yyyy}</p>
                                </div>
                            </div>
                        </div>
                    </div >
                )
            }
        })

        return (<Container className="containerCardPage">
                <div class="cardCredit card px-4">
                    {lis}
                </div>
            
        </Container>)
    }
};

