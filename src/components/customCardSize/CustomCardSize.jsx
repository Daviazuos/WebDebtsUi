import React from "react";
import DashModal from "../../pages/dashboard/DashModal";
import "./CustomCardSize.css"


// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const [modalShow, setModalShow] = React.useState(false);
  const iconTone = props.icon?.includes("red")
    ? "negative"
    : props.icon?.includes("success")
      ? "positive"
      : "accent";
  const text = props.text ? <span className="summaryCardText">{props.text}</span> : null;

  return (
    <div className={props.className || ""}>
      <button
        type="button"
        className="summaryCard"
        style={{ "--summary-card-height": props.height || "78px" }}
        onClick={() => setModalShow(true)}
      >
        <span className={`summaryCardIcon summaryCardIcon--${iconTone}`} aria-hidden="true">
          <i className={props.icon}></i>
        </span>
        <span className="summaryCardContent">
          <span className="summaryCardTitle">{props.title}</span>
          <strong className="summaryCardValue">R$ {props.children}</strong>
          {text && <span className="summaryCardDescription">{text}</span>}
        </span>
      </button>
      {props.table !== undefined && (
        <DashModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          table={props.table}
          head={props.title}
        />
      )}
    </div>
  );
};
