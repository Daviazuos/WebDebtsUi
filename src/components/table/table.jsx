import React from "react";
import { Table }  from "react-bootstrap";

export default () => {
  return (
  <>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Valor</th>
          <th>Tipo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Aluguel</td>
          <td>R$ 1079.00</td>
          <td>Fixo</td>
        </tr>
      </tbody>
    </Table>
  </>
  )
};


//   "name": "string",
//   "value": 0,
//   "numberOfInstallments": 0,
//   "debtType": "Simple",
//   "debtInstallmentType": "Installment",
//   "installments": [
//     {
//       "date": "2021-02-12T20:22:48.995Z",
//       "paymentDate": "2021-02-12T20:22:48.995Z",
//       "installmentNumber": 0,
//       "value": 0,
//       "status": "Paid"
//     }
//   ]