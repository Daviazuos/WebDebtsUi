import React from "react";
import { Button } from "react-bootstrap";

import Page from "./components/page/Page";
import Jumbotron from "./components/jumbotron/Jumbotron";
import MyVerticallyCenteredModal from "./components/modal/modalDebts";
import Table from "./components/table/table";

function SetModal(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        {props.modalName}
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        head="Adicionar débitos"
      />
    </>
  );
}

export default () => {
  return (
    <div className="app">
      <Jumbotron></Jumbotron>
      <Page colorBorder="blue" title="Débitos">
        {<Table></Table>} 
        {<SetModal modalName="Adicionar Débitos"></SetModal>}{" "}
      </Page>
      <Page colorBorder="blue" title="Cartões">
        {<Table></Table>} 
        {<SetModal modalName="Adicionar Cartões"></SetModal>}{" "}
        {<SetModal modalName="Adicionar Valores ao cartão"></SetModal>}
      </Page>
    </div>
  );
};
