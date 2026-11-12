import React, { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { dateAdjust } from "../../utils/dateFormater";
import { statusTransform } from "../../utils/enumFormatter";
import { decimalAdjust } from "../../utils/valuesFormater";

function getDateInputValue(date) {
  return date ? String(date).split("T")[0] : "";
}

export default function FinancialInstallmentModal({ installment, onUpdated }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function openModal() {
    setForm({
      date: getDateInputValue(installment.installmentDate),
      installmentNumber: installment.installmentNumber ?? 0,
      value: installment.value ?? 0,
    });
    setError("");
    setSaved(false);
    setShow(true);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
    setSaved(false);
  }

  async function saveInstallment(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      await axiosInstance.put(Endpoints.debt.putInstallment(installment.id), {
        date: form.date,
        paymentDate: installment.paymentDate || null,
        installmentNumber: Number(form.installmentNumber),
        value: Number(form.value),
        status: installment.status,
      });
      setSaved(true);
      onUpdated();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="financialInstallmentDetailsTrigger"
        aria-label={`Ver detalhes da parcela de ${installment.debtName}`}
        title="Ver detalhes e editar parcela"
        onClick={openModal}
      >
        <i className="fas fa-search" aria-hidden="true"></i>
      </button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        className="debtDetailsModal financialInstallmentModal"
        aria-labelledby="financial-installment-title"
      >
        <Modal.Header closeButton>
          <div className="debtDetailsHeading">
            <span className="debtDetailsIcon" aria-hidden="true">
              <i className="fas fa-search"></i>
            </span>
            <div>
              <span className="debtDetailsEyebrow">DETALHES DA PARCELA</span>
              <Modal.Title id="financial-installment-title">
                {installment.debtName || "Despesa simples"}
              </Modal.Title>
            </div>
          </div>
        </Modal.Header>

        <Form onSubmit={saveInstallment}>
          <Modal.Body className="debtDetailsBody">
            <div className="debtDetailsForm financialInstallmentForm">
              <Form.Group className="debtDetailsField">
                <Form.Label>Parcela</Form.Label>
                <Form.Control
                  type="number"
                  name="installmentNumber"
                  min="0"
                  step="1"
                  required
                  value={form?.installmentNumber ?? ""}
                  onChange={updateField}
                />
              </Form.Group>
              <Form.Group className="debtDetailsField">
                <Form.Label>Valor</Form.Label>
                <Form.Control
                  type="number"
                  name="value"
                  min="0"
                  step="0.01"
                  required
                  value={form?.value ?? ""}
                  onChange={updateField}
                />
              </Form.Group>
              <Form.Group className="debtDetailsField">
                <Form.Label>Data da parcela</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  required
                  value={form?.date ?? ""}
                  onChange={updateField}
                />
              </Form.Group>
              <Form.Group className="debtDetailsField">
                <Form.Label>Status</Form.Label>
                <Form.Control value={statusTransform(installment.status)} disabled />
              </Form.Group>
              <Form.Group className="debtDetailsField">
                <Form.Label>Categoria</Form.Label>
                <Form.Control value={installment.category || "Não informada"} disabled />
              </Form.Group>
              <Form.Group className="debtDetailsField">
                <Form.Label>Responsável</Form.Label>
                <Form.Control value={installment.responsiblePartyName || "Não informado"} disabled />
              </Form.Group>
              <Form.Group className="debtDetailsField">
                <Form.Label>Data de compra</Form.Label>
                <Form.Control value={dateAdjust(installment.date)} disabled />
              </Form.Group>
              <Form.Group className="debtDetailsField">
                <Form.Label>Data de pagamento</Form.Label>
                <Form.Control
                  value={installment.paymentDate ? dateAdjust(installment.paymentDate) : "Não pago"}
                  disabled
                />
              </Form.Group>
            </div>
            {error && <Alert variant="danger" className="financialInstallmentAlert">{error}</Alert>}
            {saved && <Alert variant="success" className="financialInstallmentAlert">Alterações salvas.</Alert>}
          </Modal.Body>

          <Modal.Footer className="financialInstallmentFooter">
            <span className="financialInstallmentTotal">
              {installment.installmentNumber > 0 && installment.numberOfInstallments > 0
                ? `Parcela ${form?.installmentNumber ?? installment.installmentNumber} de ${installment.numberOfInstallments}`
                : `Valor atual: R$ ${decimalAdjust(form?.value ?? installment.value)}`}
            </span>
            <Button variant="secondary" type="button" onClick={() => setShow(false)}>
              Fechar
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
