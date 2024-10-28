import React from "react";
import DashModal from "../../pages/dashboard/DashModal";
import "./CustomCardSize.css"


// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const [modalShow, setModalShow] = React.useState(false);

  let text = props.text ? <span id="fontColorsTextSize">{props.text}</span> : ''

  return (
    <div>
      <div class="card" id="customCardSize" style={{width: props.size, height: '100px'}} onClick={() => setModalShow(true)}>
        <div class="card-content">
          <div class="card-body cleartfix">
            <div class="media align-items-stretch">
              <div class="align-self-center">
                <i class={props.icon} style={{color: "#1a4173"}}></i>
              </div>
              <div class="media-body" id="tittleSize">
                <span id="fontColorsTitleSize">{props.title}</span>
                <h2 class="mr-2" id="fontColorsSize">R$ {props.children}</h2>
                {text}
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
