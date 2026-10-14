import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
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
      <div className="billCardHeader">
        <span className="billCardIcon"><i className="fas fa-calendar-alt" aria-hidden="true"></i></span>
        <div>
          <h2 className="billCardTitle">Próximas contas</h2>
          <p>Contas a vencer e vencidas</p>
        </div>
      </div>

      <div className="billCardList">
        {bills.length === 0 ? (
          <div className="billCardEmpty">Nenhuma conta próxima.</div>
        ) : bills.map(bill => (
          <div key={bill.id} className={`billCardItem${bill.isOverdue ? " isOverdue" : ""}`}>
            <div className="billCardDate">
              <small>{bill.date.split(" ")[0]}</small>
              <span>{bill.date.split(" ")[1]}</span>
            </div>

            <div className="billCardDetails">
              <div className="billCardName">
                {bill.logo && <img src={bill.logo} alt="" />}
                <span>{bill.title}</span>
              </div>
              <div className="billCardSubtitle">{bill.subtitle}</div>
              <div className="billCardLastCharge">{bill.lastCharge}</div>
            </div>

            <div className="billCardAmount">
              R$ {decimalAdjust(bill.price)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default UpcomingBill;
