import React from "react";
import { Button } from "react-bootstrap";
import { decimalAdjust } from "../../utils/valuesFormater";
import { statusTransform } from "../../utils/enumFormatter";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import "./ResponsiblePartyDetailsModal.css";

function ResponsiblePartyDetailsModal({ show, onHide, responsibleParty, refresh }) {

  if (!show || !responsibleParty) return null;

  const totalToPay =
    responsibleParty.debtsAppModel?.reduce((acc, debt) => {
      return acc + (debt.installments?.[0]?.value || 0);
    }, 0) || 0;

  const totalToReceive =
    responsibleParty.walletAppModels?.reduce((acc, wallet) => {
      return acc + (wallet.value || 0);
    }, 0) || 0;

  const balance = totalToReceive - totalToPay;

  const handleMarkAllAsPaid = async () => {
    const today = new Date().toISOString().split("T")[0];

    for (const debt of responsibleParty.debtsAppModel || []) {
      for (const installment of debt.installments || []) {
        if (installment.status !== "Paid") {
          await axiosInstance.put(
            Endpoints.debt.put(installment.id, null, "Paid", today, null)
          );
        }
      }
    }

    if (refresh) refresh();
    onHide();
  };

  return (
    <div className="rp-overlay">
      <div className="rp-drawer">

        {/* HEADER */}
        <div className="rp-header">
          <div className="rp-avatar">
            {responsibleParty.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h4 className="mb-0">{responsibleParty.name}</h4>
            <span className={balance >= 0 ? "rp-balance-positive" : "rp-balance-negative"}>
              {balance >= 0 ? "+" : "-"} R$ {decimalAdjust(Math.abs(balance))}
            </span>
          </div>

          <button className="rp-close" onClick={onHide}>×</button>
        </div>

        {/* RESUMO */}
        <div className="rp-summary">
          <div className="rp-summary-card">
            <span>A pagar</span>
            <strong>R$ {decimalAdjust(totalToPay)}</strong>
          </div>

          <div className="rp-summary-card">
            <span>A receber</span>
            <strong>R$ {decimalAdjust(totalToReceive)}</strong>
          </div>
        </div>

        {/* DETALHAMENTO */}
        <div className="rp-section">
          <h6>Valores a Pagar</h6>

          {responsibleParty.debtsAppModel?.map(debt => (
            <div key={debt.id} className="rp-item">
              <div>
                <span>{debt.name}</span>
                <small>{statusTransform(debt.installments?.[0]?.status)}</small>
              </div>
              <strong>
                R$ {decimalAdjust(debt.installments?.[0]?.value)}
              </strong>
            </div>
          ))}
        </div>

        <div className="rp-section">
          <h6>Valores a Receber</h6>

          {responsibleParty.walletAppModels?.map(wallet => (
            <div key={wallet.id} className="rp-item">
              <span>{wallet.name}</span>
              <strong>
                R$ {decimalAdjust(wallet.value)}
              </strong>
            </div>
          ))}
        </div>

        {/* BOTÃO */}
        {responsibleParty?.debtsAppModel?.some(debt =>
          debt.installments?.some(inst => inst.status !== "Paid")
        ) && (
          <Button
            className="rp-payall-btn"
            onClick={handleMarkAllAsPaid}
          >
            Marcar todas como pagas
          </Button>
        )}

      </div>
    </div>
  );
}

export default ResponsiblePartyDetailsModal;
