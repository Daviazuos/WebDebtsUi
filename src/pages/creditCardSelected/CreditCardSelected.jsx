import { useEffect, useState } from "react";
import { Button, Form, Card, Tab, Table, Tabs, Accordion } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { addMonthsToDate, dateAdjust, monthByNumber } from "../../utils/dateFormater";
import { statusTransform } from "../../utils/enumFormatter";
import { addLeadingZeros, decimalAdjust } from "../../utils/valuesFormater";
import { CustomPagination } from "../../components/customPagination/customPagination";
import CardApexGraphicPie from "../../components/cardGraphicPie/CardApexGraphicPie";
import ModalAddDebts from "../../components/modal/modalDebts";
import "./CreditCardSelected.css"

function SetModalAddDebts(props) {
    const [modalShow, setModalShow] = useState(false);

    function updateValuesv2() {
        props.update(!props.updateStatus);
        setModalShow(false)
    }

    return (
        <>
            <Button variant='custom' style={{ marginLeft: '20px', color: 'black', borderColor: 'black' }} className='btn-custom' onClick={() => setModalShow(true)}>
                <i className="fas fa-plus"></i> {props.modalName}
            </Button>

            <ModalAddDebts
                show={modalShow}
                onHide={() => setModalShow(false)}
                update={updateValuesv2}
                head={props.head}
                cardId={props.cardId}
                color={props.color}
                title={props.head}
            />
        </>
    );
}


