import React from "react";

import { Form, Button } from 'react-bootstrap';

export default (props) => {
  return (
    <>
      <Form>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control placeholder="Entre com o nome" />
        </Form.Group>

        <Form.Group>
          <Form.Label>Valor</Form.Label>
          <Form.Control type="number" placeholder="Entre com o valor total" />
        </Form.Group>
        
        <Form.Group>
          <Form.Label>Data</Form.Label>
          <Form.Control type="date" placeholder="Entre com o data" />
        </Form.Group>
        
        <Form.Group>
          <Form.Label>Quantidade de Parcelas</Form.Label>
          <Form.Control type="number" placeholder="Entre com o quantidade de parcelas" />
        </Form.Group>
        
        <Form.Group>
          <Form.Label>Tipo de débito</Form.Label>
          <Form.Control type="number" placeholder="Entre com o tipo" />
        </Form.Group>

      </Form>
    </>
  );
};

// {
//     "name": "string",
//     "value": 0,
//     "date": "2021-02-12T19:29:10.025Z",
//     "numberOfInstallments": 0,
//     "debtInstallmentType": "Installment"
//   }