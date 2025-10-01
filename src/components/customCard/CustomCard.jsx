import React from "react";
import DashModal from "../../pages/dashboard/DashModal";
import "./CustomCard.css"


const CustomCard = (props) => {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div>
      <div class="card" id="customCard" onClick={() => setModalShow(true)}>
        <div class="card-content">
          <div class="card-body cleartfix">
            <div class="media align-items-stretch">
              <div class="align-self-center">
                <i class={props.icon} style={{color: "#1a4173"}}></i>
              </div>
              <div class="media-body" id="tittle">
                <span id="fontColorsTitle">{props.title}</span>
                <h2 class="mr-2" id="fontColors">R$ {props.children}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(props.data !== undefined)?
      <DashModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={props.data?.items}
        head={props.title}
      />:""}
    </div>
  );
};

export default CustomCard;