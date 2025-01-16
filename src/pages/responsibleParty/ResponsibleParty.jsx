import React, { useEffect } from "react";
import 'react-circular-progressbar/dist/styles.css';

import { Button, Card, Table } from "react-bootstrap";
import { decimalAdjust } from "../../utils/valuesFormater";
import "./ResponsibleParty.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";


export default function ResponsibleParty() {
  const [data, setData] = React.useState(undefined);
  const [year, setYear] = React.useState(localStorage.getItem("year"))
  const [month, setMonth] = React.useState(localStorage.getItem("month"))

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.getDebtresponsibleParties(month, year, undefined))
      .then(res => {
        setData(res.data.map(item => {
          return (
            <tr>
              <td className="td1">{item.name}</td>
              <td className="td1">R$ {decimalAdjust(item.debtValue)}</td>
              <td className="td1">R$ {decimalAdjust(item.walletValue)}</td>
            </tr>
          )
        }));
      })
  }, [])

  return (
    <div>
      <span id="PagesTitle">Pessoas</span>
      <Card className='cardTable'>
        <Table responsive hover variant="white" className="tableFinancial" size="sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor a pagar</th>
              <th>Valor a receber</th>
            </tr>
          </thead>
          <tbody>
            {data}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}
