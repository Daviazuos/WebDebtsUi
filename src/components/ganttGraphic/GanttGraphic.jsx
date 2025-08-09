import { useEffect, useState } from "react";
import { Gantt } from "wx-react-gantt";
import { WillowDark } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { Card } from "react-bootstrap";
import { addMonthsToDateReturnDate } from "../../utils/dateFormater";


export default function GanttGraphic() {
    const [graphic, setGraphic] = useState(null);
    const [month, setMonth] = useState(localStorage.getItem("month"));
    const [year, setYear] = useState(localStorage.getItem("year"));
    const [link, setLink] = useState([]);
    const [data, setData] = useState([]);
    const [scales, setScales] = useState();


    useEffect(() => {
        const dataDebts = []

        axiosInstance.get(Endpoints.debt.filterWDate(1, 20, '', '', 'installment', '', null, '2025-01-01', '2025-07-01'))
            .then(res => {
                const installments = res.data.items;

                for (const value in installments) {
                    const startDate = new Date(installments[value].date);
                    const endDate = addMonthsToDateReturnDate(installments[value].date, installments[value].numberOfInstallments);

                    let rowData = {
                        id: installments[value].id,
                        text: installments[value].name,
                        start: startDate,
                        end: endDate,
                        duration: installments[value].numberOfInstallments,
                        progress: (installments[value].paidInstallment / installments[value].numberOfInstallments * 100),
                        type: 'task',
                        lazy: false
                    };


                    dataDebts.push(rowData)
                }

                setData(dataDebts)
                setScales([
                    { unit: "month", step: 1, format: "MMMM yyy" },
                    
                ])
            })
    }, [month, year])
    return (

        <Card>
            <WillowDark>
                {scales != undefined ? <Gantt tasks={data} scales={scales} />: <div></div>}
            </WillowDark>
        </Card>
    )
}


