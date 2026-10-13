import React from "react";
import DashModal from "../../pages/dashboard/DashModal";
import "./CustomCard.css"


// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div className="dashboardTypeCardHost">
      <button type="button" className="dashboardTypeCard" onClick={() => setModalShow(true)}>
        <span className="dashboardTypeIcon" aria-hidden="true"><i className={props.icon}></i></span>
        <span className="dashboardTypeContent">
          <span className="dashboardTypeTitle">{props.title}</span>
          <strong className="dashboardTypeValue">R$ {props.children}</strong>
        </span>
      </button>
      {props.table !== undefined ?
      <DashModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        table={props.table}
        head={props.title}
      /> : null}
    </div>
  );
};
