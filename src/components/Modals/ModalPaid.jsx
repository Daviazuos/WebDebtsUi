import React from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';


function SetStatus(id, status) {
    axiosInstance.put(Endpoints.debt.put(id, status)).then(response => {
        const id = response.data.Body;
        refreshPage()
    })
    return (
        <>
            Status Trocado!
        </>
    )
}

function refreshPage() {
    window.location.reload();
}


export default class ModalPaid extends React.Component {
    state = {
        installments: [],
        wallet: [],
        date: '',
        walletId: ''
    }

    dateChange = event => {
        this.setState({ date: event.target.value });
    }
    walletIdChange = event => {
        this.setState({ walletId: event.target.value });
    }

    componentDidMount() {
        axiosInstance.get(Endpoints.debt.filterInstallments(1, this.props.value, '', '', '', ''))
            .then(res => {
                const installments = res.data;
                this.setState({ installments });
            })
    }

    componentDidMount() {
        axiosInstance.get(Endpoints.wallet.getEnable('Enable', this.props.month, this.props.year))
            .then(res => {
                const wallet = res.data;
                this.setState({ wallet });
            })
    }

    handleSubmit = event => {
        event.preventDefault();
        axiosInstance.put(Endpoints.debt.put(this.props.value,  "Paid", this.state.date, this.state.walletId)).then(response => {
            const id = response.data.Body;
            refreshPage()
        })
    }

    render() {
        const lis = this.state.wallet.map(item => {
            return (
                <option value={item.id}>{item.name}</option>
            )
        })
        lis.unshift(<option>Escolha uma carteira</option>)
        return (
            <Modal
                {...this.props}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.head}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Data pagamento</Form.Label>
                            <Form.Control required="true" name='date' type="date" onChange={this.dateChange} placeholder="Entre com o data" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Carteira</Form.Label>
                            <Form.Control required="true" as="select" name='debtInstallmentType' onChange={this.walletIdChange}>
                                {lis}
                            </Form.Control>
                        </Form.Group>
                        <Button className="btn btn-success" type="submit">Pago <i className="fas fa-check"></i></Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}



