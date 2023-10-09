import { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Tab, Table, Tabs } from "react-bootstrap";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { dateAdjust } from "../../utils/dateFormater";
import { statusTransform } from "../../utils/enumFormatter";
import { decimalAdjust } from "../../utils/valuesFormater";
import { CustomPagination } from "../customPagination/customPagination";
import ModalAddDebts from "../modal/modalDebts";
import ModalDelete from "../modalDelete/ModalDelete";
import "./DebtModal.css"

function SetModal(props) {
    const [modalShow, setModalShow] = useState(false);
    return (
        <>
            <Button style={{ margin: '10px' }} className='btn btn-secondary' variant='dark' onClick={() => setModalShow(true)}>
                <i className={props.simbol}></i> {props.modalName}
            </Button>

            <ModalAddDebts
                show={modalShow}
                onHide={() => setModalShow(false)}
                head={props.modalName}
                value={props.value}
                data={props.data}
            />
        </>
    );
}

function SetModalDelete(props) {
    const [modalShow, setModalShow] = useState(false);
    return (
        <>
            <Button style={{ margin: '10px' }} className='btn btn-danger' variant='dark' onClick={() => setModalShow(true)}>
                <i className="fa fa-trash"></i> {props.modalName}
            </Button>
            <ModalDelete
                show={modalShow}
                onHide={() => setModalShow(false)}
                head={props.name}
                deleteUrl={Endpoints.debt.deleteById(props.id)}
            />
        </>
    );
}

export default function DebtModal(props) {
    const [modalShow, setModalShow] = useState();
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState();
    const [debt, setDebt] = useState();
    const [paidValue, setPaidValue] = useState(0);
    const [valueMonth, setValueMonth] = useState(0.00);
    const [installments, setInstallments] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [installmentNumber, setInstallmentNumber] = useState('-')

    const pageChange = event => {
        setPageNumber(event.target.text);
    }

    useEffect(() => {
        if (modalShow === true) {
            setLoading(true)
            axiosInstance.get(Endpoints.debt.getById(props.id))
                .then(res => {
                    setDebt(res.data)
                    setPaidValue(res.data.installments?.filter(({ status }) => status === 'Paid').reduce(function (prev, cur) {
                        return prev + cur.value;
                    }, 0))
                    setInstallmentNumber(res.data.debtInstallmentType === 'Fixed' ?
                        'Fixo' : (res.data.paidInstallment === null ? 0 : res.data.paidInstallment) +'/'+ (res.data.numberOfInstallments === 0 ? 1 : res.data.numberOfInstallments)
                    )
                    var dateInstallment = res.data.installments.filter(installment => installment.installmentNumber === parseInt(res.data.paidInstallment === null ? 1 : res.data.paidInstallment))
                    setValueMonth(dateInstallment[0].value)
                    setLoading(false)
                })
        }
    }, [props.id, modalShow])


    useEffect(() => {
        if (modalShow === true) {
            axiosInstance.get(Endpoints.debt.filterInstallments(pageNumber, 10, props.id, '', '', '', '', '', '', null))
                .then(res => {
                    setInstallments(res.data)
                })
        }
    }, [props.id, pageNumber, modalShow])

    const lis_instalments = installments.items?.map(item => {
        return (
            <tr key={item.id}>
                <td>{item.installmentNumber === 0 ? "Fixa" : item.installmentNumber}</td>
                <td>
                    R$ {decimalAdjust(item.value)}
                </td>
                <td>{dateAdjust(item.date)}</td>
                <td>{statusTransform(item.status)}</td>
            </tr>
        )
    })

    const percentual_paid = paidValue / debt?.value * 100

    const lis = [<Tab eventKey={'Detalhes'} title={'Detalhes'}>
        <div className="debtModal">
            <Container>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Valor Total</Form.Label>
                        <Form.Control disabled type="text" defaultValue={`R$ ${decimalAdjust(debt?.value)}`} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Valor Parcela</Form.Label>
                        <Form.Control disabled type="text" defaultValue={`R$ ${decimalAdjust(valueMonth)}`} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Parcelas</Form.Label>
                        <Form.Control disabled type="text" defaultValue={installmentNumber} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control disabled type="text" defaultValue={debt?.category} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Data Início</Form.Label>
                        <Form.Control disabled type="text" defaultValue={dateAdjust(debt?.date)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Data Fim</Form.Label>
                        <Form.Control disabled type="text" defaultValue={dateAdjust(debt?.installments.at(-1).date)} />
                    </Form.Group>
                </Form>
            </Container>
            <Container>
                <div className="chartProgress" style={{ width: 300, height: 300 }}>
                    <CircularProgressbar styles={buildStyles({pathColor: '#198754', textSize: '10px'})} value={percentual_paid} text={`R$ ${decimalAdjust(paidValue)}`} />
                </div>
                <div className="buttonsModal">
                    {<SetModal value={debt?.id} data={debt} name={debt?.name} isPaid={(debt?.debtInstallmentType !== 'Fixed') && (debt?.numberOfInstallments === debt?.paidInstallment)} modalName="" simbol="fas fa-edit" className='btn btn-primary'></SetModal>}{" "}
                    {<SetModalDelete id={debt?.id} modalName=""></SetModalDelete>}
                </div>
            </Container>
        </div>
    </Tab>,
    <Tab eventKey={'Parcelas'} title={'Parcelas'}>
        <div className="installmentModal">
            <Table responsive hover variant="white" size="lg">
                <thead>
                    <tr className="trr">
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
    </Tab>]

    return <>
        <Button onClick={() => setModalShow(true)}><i class="fas fa-search fa-sm"></i></Button>
        <Modal
            show={modalShow}
            size='lg'
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => setModalShow(false)}
        >
            <Modal.Header closeButton onHide={() => setModalShow(false)}>
                <h2>{debt?.name}</h2>

            </Modal.Header>
            <Modal.Body className="modalBodyCustom">
                {loading === true ? <i class="fas fa-spinner fa-spin"></i> :
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        {lis}
                    </Tabs>}
            </Modal.Body>
        </Modal>
    </>
}
