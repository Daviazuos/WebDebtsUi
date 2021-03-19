import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";

export default class PersonList extends React.Component {
  state = {
    persons: []
  }

  componentDidMount() {
    axios.get(`https://localhost:5001/Debts/FilterDebt`)
      .then(res => {
        const persons = res.data;
        this.setState({ persons }); 
      })
  }

  render() {

    const lis =this.state.persons.map(item => {
      return <tr><td>{item.name}</td> <td>{item.value}</td> <td>{item.debtType}</td></tr>
    })

    return (
      <>
        <Card>
          <Card.Header>Total Mês</Card.Header>
          <Card.Body className='cardAnalitic'>
            R$ 15000,00
          </Card.Body>
        </Card>  
    </>
    )
  }
}