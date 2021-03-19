import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import BootstrapTreeTable from 'bootstrap-react-treetable';
import axios from "axios";
import "./Table.css";

export default class DebtList extends React.Component {
  state = {
    debts: []
  }

  componentDidMount() {

    const [finishDate, startDate] = ["2021-03-01", "2021-04-01"]

    axios.get(`https://localhost:5001/Debts/FilterDebt?DebtInstallmentType=${this.props.type}&StartDate=${finishDate}&FInishDate=${startDate}`)
      .then(res => {
        const debts = res.data;
        this.setState({ debts });
      })
  }

  render() {

    const lis = this.state.debts.map(item => {
      console.log(item)
      return ( 
            <tr key={item.id}>
              <td>{item.name}</td> 
              <td>R$ {item.value}</td> 
              <td>{item.debtInstallmentType}</td>  
              <td className='tdd'><Button className="btn btn-dark"><i className="fas fa-edit"></i></Button> <Button className="btn btn-dark"><i className="fa fa-trash" aria-hidden="true"></i></Button></td>
            </tr>)
    })

    const data = [
      {
          data: {
              name: "name0",
              dataType: "string0",
              example: "ex0",
              description: "desc0"
          },
          children: [
              {
                  data: {
                      name: "name0-0",
                      dataType: "string0-0",
                      example: "ex0-0",
                      description: "desc0-0"
                  },
                  children: []
              }, {
                  data: {
                      name: "name0-1",
                      dataType: "string0-1",
                      example: "ex0-1",
                      description: "desc0-1"
                  },
                  children: []
              }, {
                  data: {
                      name: "name0-2",
                      dataType: "string0-2",
                      example: "ex0-2",
                      description: "desc0-2"
                  },
                  children: [
                      {
                          data: {
                              name: "name0-2-1",
                              dataType: "string0-2-1",
                              example: "ex0-2-1",
                              description: "desc0-2-1"
                          },
                          children: []
                      }
                  ]
              }
          ]
      },
      {
          data: {
              name: "name1",
              dataType: "string1",
              example: "ex1",
              description: "desc1 &euro; &euro;"
          },
          children: []
      },
      {
          data: {
              name: "name2",
              dataType: "string2",
              example: "ex2",
              description: "desc2 &euro; &euro; &euro; &euro;"
          },
          children: []
      }
  ]

    const treeColumns = [
      {
        "dataField": "name",
        "heading": "Nome",
        "filterable": true
      },
      {
        "dataField": "population",
        "heading": "Valor",
        "sortOrder": "desc"
      },
      {
        "dataField": "bill",
        "heading": "Tipo"
      },
      {
        "dataField": "fred",
        "heading": "Ação"
      }
    ]

    const treeControls = {
      "visibleRows": 1,
      "allowSorting": false,
      "showPagination": false,
      "initialRowsPerPage": 10,
      "allowFiltering": false,
      "showExpandCollapseButton": false
    }

    return (
      <>
        {/* <Table striped bordered hover variant="white">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {lis}
          </tbody>
        </Table> */}
        <BootstrapTreeTable columns={treeColumns} tableData={data} control={treeControls}/>
      </>
    )
  }
}
