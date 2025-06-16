import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import { debtInstallmentTypeToNumber } from "../../utils/enumFormatter";
import MaskedFormControl from "../../utils/maskedInputs";

import "./WalletModal.css"



function refreshPage() {
    window.location.reload();
}

export default class ModalInstallments extends React.Component {
    state = {
        wallet: '',
        name: '',
        value: '',
        walletStatus: '4',
        type: '',
        month: '',
        numberOfInstallments: '',
        walletInstallmentType: '',
        responsibleParty: '',
        listResponsibleParty: '',
        checked: false
    }

    componentDidMount() {
        console.log(this.props.value)
        if (this.props.value !== undefined) {
            axiosInstance.get(Endpoints.wallet.getById(this.props.value))
                .then(res => {
                    const wallet = res.data
                    this.setState({ wallet })
                })
        }

        axiosInstance.get(Endpoints.responsibleParty.getByUser())
            .then(res => {
                const responsibleParty = res.data;

                const listResponsibleParty = responsibleParty.map(item => {
                    return (
                        <option value={item.id}>{item.name}</option>
                    )
                })
                listResponsibleParty.unshift(<option value="">Escolha uma pessoa</option>)
                this.setState({ listResponsibleParty })
            })


    }

    nameChange = event => {
        this.setState({ name: event.target.value });
    }
    valueChange = (event, value, maskedValue) => {
        this.setState({ value: value });
    }
    statusChange = event => {
        this.setState({ walletStatus: event.target.value });
    }

    checkChange = event => {
        if (event.target.checked) {
            this.setState({ checked: true });
        } else {
            this.setState({ checked: false });
        }
    }


    responsiblePartyChange = event => {
        this.setState({ responsibleParty: event.target.value });
    }

    typeChange = event => {
        this.setState({ type: event.target.value });
    }

    monthChange = event => {
        this.setState({ month: event.target.value + '-01' });
    }

    walletInstallmentTypeChange = event => {
        this.setState({ walletInstallmentType: event.target.value });
    }

    numberOfInstallmentsChange = event => {
        this.setState({ numberOfInstallments: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();

        const editWallet = (this.state.walletStatus !== "3") ? {
            name: this.state.name || this.state.wallet.name,
            value: this.state.value || this.state.wallet.value,
            walletStatus: this.state.walletStatus || this.state.wallet.walletStatus,
            date: this.state.month || this.state.wallet.month,
            numberOfInstallments: this.state.numberOfInstallments || this.state.wallet.numberOfInstallments,
            walletInstallmentType: this.state.walletInstallmentType || this.state.wallet.walletInstallmentType,
            responsiblePartyId: this.state.responsibleParty || this.state.wallet.responsiblePartyId
        } : {
            name: this.state.name || this.state.wallet.name,
            value: this.state.value || this.state.wallet.value,
            walletStatus: this.state.walletStatus || this.state.wallet.walletStatus,
            responsiblePartyId: this.state.responsibleParty || this.state.wallet.responsiblePartyId,
        };

        if (this.props.value) {
            axiosInstance.put(Endpoints.wallet.put(this.props.value), editWallet).then(response => {
                const id = response.data.Body;
                refreshPage()
            })
        }
        else {
            axiosInstance.post(Endpoints.wallet.add(), editWallet).then(response => {
                const id = response.data.Body;
                refreshPage()
            })
        }

    }

    render() {
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
                            <Form.Label>Nome</Form.Label>
                            <Form.Control name="name" onChange={this.nameChange} placeholder="Nome" defaultValue={this.state.wallet?.name} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Valor</Form.Label>
                            <MaskedFormControl currency="BRL" required="true" name='value' onChange={this.valueChange} placeholder="Valor" defaultValue={this.state.wallet?.value} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Status de entrada</Form.Label>
                            <Form.Control as="select" name='walletStatus' onChange={this.statusChange} defaultValue={this.state.wallet?.status}>
                                <option value="4">Á receber</option>
                                <option value="3">Pendente</option>
                                <option value="2">Recebido</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Mês</Form.Label>
                            <Form.Control type="month" onChange={this.monthChange} defaultValue={this.state.wallet?.startAt?.substring(0, 7)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tipo de entrada</Form.Label>
                            <Form.Control required="true" as="select" name='walletInstallmentType' onChange={this.walletInstallmentTypeChange} defaultValue={debtInstallmentTypeToNumber(this.state.wallet.walletInstallmentType)}>
                                <option>Selecione o Tipo de debito</option>
                                <option value="0">Parcelado</option>
                                <option value="1">Fixo</option>
                                <option value="2">Simples</option>
                            </Form.Control>
                        </Form.Group>
                        {(this.state.walletInstallmentType === "0" || debtInstallmentTypeToNumber(this.state.wallet.walletInstallmentType) == "0") ?
                            <Form.Group>
                                <Form.Label>Quantidade de Parcelas</Form.Label>
                                <Form.Control name='numberOfInstallments' type="number" onChange={this.numberOfInstallmentsChange} placeholder="Entre com o quantidade de parcelas" defaultValue={this.state.wallet.numberOfInstallments} />
                            </Form.Group> : ""}
                        <p></p>
                        <Form.Label>Vincular a uma pessoa</Form.Label>
                        <Form.Control required="true" name='responsibleParty' onChange={this.responsiblePartyChange} as="select">
                            {this.state.listResponsibleParty}
                        </Form.Control>
                        <p></p>
                        <Button variant="dark" type="submit"> {this.props.value ? 'Atualizar' : 'Adicionar'} </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}



