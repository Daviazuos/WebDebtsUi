import React, { useEffect, useState } from "react";
import { Button, Card, Container, Table, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { addLeadingZeros, decimalAdjust } from "../../utils/valuesFormater";

import "./CardLayout.css";
import { debtInstallmentTransform, walletStatusTransform } from "../../utils/enumFormatter";
import CustomCard from "../customCard/CustomCard";
import { monthByNumber } from "../../utils/dateFormater";
import { refreshPage } from "../../utils/utils";
import { useGlobalContext } from "../../services/local-storage-event";
import CustomCardSize from "../customCardSize/CustomCardSize";


export default function CardLayout() {
    const [sumAllValue, setSumAllValue] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [month, setMonth] = useState(localStorage.getItem("month"))
    const [year, setYear] = useState(localStorage.getItem("year"))
    const { sharedValue } = useGlobalContext();
    const [totalFinishing, setTotalFinishing] = useState(0.00);
    const [list_instalments, setListInstalments] = useState([]);

    useEffect(() => {
        axiosInstance.get(Endpoints.wallet.getEnable(month, year))
            .then(res => {
                setWallet(res.data);
            })

    }, [month, sharedValue])

    useEffect(() => {
        axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, '', '', '', '', null))
            .then(res => {
                setSumAllValue(res.data)
            })

    }, [month, sharedValue])

    useEffect(() => {
        let lastDayFromMonth = new Date(year, month, 0).getUTCDate();
        axiosInstance.get(Endpoints.debt.filterWDate(1, 9999, '', '', 'Installment', '', false, `${year}-${month}-01T00:00:00`, `${year}-${month}-${lastDayFromMonth}T23:59:59`))
          .then(res => {
            const lis_instalments = [];
            let totalFinishingSum = 0.00;
            const items = res.data.items;
            items.forEach(debtItem => {
              (debtItem.installments || []).forEach(inst => {
                if (debtItem.numberOfInstallments === inst.installmentNumber) {
                  lis_instalments.push(
                    <tr key={debtItem.id}>
                      <td>{debtItem.name}</td>
                      <td>R$ {decimalAdjust(inst.value)}</td>
                      <td>{inst.installmentNumber}/{debtItem.numberOfInstallments}</td>
                    </tr>
                  );
                  totalFinishingSum += inst.value || 0;
                }
              });
            });
    
            setListInstalments(lis_instalments);
            setTotalFinishing(totalFinishingSum);
          })
      }, [month])

    const valueTotal = wallet.filter(({ walletStatus }) => walletStatus !== 'Pending').reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);


    const paidValue = sumAllValue.items?.filter(({ status }) => status === 'Paid').reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);

    const provisionedValue = valueTotal - sumAllValue.items?.reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0).toFixed(2);

    localStorage.setItem("provisionedValue", provisionedValue);

    let balanceColor = provisionedValue < 0 ? "fas fa-balance-scale red custom-icon" : "fas fa-balance-scale success custom-icon"


    const sumAll = sumAllValue.items?.reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);

    const selectNewMonth = (direction) => {
        if (direction === 'left') {
            if (parseInt(month) === 1) {
                localStorage.setItem("year", parseInt(year) - 1);
                localStorage.setItem("month", 12);
            } else {
                localStorage.setItem("month", parseInt(month) - 1);
            }
        } else {
            if (parseInt(month) === 12) {
                localStorage.setItem("year", parseInt(year) + 1);
                localStorage.setItem("month", 1)
            } else {
                localStorage.setItem("month", parseInt(month) + 1);

            }
        }
        refreshPage()

    }

    let cardSize = "251px"
    let cardHeight = "70px"

    const tableFinishingDebts = (
        <Table striped borderless hover size="sm" responsive>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Valor</th>
                    <th>Parcela</th>
                </tr>
            </thead>
            <tbody>
                {list_instalments}
            </tbody>
        </Table>)


    return (
        <div className="containerWallet">
            <div id="linha">
                <i onClick={() => selectNewMonth("left")} style={{ cursor: 'pointer', color: '#B3B8D4' }} class={"fas fa-chevron-left"}></i>
                <div style={{ minWidth: '250px', display: 'flex', justifyContent: 'center' }}>{monthByNumber(month)} - {year}</div>
                <i style={{ cursor: 'pointer', color: '#B3B8D4' }} onClick={() => selectNewMonth("right")} class={"fas fa-chevron-right"}></i>
            </div>
            <div className="walletCards">
                <CustomCardSize
                    title="Entradas"
                    children={decimalAdjust(valueTotal)}
                    icon="fas fa-hand-holding-usd success custom-icon"
                    size={cardSize}
                    height={cardHeight}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Saídas"
                    children={decimalAdjust(sumAll)}
                    icon="fas fa-hand-holding-usd red custom-icon"
                    size={cardSize}
                    height={cardHeight}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Saldo Atual"
                    children={decimalAdjust(provisionedValue)}
                    icon={balanceColor}
                    size={cardSize}
                    height={cardHeight}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Valor pago"
                    children={decimalAdjust(paidValue)}
                    icon="fas fa-check success custom-icon"
                    size={cardSize}
                    height={cardHeight}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Valor a pagar"
                    children={decimalAdjust(sumAll - paidValue)}
                    icon="fas fa-times red custom-icon"
                    size={cardSize}
                    height={cardHeight}
                    className="toPay"
                >
                </CustomCardSize>
                <CustomCardSize
                    title={`Parcelamentos acabando`}
                    children={decimalAdjust(totalFinishing)}
                    icon="fas fa-calendar-check success custom-icon"
                    text=""
                    size={cardSize}
                    height={cardHeight}
                    table={tableFinishingDebts}
                ></CustomCardSize>
            </div>
        </div>
    )
}
