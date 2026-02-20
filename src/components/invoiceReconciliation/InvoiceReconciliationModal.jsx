import { useState, useMemo } from 'react';
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Table,
  Tab,
  Nav,
  Badge,
} from 'react-bootstrap';
import { axiosInstance } from '../../api';
import { Endpoints } from '../../api/endpoints';
import {
  calculateTotal,
  calculateDifference,
  getDifferenceMessage,
  detectDuplicates,
  calculateSelectedTotal,
  formatCurrency,
  formatDate,
} from './invoiceReconciliationUtils';
import './InvoiceReconciliationModal.css';

/**
 * Componente Modal para reconciliação de fatura de cartão de crédito
 * Permite validar lançamentos contra a fatura do banco
 */
function InvoiceReconciliationModal({
  show,
  handleClose,
  transactions = [],
  totalLancado = 0,
  valueKey = 'value',
  dateKey = 'date',
  nameKey = 'debtName',
  idKey = 'id',
  statusKey = 'status',
}) {
  // Estado principal
  const [totalFatura, setTotalFatura] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState(new Set());
  const [activeTab, setActiveTab] = useState('simple');
  const [deletedTransactions, setDeletedTransactions] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // Calcular valores derivados
  const calculatedTotal = useMemo(() => {
    return calculateTotal(transactions, valueKey);
  }, [transactions, valueKey]);

  const totalToUse = totalLancado || calculatedTotal;

  const difference = useMemo(() => {
    return calculateDifference(totalFatura, totalToUse);
  }, [totalFatura, totalToUse]);

  const statusMessage = useMemo(() => {
    return getDifferenceMessage(difference);
  }, [difference]);

  const duplicates = useMemo(() => {
    return detectDuplicates(transactions, valueKey, dateKey, idKey);
  }, [transactions, valueKey, dateKey, idKey]);

  const selectedTotal = useMemo(() => {
    return calculateSelectedTotal(
      transactions,
      Array.from(selectedTransactions),
      valueKey,
      idKey
    );
  }, [selectedTransactions, transactions, valueKey, idKey]);

  const remaining = useMemo(() => {
    const fatura = parseFloat(totalFatura) || 0;
    return fatura - selectedTotal;
  }, [totalFatura, selectedTotal]);

  // Handlers
  const handleTotalFaturaChange = (e) => {
    const value = e.target.value.replace(',', '.');
    setTotalFatura(value);
  };

  const handleSelectTransaction = (transactionId) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(transactionId)) {
      newSelected.delete(transactionId);
    } else {
      newSelected.add(transactionId);
    }
    setSelectedTransactions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTransactions.size === transactions.length) {
      setSelectedTransactions(new Set());
    } else {
      const allIds = transactions.map((t) => t[idKey]);
      setSelectedTransactions(new Set(allIds));
    }
  };

  const handleModalClose = () => {
    setTotalFatura('');
    setSelectedTransactions(new Set());
    setDeletedTransactions(new Set());
    setActiveTab('simple');
    handleClose();
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      setIsDeleting(true);
      await axiosInstance.delete(Endpoints.debt.deleteInstallment(transactionId));
      setDeletedTransactions(prev => new Set([...prev, transactionId]));
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      alert('Erro ao deletar a transação. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Renderizar transação duplicada
  const renderDuplicateGroup = (group, index) => {
    const filteredGroup = group.filter(t => !deletedTransactions.has(t[idKey]));
    
    if (filteredGroup.length === 0) {
      return null;
    }
    
    return (
      <Card key={`duplicate-${index}`} className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold">
              {filteredGroup.length} transações com mesmo valor e data
            </span>
            <Badge bg="danger">{formatCurrency(filteredGroup[0]?.[valueKey] || 0)}</Badge>
          </div>
          <small className="text-muted">
            Data: {formatDate(filteredGroup[0]?.[dateKey])}
          </small>
          <Table size="sm" className="mt-3 mb-0">
            <thead>
              <tr>
                <th>Descrição</th>
                <th className="text-end">Valor</th>
                <th className="text-center" style={{ width: '50px' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroup.map((transaction, idx) => (
                <tr key={`${transaction[idKey]}-${idx}`}>
                  <td>{transaction?.[nameKey] || 'Sem nome'}</td>
                  <td className="text-end">{formatCurrency(transaction[valueKey])}</td>
                  <td className="text-center">
                    <i
                      className="fas fa-trash"
                      onClick={() => handleDeleteTransaction(transaction[idKey])}
                      style={{
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        color: isDeleting ? '#ccc' : '#dc3545',
                        fontSize: '1rem',
                      }}
                      title="Deletar esta transação"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      size="lg"
      centered
      className="invoice-reconciliation-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-receipt me-2"></i>
          Conferência de Fatura
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Campo de entrada para totalFatura */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Total da Fatura do Banco</Form.Label>
            <Form.Control
              type="number"
              placeholder="0.00"
              value={totalFatura}
              onChange={handleTotalFaturaChange}
              step="0.01"
              min="0"
              className="form-control-lg"
            />
            <Form.Text className="text-muted">
              Digite o valor total informado no extrato do banco
            </Form.Text>
          </Form.Group>

          {/* Resumo de valores */}
          {totalFatura && (
            <Row className="mb-4">
              <Col md={6}>
                <Card className="text-center summary-card">
                  <Card.Body>
                    <div className="summary-label">Total Lançado</div>
                    <div className="summary-value">
                      {formatCurrency(totalToUse)}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="text-center summary-card">
                  <Card.Body>
                    <div className="summary-label">Total da Fatura</div>
                    <div className="summary-value">
                      {formatCurrency(totalFatura)}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Mensagem de diferença */}
          {totalFatura && (
            <>
              <Alert variant={statusMessage.type} className="mb-4">
                <strong>Diferença: {formatCurrency(Math.abs(difference))}</strong>
                <br />
                {statusMessage.message}
              </Alert>
            </>
          )}

          {/* Abas de visualização */}
          {totalFatura && (
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link
                  active={activeTab === 'simple'}
                  onClick={() => setActiveTab('simple')}
                >
                  <i className="fas fa-list me-2"></i>
                  Resumo
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === 'detailed'}
                  onClick={() => setActiveTab('detailed')}
                >
                  <i className="fas fa-table me-2"></i>
                  Detalhado
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === 'checklist'}
                  onClick={() => setActiveTab('checklist')}
                >
                  <i className="fas fa-check-square me-2"></i>
                  Checklist
                  {selectedTransactions.size > 0 && (
                    <Badge bg="primary" className="ms-2">
                      {selectedTransactions.size}
                    </Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
              {duplicates.length > 0 && (
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === 'duplicates'}
                    onClick={() => setActiveTab('duplicates')}
                  >
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Duplicados
                    <Badge bg="danger" className="ms-2">
                      {duplicates.length}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          )}

          {/* Conteúdo das abas */}
          {activeTab === 'simple' && totalFatura && (
            <div className="tab-content">
              <Card className="mb-3">
                <Card.Body>
                  <Row className="mb-3">
                    <Col>
                      <small className="text-muted d-block">Transações</small>
                      <div className="display-text">
                        {transactions.length}
                      </div>
                    </Col>
                    <Col>
                      <small className="text-muted d-block">
                        Total Lançado
                      </small>
                      <div className="display-text">
                        {formatCurrency(totalToUse)}
                      </div>
                    </Col>
                    <Col>
                      <small className="text-muted d-block">
                        Total Fatura
                      </small>
                      <div className="display-text">
                        {formatCurrency(totalFatura)}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Alert variant={statusMessage.type} className="mb-0">
                {statusMessage.message}
              </Alert>
            </div>
          )}

          {activeTab === 'detailed' && totalFatura && (
            <div className="tab-content">
              <div className="table-responsive">
                <Table striped hover size="sm">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th className="text-end">Valor</th>
                      <th className="text-center">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr key={transaction[idKey]}>
                          <td>{transaction?.[nameKey] || 'Sem nome'}</td>
                          <td className="text-end">
                            {formatCurrency(transaction[valueKey])}
                          </td>
                          <td className="text-center">
                            {formatDate(transaction[dateKey])}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          Nenhuma transação encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="fw-bold border-top-2">
                      <td>Total</td>
                      <td className="text-end">
                        {formatCurrency(totalToUse)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && totalFatura && (
            <div className="tab-content">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                  type="checkbox"
                  label={
                    <strong>
                      {selectedTransactions.size === transactions.length &&
                      transactions.length > 0
                        ? 'Desselecionar Todos'
                        : 'Selecionar Todos'}
                    </strong>
                  }
                  checked={
                    selectedTransactions.size === transactions.length &&
                    transactions.length > 0
                  }
                  onChange={handleSelectAll}
                />
                <div>
                  <Badge bg="info" className="me-2">
                    {selectedTransactions.size}/{transactions.length}
                  </Badge>
                </div>
              </div>

              <div className="checklist-container">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div
                      key={transaction[idKey]}
                      className="checklist-item mb-2"
                    >
                      <Form.Check
                        type="checkbox"
                        id={`check-${transaction[idKey]}`}
                        label={
                          <div className="d-flex justify-content-between w-100 ms-2">
                            <span>{transaction?.[nameKey] || 'Sem nome'}</span>
                            <strong>
                              {formatCurrency(transaction[valueKey])}
                            </strong>
                          </div>
                        }
                        checked={selectedTransactions.has(
                          transaction[idKey]
                        )}
                        onChange={() =>
                          handleSelectTransaction(transaction[idKey])
                        }
                        className="checklist-label"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted">
                    Nenhuma transação encontrada
                  </div>
                )}
              </div>

              <hr className="my-4" />

              {/* Resumo do Checklist */}
              <Row className="mb-0">
                <Col md={6}>
                  <Card className="text-center">
                    <Card.Body>
                      <small className="text-muted d-block">
                        Total Selecionado
                      </small>
                      <div className="display-text text-primary">
                        {formatCurrency(selectedTotal)}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card
                    className="text-center"
                  >
                    <Card.Body>
                      <small className="text-muted d-block">Restante</small>
                      <div
                        className={`display-text ${
                          remaining === 0
                            ? 'text-success'
                            : remaining > 0
                            ? 'text-warning'
                            : 'text-danger'
                        }`}
                      >
                        {formatCurrency(remaining)}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {activeTab === 'duplicates' && duplicates.length > 0 && (
            <div className="tab-content">
              <Alert variant="warning" className="mb-3">
                <strong>Atenção!</strong> Foram encontradas {duplicates.length}{' '}
                possíveis duplicatas. Verifique se as transações abaixo foram
                lançadas mais de uma vez.
                <br />
                <small>Clique no ícone de lixeira para deletar uma transação duplicada.</small>
              </Alert>

              {duplicates.map((group, index) => renderDuplicateGroup(group, index))}
              
              {deletedTransactions.size > 0 && (
                <Alert variant="info" className="mt-3 mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  {deletedTransactions.size} transações foram deletadas com sucesso.
                </Alert>
              )}
            </div>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          <i className="fas fa-times me-2"></i>
          Fechar
        </Button>
        {totalFatura && statusMessage.type === 'success' && (
          <Button variant="success" onClick={handleModalClose}>
            <i className="fas fa-check me-2"></i>
            Confirmar Reconciliação
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default InvoiceReconciliationModal;
