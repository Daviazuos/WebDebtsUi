import React from "react";
import DashModal from "../../pages/dashboard/DashModal";
import "./CustomCardSize.css"
import { DollarSign } from "lucide-react";


const CustomCardSize = (props) => {
  const [modalShow, setModalShow] = React.useState(false);

  let text = props.text ? <span id="fontColorsTextSize">{props.text}</span> : ''

  return (
    // <div className={props.className}>
    //   <div class="card" id="customCardSize" style={{width: props.size, height: '100px'}} onClick={() => setModalShow(true)}>
    //     <div class="card-content">
    //       <div class="card-body cleartfix">
    //         <div class="media align-items-stretch">
    //           <div class="align-self-center">
    //             <i class={props.icon} style={{color: "#1a4173"}}></i>
    //           </div>
    //           <div class="media-body" id="tittleSize">
    //             <span id="fontColorsTitleSize">{props.title}</span>
    //             <h2 class="mr-2" id="fontColorsSize">R$ {props.children}</h2>
    //             <div id="textSize">{text}</div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   {(props.data !== undefined)?
    //   <DashModal
    //     show={modalShow}
    //     onHide={() => setModalShow(false)}
    //     data={props.data?.items}
    //     head={props.title}
    //   />:""}
    // </div>
    <div className={props.className}>
      <div className="p-4 rounded-lg bg-card/50 border" id="customCardSize" style={{ width: props.size, height: '100px' }} onClick={() => setModalShow(true)}>
        <div className="flex items-center gap-2 mb-2">
          <div class="align-self-center">
            <i class={props.icon}></i>
          </div>
          <span className="text-sm font-medium">{props.title}</span>
        </div>
        <p className="text-2xl font-bold text-info">R$ {props.children}</p>
      </div>
    </div>
  );
};

export default CustomCardSize;