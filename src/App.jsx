import React from "react";
import { Button } from "react-bootstrap";

import Page from "./components/page/Page";
import Jumbotron from "./components/jumbotron/Jumbotron";
import ModalAddDebts from "./components/modal/modalDebts";
import Table from "./components/table/Table"
import Card from "./components/card/Card"
import "./App.css";


function SetModal(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button className='addButton' variant='dark' onClick={() => setModalShow(true)}>
       <i className="fas fa-plus"></i> {props.modalName}
      </Button>

      <ModalAddDebts
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
      <Page colorBorder="blue" title="Analitico">
        <Card></Card>    
      {<SetModal modalName="Add Débitos"></SetModal>}{" "}
      </Page>
      <Page colorBorder="blue" title="Dívidas Fixas">
        {<Table type='Fixed'></Table>} 
      </Page>
      <Page colorBorder="blue" title="Dívidas Simples">
        {<Table type='Simple'></Table>} 
      </Page>
      <Page colorBorder="blue" title="Dívidas Parceladas">
        {<Table type='Installment'></Table>} 
      </Page>
    </div>
  );
};
