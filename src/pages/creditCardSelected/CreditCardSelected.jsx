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
import { InvoiceReconciliationModal } from "../../components/invoiceReconciliation";
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
    const [changingMonth, setChangingMonth] = useState(true);
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
    const [months, setMonths] = useState([])
    const [updateStatus, setUpdateStatus] = useState(false)
    const [cardId, setCardId] = useState(match.params.cardId)
    const [showInvoiceModal, setShowInvoiceModal] = useState(false)
    const [allInstallments, setAllInstallments] = useState([])


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
        if (cardId != undefined) {
            axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', selectedDate.split('-')[0], selectedDate.split('-')[1], '', '', '', cardId, null))
                .then(res => {
                    setAllInstallments(res.data);
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
        axiosInstance.get(Endpoints.card.filterCards(1, 9999, null, selectedDate.split('-')[0], selectedDate.split('-')[1], false))
            .then(res => {
                const items = res.data.items || [];
                setCards(items);
                const cardIndex = items.findIndex(card => card.id === cardId);
                setSelectedCardIndex(cardIndex >= 0 ? cardIndex : 0);

                const cardClosingDateVariable = new Map();
                const cardValue = new Map();

                items.forEach(card => {
                    const closingDate = card.closureDate > card.dueDate
                        ? `${addLeadingZeros(card.closureDate, 2)}/${addLeadingZeros(selectedDate.split('-')[0] - 1, 2)}/${selectedDate.split('-')[1]}`
                        : `${addLeadingZeros(card.closureDate, 2)}/${addLeadingZeros(selectedDate.split('-')[0], 2)}/${selectedDate.split('-')[1]}`;

                    cardClosingDateVariable.set(card.id, { closingDate });

                    let value = 0.00;
                    (card.debts || []).forEach(debt => {
                        value += Number(debt?.installments?.[0]?.value || 0);
                    });
                    cardValue.set(card.id, { totalValue: value });
                });

                setCardMonthValue(cardValue);
                setCardClosingDate(cardClosingDateVariable);
                setUpdateStatus(false);
            })
            .catch(() => {
                setCards([]);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [updateStatus, changingMonth, selectedDate, cardId]);

    // Função para selecionar o cartão ao clicar
    const selectCard = (index, cardId) => {
        setSelectedCardIndex(index);
        setCardId(cardId)
        setPageNumber(1)
    };

    const lis_instalments = installments.items?.map(item => {
        return (
            <tr key={item.id} className="CreditCardSelectedTable">
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
        console.log(selectedTab)
        setChangingMonth(!changingMonth)
        setSelectedDate(selectedTab)
        setKey(selectedTab);
    };

    const selectedCard = cards[selectedCardIndex] || {};
    let tab_lis = "";
    if (!loading && cards.length > 0) {
        tab_lis = months.map(item => {
            let titleCard = (
                <div>
                    <p>{selectedCard.name}</p>
                    <p style={{ fontSize: '12px' }}>Fechamento {cardClosingDate?.get(selectedCard.id)?.closingDate}</p>
                </div>
            );

            return (
                <Tab className="CreditCardSelectedTab" eventKey={`${item.month}-${item.year}`} title={`${monthByNumber(item.month)}/${item.year}`}>
                    <div className="CreditCardCard">
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <SetModalAddDebts modalName="Adicionar" head={titleCard} cardId={selectedCard.id} update={updateValues} color={`${(selectedCard.color != null && selectedCard.color != '') ? selectedCard.color : "#6F87E1"}`}></SetModalAddDebts>
                            <Button variant='custom' style={{ marginLeft: '0px', color: 'black', borderColor: 'black' }} className='btn-custom' onClick={() => setShowInvoiceModal(true)}>
                                <i className="fas fa-receipt"></i> Conferir Fatura
                            </Button>
                        </div>
                        <div style={{ marginLeft: '20px' }}>
                            <Table borderless striped responsive hover variant="white" size="lg">
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
            {loading ? <i className="fas fa-spinner fa-spin"></i> :
                <>
                    {/* Cartões empilhados */}
                    <div className="card-stack-container">
                        {cards.map((card, index) => (
                            <div className={`cardCreditSelected px-4 ${selectedCardIndex === index ? 'selected' : ''}`} id='cardCreditSelected' style={{
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
                                                    <p id="cardText" class="m-0">Fechamento {cardClosingDate?.get(card.id)?.closingDate}</p>
                                                    <p id="cardText" class="m-0">Vencimento {addLeadingZeros(card.dueDate, 2)}/{selectedDate.replace('-', '/')}</p>
                                                </div>
                                                <h5 id="cardText" class="m-0">R$ {decimalAdjust(cardMonthValue.get(card.id)?.totalValue || 0)}</h5>
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
                    <InvoiceReconciliationModal
                        show={showInvoiceModal}
                        handleClose={() => setShowInvoiceModal(false)}
                        transactions={allInstallments.items || []}
                        totalLancado={cardMonthValue.get(selectedCard.id)?.totalValue || 0}
                        valueKey="value"
                        dateKey="date"
                        nameKey="debtName"
                        idKey="id"
                        statusKey="status"
                    />
                </>
            }
        </>
    );
}


