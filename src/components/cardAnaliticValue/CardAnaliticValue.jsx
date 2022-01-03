import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Button } from "react-bootstrap";
import "./CardAnaliticValue.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";

function SetStatus(id, status){
  axiosInstance.put(Endpoints.debt.put(id, status))
  refreshPage() 
  return(
    <>
      Status Trocado!
    </>
  )

}


function refreshPage(){ 
  window.location.reload(); 
}

export default class PersonList extends React.Component {
  state = {
    installments: [],
    status:""
  }

  componentDidMount() {
    const today = new Date();
    const mm = String(today.getMonth() + 2).padStart(2, '0')
    const yyyy = today.getFullYear()
    axiosInstance.get(Endpoints.debt.filterInstallments('', mm, yyyy, '', ''))
      .then(res => {
        const installments = res.data;
        this.setState({ installments });
      })
  }

  render() {

    const lis = this.state.installments.map(item => {
      return (
        <tr>
          <td>{item.value}</td>
          <td>{item.date}</td>
          <td>{item.status}</td>
          <td className="buttonPaid">
            <Button className="btn btn-success" onClick={() => SetStatus(item.id, "Paid")}>
              Pago <i className="fas fa-check"></i>
            </Button>
            <Button className="btn btn-danger" onClick={() => SetStatus(item.id, "NotPaid")}>
              A pagar <i className="fas fa-times"></i>
            </Button>
          </td>
          <td>{item.paymentDate}</td>
        </tr>
      )
    })

    const valueTotal = this.state.installments.reduce(function(prev, cur) {
      return prev + cur.value;
    }, 0);

    return (
      <>
        <Card className=" cardAnalitic">
            <Table striped bordered hover variant="white" className="table">
              <thead>
                <tr>
                  <th>Valor</th>
                  <th>Data de vencimento</th>
                  <th>Status</th>
                  <th>Ação</th>
                  <th>Data de pagamento</th>
                </tr>
              </thead>
              <tbody>
                {lis}
              </tbody>
            </Table>
        </Card>
      </>
    )
  }
}