export default function CreditCardSelected({ match }, props) {

    const zeroPad = (num, places) => String(num).padStart(places, '0')

    const [loading, setLoading] = useState(true);
    const [loadingGraphic, setLoadingGraphic] = useState(true);
    const [key, setKey] = useState(`${zeroPad(localStorage.getItem("month"), 2)}-${localStorage.getItem("year")}`);
    const [installments, setInstallments] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedDate, setSelectedDate] = useState(`${localStorage.getItem("month")}-${localStorage.getItem("year")}`);
    const [year, setyear] = useState(localStorage.getItem("year"));
    const [month, setMonth] = useState(localStorage.getItem("month"));
    const [cards, setCards] = useState([]); // Modificação para lidar com múltiplos cartões
    const [selectedCardIndex, setSelectedCardIndex] = useState(0); // Index do cartão selecionado
    const [cardClosingDate, setCardClosingDate] = useState(null)
    const [cardMonthValue, setCardMonthValue] = useState(new Map())
    const [cardGraphic, setCardGraphic] = useState(undefined)
    const [months, setMonths] = useState([])
    const [updateStatus, setUpdateStatus] = useState(false)
    const [cardId, setCardId] = useState(match.params.cardId)


    const pageChange = event => {
        setPageNumber(event.target.text);
    }

    function updateValues(change) {
        setUpdateStatus(change);
    }

    useEffect(() => {
        if (cardId != undefined) {
            axiosInstance.get(Endpoints.debt.filterInstallments(pageNumber, 13, '', selectedDate.split('-')[0], selectedDate.split('-')[1], '', '', '', cardId, null))
                .then(res => {
                    setInstallments(res.data);
                })
            setUpdateStatus(false)
        }
    }, [pageNumber, selectedDate, updateStatus, cardId])

    useEffect(() => {
        var months_dynamic = []
        for (let i = -1; i <= 9; i++) {
            var date = new Date();
            date.setMonth(month - 1)
            date.setFullYear(year)
            let dateAdjusted = addMonthsToDate(date, i)
            months_dynamic.push({
                month: dateAdjusted.split('/')[1],
                year: dateAdjusted.split('/')[2]
            })
        }
        setMonths(months_dynamic)
    }, [year])

    useEffect(() => {
        // Alteração: Carregar múltiplos cartões e configurar o estado dos cartões
        axiosInstance.get(Endpoints.card.filterCards(null, selectedDate.split('-')[0], selectedDate.split('-')[1]))
            .then(res => {
                setCards(res.data); // Armazena todos os cartões
                const cardIndex = res.data.findIndex(card => card.id === cardId);
                setSelectedCardIndex(cardIndex >= 0 ? cardIndex : 0); // Inicia com o primeiro cartão selecionado

                // Novo Map para armazenar o valor total por cartão
                const cardClosingDate = new Map();
                const cardValue = new Map();


                // Iterar sobre todos os cartões
                res.data.forEach(card => {
                    let closingDate = card.closureDate > card.dueDate ? `${addLeadingZeros(card.closureDate, 2)}/${addLeadingZeros(month - 1, 2)}/${year}` : `${addLeadingZeros(card.closureDate, 2)}/${addLeadingZeros(month, 2)}/${year}`
                    cardClosingDate.set(card.id, { closingDate: closingDate });
                    let value = 0.00
                    card.debts.forEach(debt => {
                        value = value + ((debt?.installments[0]?.value == undefined) ? 0.00 : debt?.installments[0]?.value)
                    })
                    cardValue.set(card.id, { totalValue: value })
                    
                    setCardMonthValue(cardValue)
                });



                setCardClosingDate(cardClosingDate)

                setCardId(res.data[0].id)
                setCardGraphic(<Card className="graphicPagePie">
                    <CardApexGraphicPie cardId={res.data[0].id} month={selectedDate.split('-')[0]} year={selectedDate.split('-')[1]}></CardApexGraphicPie>
                </Card>)
                setLoadingGraphic(false)
                setUpdateStatus(false)
                setLoading(false)
            });
    }, [updateStatus]);

    // Função para selecionar o cartão ao clicar
    const selectCard = (index, cardId) => {
        setSelectedCardIndex(index);
        setCardId(cardId)
    };

    const lis_instalments = installments.items?.map(item => {
        return (
            <tr key={item.id}>
                <td>{item.debtName}</td>
                <td>{item.installmentNumber === 0 ? "Fixa" : item.installmentNumber}</td>
                <td>
                    R$ {decimalAdjust(item.value)}
                </td>
                <td>{dateAdjust(item.date)}</td>
                <td>{statusTransform(item.status)}</td>
            </tr>
        )
    })

    const handleTabSelect = (selectedTab) => {
        setLoadingGraphic(true)
        setSelectedDate(selectedTab)
        setKey(selectedTab);
    };

    let closingDate = ""
    let tab_lis = ""
    if (!loading) {
        tab_lis = months.map(item => {

            return (
                <Tab eventKey={`${item.month}-${item.year}`} title={`${monthByNumber(item.month)}/${item.year}`}>
                    <div className="CreditCardCard">
                        <SetModalAddDebts modalName="Adicionar" head={cards[selectedCardIndex].name} cardId={cards[selectedCardIndex].id} update={updateValues} color={`${(cards[selectedCardIndex].color != null && cards[selectedCardIndex].color != '') ? cards[selectedCardIndex].color : "#6F87E1"}`}></SetModalAddDebts>
                        <div style={{ marginLeft: '20px' }}>
                            <Table responsive striped hover variant="white" size="lg">
                                <thead>
                                    <tr className="trr">
                                        <th>Nome</th>
                                        <th>Parcela</th>
                                        <th>Valor</th>
                                        <th>Data da compra</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lis_instalments}
                                </tbody>
                            </Table>
                            <CustomPagination currentPage={installments.currentPage} totalItems={installments.totalItems} totalPages={installments.totalPages} onChange={pageChange}></CustomPagination>
                        </div>
                    </div>
                </Tab>
            )
        }
        )
    }

    return (
        <>
            {loading === true ? <i className="fas fa-spinner fa-spin"></i> :
                <>
                    {/* Cartões empilhados */}
                    <div className="card-stack-container" style={{ position: 'relative', marginBottom: "-115px", zIndex: 2, display: 'flex', flexDirection: 'row' }}>
                        {cards.map((card, index) => (
                            <div class="cardCreditSelected px-4" id='cardCreditSelected' style={{
                                position: 'relative', marginBottom: "-115px", display: 'flex', flexDirection: 'row'
                            }}>
                                <div className={`debit-card card-2 mb-4 ${selectedCardIndex === index ? 'selected' : ''}`} onClick={() => selectCard(index, card.id)} style={{
                                    backgroundColor: `${card.color !== null && card.color !== '' ? card.color : "#6F87E1"}`,
                                    position: 'absolute',
                                    left: `${index * 50}px`,
                                    zIndex: selectedCardIndex === index
                                        ? cards.length
                                        : index < selectedCardIndex
                                            ? index
                                            : cards.length - (index - selectedCardIndex),
                                    cursor: 'pointer',
                                    transform: selectedCardIndex === index ? 'scale(1)' : 'scale(0.9)', // Tamanho menor para os cartões atrás
                                    transition: 'all 0.4s ease', // Transição suave
                                    pointerEvents: 'auto'
                                }}>
                                    <div class="d-flex flex-column h-100">
                                        <label class="d-block">
                                            <div class="d-flex position-relative">
                                                <div>
                                                    <h3 class="text-white fw-bold">{((card.name).length > 15) ? (((card.name).substring(0, 17 - 3)) + '...') : card.name}</h3>
                                                </div>
                                            </div>
                                            <div id='textCard' class="mt-auto fw-bold d-flex align-items-center justify-content-between">
                                                <div className="creditBody">
                                                    <p id="cardText" class="m-0">Fechamento {cardClosingDate.get(card.id).closingDate}</p>
                                                    <p id="cardText" class="m-0">Vencimento {addLeadingZeros(card.dueDate, 2)}/{selectedDate.replace('-', '/')}</p>
                                                </div>
                                                <h5 id="cardText" class="m-0">R$ {decimalAdjust(cardMonthValue.get(card.id)?.totalValue)}</h5>
                                            </div>
                                            <div style={{ display: 'flex', marginTop: '40px', marginLeft: '0px' }}>
                                            </div>
                                        </label>
                                    </div>
                                </div >
                            </div>
                        ))}
                    </div>
                    <Card style={{ zIndex: 2, borderColor: `${(cards[selectedCardIndex].color != null && cards[selectedCardIndex].color != '') ? cards[selectedCardIndex].color : "#6F87E1"}`, borderWidth: '6px', padding: '10px' }}>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={handleTabSelect}
                            className="mb-3"
                            style={{ zIndex: 3, marginLeft: '20px' }}
                        >
                            {tab_lis}
                        </Tabs>
                    </Card>
                </>
            }
        </>
    );
}
