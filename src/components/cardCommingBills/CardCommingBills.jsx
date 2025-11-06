import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function UpcomingBill() {
  const bills = [
    {
      id: 1,
      date: "May 15",
      title: "Figma",
      subtitle: "Figma - Monthly",
      lastCharge: "Last Charge - 14 May, 2022",
      price: "$150",
      logo: null,
    },
    {
      id: 2,
      date: "Jun 16",
      title: "Adobe",
      subtitle: "Adobe - Yearly",
      lastCharge: "Last Charge - 17 Jun, 2023",
      price: "$559",
      logo: null,
    },
    {
      id: 3,
      date: "Jul 17",
      title: "Sketch",
      subtitle: "Sketch - Monthly",
      lastCharge: "Last Charge - 14 Jul, 2023",
      price: "$99",
      logo: null,
    },
  ];

  return (
    <div className="p-4 bg-white rounded-4 shadow-sm" style={{ maxWidth: 400 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold text-secondary mb-0">Upcoming Bill</h6>
        <a href="#" className="text-decoration-none small fw-semibold">
          View All
        </a>
      </div>

      {bills.map((bill, index) => (
        <div
          key={bill.id}
          className={`d-flex justify-content-between align-items-center p-3 rounded-3 ${
            index !== bills.length - 1 ? "mb-2" : ""
          }`}
          style={{
            backgroundColor: "#f9f9f9",
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
              {bill.price}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UpcomingBill;
