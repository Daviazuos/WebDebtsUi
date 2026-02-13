import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import { Card } from "react-bootstrap";
import "./CardCommingBills.css"

function UpcomingBill() {
  const [bills, setBills] = React.useState([]);
  
  useEffect(() => {
    axiosInstance.get(Endpoints.debt.getUpcomingDebts("10", "5"))
      .then(res => {
        setBills(res.data)
      })
  }, [])    

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="billCardTitle">Próximas contas</h6>
      </div>

      {/* Lista com rolagem vertical dentro do card */}
      <div
        style={{
          maxHeight: 300, // ajuste a altura conforme necessário
          overflowY: "auto",
          paddingRight: 6, // evita que o conteúdo fique colado no scrollbar
        }}
      >
        {bills.map((bill, index) => (
          <div
            key={bill.id}
            className={`d-flex justify-content-between align-items-center p-3 rounded-3 ${
              index !== bills.length - 1 ? "mb-2" : ""
            }`}
            style={{
              backgroundColor: bill.isOverdue ? "#facbcbff" : "#f9f9f9",
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="text-center rounded-3 bg-light"
                style={{
                  width: 50,
                  height: 50,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <small className="fw-semibold text-secondary">
                  {bill.date.split(" ")[0]}
                </small>
                <span className="fw-bold fs-5">{bill.date.split(" ")[1]}</span>
              </div>

              <div>
                <div className="d-flex align-items-center gap-2">
                  {bill.logo && (
                    <img
                      src={bill.logo}
                      alt={bill.title}
                      style={{ width: 18, height: 18 }}
                    />
                  )}
                  <span className="fw-semibold">{bill.title}</span>
                </div>
                <div className="text-secondary small">{bill.subtitle}</div>
                <div className="text-muted small">{bill.lastCharge}</div>
              </div>
            </div>

            <div>
              <span className="fw-bold bg-white border rounded-3 px-3 py-1">
                R$ {decimalAdjust(bill.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default UpcomingBill;
