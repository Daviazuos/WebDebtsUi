import React from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import "./CardGraphic.css"

export default class CardGraphic extends React.Component {
    state = {
        installments: [],
    }

    state = {
        dataLine: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "Dívidas",
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: "rgba(225, 204,230, .3)",
                    borderColor: "rgb(205, 130, 158)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgb(205, 130,1 58)",
                    pointBackgroundColor: "rgb(255, 255, 255)",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgb(0, 0, 0)",
                    pointHoverBorderColor: "rgba(220, 220, 220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [6500.05, 5900.50, 8000.55, 7120.52, 5655.55, 5500.55, 4000.01]
                },
                {
                    label: "Recebidos",
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: "rgba(184, 185, 210, .3)",
                    borderColor: "rgb(35, 26, 136)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgb(35, 26, 136)",
                    pointBackgroundColor: "rgb(255, 255, 255)",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgb(0, 0, 0)",
                    pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [7500, 7500, 7500, 7500, 7500, 7500, 7500]
                }
            ]
        }
    };

    render() {
        return (
            <Card className='graphicCard'>
                <h3 className="graphicName">Movimentação por mês</h3>
                <Line className="graphic" data={this.state.dataLine} width={100} height={30} options={{ responsive: true }} />
            </Card>
        );
    }
}