import React from "react";
import { Alert, Button, Container, Form, Modal, Tab, Table, Tabs } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import MaskedFormControl from "../../utils/maskedInputs";
import { dateAdjust } from "../../utils/dateFormater";
import { decimalAdjust } from "../../utils/valuesFormater";
import { walletInstallmentStatusTransform } from "../../utils/enumFormatter";
import { CustomPagination } from "../../components/customPagination/customPagination";

import "./WalletModal.css";
import "../../components/debtModal/DebtModal.css";

const walletStatusValues = {
    Received: "2",
    Pending: "3",
    ToReceive: "4",
    Disable: "1",
    Enable: "0"
};

export default class WalletModalEdit extends React.Component {
    state = {
        wallet: null,
        name: '',
        value: '',
        walletStatus: '4',
        activeTab: 'Detalhes',
        loading: false,
        walletLoadError: '',
        walletError: '',
        installments: [],
        pagination: {},
        pageNumber: 1,
        installmentsLoading: false,
        installmentsError: '',
        editMode: {},
        savingInstallmentId: null
    }

    componentDidMount() {
        if (this.props.show) {
            this.loadWallet();
            this.loadInstallments(1);
        }
    }

    componentDidUpdate(previousProps) {
        if (this.props.show && !previousProps.show) {
            this.setState({ activeTab: 'Detalhes', pageNumber: 1 });
            this.loadWallet();
            this.loadInstallments(1);
        }
    }

    loadWallet = () => {
        this.setState({ loading: true, walletLoadError: '', walletError: '' });
        axiosInstance.get(Endpoints.wallet.getById(this.props.value))
            .then(res => {
                const wallet = res.data;
                this.setState({
                    wallet,
                    name: wallet.name || '',
                    value: '',
                    walletStatus: walletStatusValues[wallet.walletStatus] || String(wallet.walletStatus || '4'),
                    loading: false
                });
            })
            .catch(error => {
                console.error('Erro ao carregar carteira:', error);
                this.setState({ loading: false, walletLoadError: 'Não foi possível carregar os dados da carteira.' });
            });
    }

    loadInstallments = (pageNumber) => {
        this.setState({ installmentsLoading: true, installmentsError: '' });
        axiosInstance.get(Endpoints.wallet.getInstallments(this.props.value, pageNumber, 10))
            .then(res => {
                const installments = res.data.items || [];
                this.setState({
                    installments,
                    pagination: res.data,
                    pageNumber,
                    editMode: {}
                });
            })
            .catch(error => {
                console.error('Erro ao carregar parcelas da carteira:', error);
                this.setState({ installments: [], pagination: {}, installmentsError: 'Não foi possível carregar as parcelas.' });
            })
            .finally(() => {
                this.setState({ installmentsLoading: false });
            });
    }

    nameChange = event => {
        this.setState({ name: event.target.value });
    }

    valueChange = (event, value) => {
        this.setState({ value });
    }

