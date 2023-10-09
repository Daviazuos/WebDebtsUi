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

function SetModalAddDebts(props) {
    const [modalShow, setModalShow] = useState(false);

    function updateValuesv2() {
        props.update(!props.updateStatus);
        setModalShow(false)
    }

    return (
        <>
            <Button style={{ marginLeft: '15px', color: 'black', borderColor: 'black' }} className='btn-custom' variant='white' onClick={() => setModalShow(true)}>
                <i className="fas fa-plus"></i> {props.modalName}
            </Button>

            <ModalAddDebts
                show={modalShow}
                onHide={() => setModalShow(false)}
                update={updateValuesv2}
                head={props.head}
                cardId={props.cardId}
            />
        </>
    );
}


export default function CreditCardSelected({ match }, props) {
    var CurrentDate = new Date();
    CurrentDate.setMonth(CurrentDate.getMonth() + 1);

    const [loading, setLoading] = useState(true);
    const [loadingGraphic, setLoadingGraphic] = useState(true);
    const [key, setKey] = useState(`${localStorage.getItem("month")} - ${localStorage.getItem("year")}`);
    const [installments, setInstallments] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedDate, setSelectedDate] = useState(CurrentDate);
    const [year, setyear] = useState(localStorage.getItem("year"));
    const [card, setCard] = useState([]);
    const [cardMonthValue, setCardMonthValue] = useState(0.00)
    const [cardGraphic, setCardGraphic] = useState(undefined)
    const [months, setMonths] = useState([])
    const [updateStatus, setUpdateStatus] = useState(false)


    const pageChange = event => {
        setPageNumber(event.target.text);
    }

    function updateValues(change) {
        setUpdateStatus(change);
    }

    const cardId = match.params.cardId;

    useEffect(() => {
        axiosInstance.get(Endpoints.debt.filterInstallments(pageNumber, 18, '', selectedDate.getMonth(), selectedDate.getFullYear(), '', '', '', cardId, null))
            .then(res => {
                setInstallments(res.data);
            })
        setUpdateStatus(false)
    }, [pageNumber, selectedDate, updateStatus])

    useEffect(() => {
        axiosInstance.get(Endpoints.card.filterCards(cardId, selectedDate.getMonth(), selectedDate.getFullYear()))
            .then(res => {
                setCard(res.data);
                let cardValue = 0.00
                for (const debt in res.data[0]?.debts) {
                    if (res.data[0]?.debts[debt]?.installments[0]?.value != undefined) {
                        cardValue = cardValue + res.data[0]?.debts[debt]?.installments[0]?.value
                    }
                }
                setCardMonthValue(cardValue)
                setCardGraphic(<Card className="graphicPagePie">
                    <CardApexGraphicPie cardId={res.data[0].id} month={selectedDate.getMonth()} year={selectedDate.getFullYear()}></CardApexGraphicPie>
                </Card>)
                setLoadingGraphic(false)
                setLoading(false)
                setUpdateStatus(false)
            })
    }, [selectedDate, updateStatus])

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

    useEffect(() => {
        var months_dynamic = []
        for (let i = -1; i <= 4; i++) {
            let dateAdjusted = addMonthsToDate(Date(), i)
            months_dynamic.push({
                month: dateAdjusted.split('/')[1],
                year: dateAdjusted.split('/')[2]
            })
        }
        setMonths(months_dynamic)
    }, [selectedDate])

    const handleTabSelect = (selectedTab) => {
        setLoadingGraphic(true)
        setSelectedDate(new Date(selectedTab.split(' - ')[1], selectedTab.split(' - ')[0], 1))
        setKey(selectedTab);
    };

    let tab_lis = ""
    if (!loading) {
        tab_lis = months.map(item => {

            return (
                <Tab eventKey={`${item.month} - ${item.year}`} title={`${monthByNumber(item.month)} - ${item.year}`}>
                    <div className="debtModal">
                        <div class="cardCreditSelected px-4" id='cardCreditSelected'>
                            <Accordion></Accordion>
                            {<SetModalAddDebts modalName="" head={card[0].name} cardId={card[0].id} update={updateValues}></SetModalAddDebts>}{" "}
                            <div className="cardForm">
                                <Form>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Fatura de {monthByNumber(item.month)}</Form.Label>
                                        <Form.Control disabled type="text" value={`R$ ${decimalAdjust(cardMonthValue)}`} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Vencimento</Form.Label>
                                        <Form.Control disabled type="text" value={`${addLeadingZeros(card[0].dueDate, 2)}/${addLeadingZeros(item.month, 2)}/${year}`} />
                                    </Form.Group>
                                </Form>
                            </div>
                            {loadingGraphic ? <Card style={{ width: 600, height: 400 }}></Card> : cardGraphic}
                        </div >

                        <div>
                            <Table responsive hover variant="white" size="lg">
                                <thead>
                                    <tr className="trr">
                                        <th>Nome</th>
                                        <th>Parcela</th>
                                        <th>Valor</th>
                                        <th>Data</th>
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


    return <>
        {loading === true ? <i class="fas fa-spinner fa-spin"></i> :
            <>
                <h1>{card[0].name}</h1>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={handleTabSelect}
                    className="mb-3"
                >
                    {tab_lis}
                </Tabs>
            </>}
    </>
}