    statusChange = event => {
        this.setState({ walletStatus: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        if (!this.state.wallet) return;

        const editWallet = {
            name: this.state.name || this.state.wallet.name,
            value: this.state.value !== '' ? this.state.value : this.state.wallet.value,
            walletStatus: Number(this.state.walletStatus),
            date: this.state.wallet.date
        };
        axiosInstance.put(Endpoints.wallet.put(this.props.value), editWallet)
            .then(() => {
                if (this.props.onUpdated) this.props.onUpdated();
                if (this.props.onHide) this.props.onHide();
            })
            .catch(error => {
                console.error('Erro ao atualizar carteira:', error);
                this.setState({ walletError: 'Não foi possível atualizar a carteira.' });
            });
    }

    pageChange = event => {
        const pageNumber = Number(event.target.textContent);
        if (pageNumber > 0) this.loadInstallments(pageNumber);
    }

    toggleEditMode = installmentId => {
        this.setState(previousState => ({
            editMode: {
                ...previousState.editMode,
                [installmentId]: !previousState.editMode[installmentId]
            }
        }));
    }

    handleInstallmentChange = (event, installmentId, field) => {
        const value = event.target.value;
        this.setState(previousState => ({
            installments: previousState.installments.map(installment => (
                installment.id === installmentId
                    ? { ...installment, [field]: value }
                    : installment
            ))
        }));
    }

    handleSaveInstallment = installmentId => {
        const installment = this.state.installments.find(item => item.id === installmentId);
        if (!installment) return;

        this.setState({ savingInstallmentId: installmentId, installmentsError: '' });
        axiosInstance.put(Endpoints.wallet.putInstallment(installmentId), {
            date: installment.date,
            installmentNumber: Number(installment.installmentNumber),
            value: Number(installment.value),
            receivedStatus: installment.receivedStatus === true || installment.receivedStatus === 'true'
        })
            .then(() => {
                this.loadInstallments(this.state.pageNumber);
                if (this.props.onUpdated) this.props.onUpdated();
            })
            .catch(error => {
                console.error('Erro ao atualizar parcela da carteira:', error);
                this.setState({ installmentsError: 'Não foi possível atualizar a parcela.' });
            })
            .finally(() => {
                this.setState({ savingInstallmentId: null });
            });
    }

    renderInstallments() {
        if (this.state.installmentsLoading) {
            return <div className="walletInstallmentsState"><i className="fas fa-spinner fa-spin" aria-hidden="true" /> Carregando parcelas...</div>;
        }

        if (this.state.installments.length === 0) {
            return <div className="walletInstallmentsState">Nenhuma parcela encontrada para esta carteira.</div>;
        }

        return (
            <>
                <Table borderless responsive hover size="sm">
                    <thead>
                        <tr>
                            <th>Parcela</th>
                            <th>Valor</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.installments.map(installment => {
                            const isEditing = Boolean(this.state.editMode[installment.id]);
                            const isSaving = this.state.savingInstallmentId === installment.id;

                            return (
                                <tr key={installment.id}>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                aria-label={`Número da parcela ${installment.installmentNumber}`}
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={installment.installmentNumber}
                                                onChange={event => this.handleInstallmentChange(event, installment.id, 'installmentNumber')}
                                            />
                                        ) : installment.installmentNumber === 0 ? 'Fixa' : installment.installmentNumber}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                aria-label={`Valor da parcela ${installment.installmentNumber}`}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={installment.value}
                                                onChange={event => this.handleInstallmentChange(event, installment.id, 'value')}
                                            />
                                        ) : `R$ ${decimalAdjust(installment.value)}`}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                aria-label={`Data da parcela ${installment.installmentNumber}`}
                                                type="date"
                                                value={installment.date ? installment.date.split('T')[0] : ''}
                                                onChange={event => this.handleInstallmentChange(event, installment.id, 'date')}
                                            />
                                        ) : dateAdjust(installment.date)}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <select
                                                aria-label={`Status da parcela ${installment.installmentNumber}`}
                                                value={String(installment.receivedStatus)}
                                                onChange={event => this.handleInstallmentChange(event, installment.id, 'receivedStatus')}
                                            >
                                                <option value="false">Pendente</option>
                                                <option value="true">Recebido</option>
                                            </select>
                                        ) : walletInstallmentStatusTransform(installment.receivedStatus)}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <button
                                                type="button"
                                                className="debtDetailsAction debtDetailsAction--edit"
                                                aria-label={`Salvar parcela ${installment.installmentNumber}`}
                                                title="Salvar parcela"
                                                disabled={isSaving}
                                                onClick={() => this.handleSaveInstallment(installment.id)}
                                            >
                                                <i className={isSaving ? "fas fa-spinner fa-spin" : "fas fa-check"} aria-hidden="true" />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="debtDetailsAction debtDetailsAction--edit"
                                                aria-label={`Editar parcela ${installment.installmentNumber}`}
                                                title="Editar parcela"
                                                onClick={() => this.toggleEditMode(installment.id)}
                                            >
                                                <i className="fas fa-pencil-alt" aria-hidden="true" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <CustomPagination
                    currentPage={this.state.pagination.currentPage}
                    totalItems={this.state.pagination.totalItems}
                    totalPages={this.state.pagination.totalPages}
                    onChange={this.pageChange}
                />
            </>
        );
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                fullscreen="md-down"
                className="debtDetailsModal walletInstallmentEditModal"
                centered
            >
                <Modal.Header closeButton>
                    <div className="debtDetailsHeading">
                        <span className="debtDetailsIcon"><i className="fas fa-wallet" aria-hidden="true" /></span>
                        <div>
                            <span className="debtDetailsEyebrow">FINANÇAS / CARTEIRA</span>
                            <Modal.Title>{this.props.head || this.state.wallet?.name || "Editar carteira"}</Modal.Title>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="debtDetailsBody">
                    {this.state.loading ? (
                        <div className="walletInstallmentsState"><i className="fas fa-spinner fa-spin" aria-hidden="true" /> Carregando carteira...</div>
                    ) : this.state.walletLoadError ? (
                        <Alert variant="danger">{this.state.walletLoadError}</Alert>
                    ) : (
                        <Tabs
                            activeKey={this.state.activeTab}
                            onSelect={activeTab => this.setState({ activeTab })}
                            className="mb-3"
                        >
                            <Tab eventKey="Detalhes" title="Detalhes">
                                {this.state.walletError && <Alert variant="danger">{this.state.walletError}</Alert>}
                                <div className="debtDetailsOverview">
                                    <Container className="debtDetailsFields">
                                        <Form className="debtDetailsForm walletDetailsForm" onSubmit={this.handleSubmit}>
                                            <Form.Group className="debtDetailsField">
                                                <Form.Label>Nome</Form.Label>
                                                <Form.Control value={this.state.name} onChange={this.nameChange} />
                                            </Form.Group>
                                            <Form.Group className="debtDetailsField">
                                                <Form.Label>Valor da carteira</Form.Label>
                                                <MaskedFormControl currency="BRL" required="true" name="value" onChange={this.valueChange} defaultValue={this.state.wallet?.value} />
                                            </Form.Group>
                                            <Form.Group className="debtDetailsField">
                                                <Form.Label>Status de entrada</Form.Label>
                                                <Form.Control as="select" value={this.state.walletStatus} onChange={this.statusChange}>
                                                    <option value="4">A receber</option>
                                                    <option value="3">Pendente</option>
                                                    <option value="2">Recebido</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Button className="walletDetailsSubmit" type="submit" disabled={!this.state.wallet}>
                                                Atualizar carteira
                                            </Button>
                                        </Form>
                                    </Container>
                                    <Container className="debtDetailsProgressPanel">
                                        <div className="walletInstallmentCount">{this.state.pagination.totalItems || 0}</div>
                                        <span className="debtDetailsProgressLabel">Parcelas cadastradas</span>
                                    </Container>
                                </div>
                            </Tab>
                            <Tab eventKey="Parcelas" title="Parcelas">
                                <div className="installmentModal debtInstallments walletInstallments">
                                    {this.state.installmentsError && <Alert variant="danger">{this.state.installmentsError}</Alert>}
                                    {this.renderInstallments()}
                                </div>
                            </Tab>
                        </Tabs>
                    )}
                </Modal.Body>
            </Modal>
        );
    }
}
