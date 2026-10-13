import React, { useEffect, useState } from "react";
import { Accordion, Form, Table } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import ReactApexChart from "react-apexcharts";
import WalletModal from "./WalletModal";
import "./Wallet.css";
import WalletModalDelete from "./WalletDeleteModal";
import { debtInstallmentTransform, walletInstallmentStatusTransform } from "../../utils/enumFormatter";
import WalletModalEdit from "./WalletModalEdit";

function SetModalDelete(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <button type="button" className="walletIconButton" aria-label={`Excluir ${props.name}`} onClick={() => setModalShow(true)}>
        <i className={props.simbol} aria-hidden="true"></i>
      </button>
      <WalletModalDelete
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}


function SetModal(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <button type="button" className="walletIconButton" aria-label={`Editar ${props.name}`} onClick={() => setModalShow(true)}>
        <i className={props.simbol} aria-hidden="true"></i>
      </button>
      <WalletModalEdit
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}

function SetModalAdd(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <button type="button" className="walletAddButton" onClick={() => setModalShow(true)}>
        <i className={props.simbol} aria-hidden="true"></i> {props.modalName}
      </button>
      <WalletModal
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}

export default function Wallet() {
  const [wallets, setWallets] = useState([]);
  const currentDate = new Date();
  const [month] = useState(Number(localStorage.getItem("month")) || currentDate.getMonth() + 1);
  const [year] = useState(Number(localStorage.getItem("year")) || currentDate.getFullYear());
  const [status, setStatus] = useState(false);
  const [monthlyChart, setMonthlyChart] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);

  function EditWalletStatus(walletStatus, id) {
    const editWallet = { ReceivedStatus: walletStatus };
    axiosInstance.put(Endpoints.wallet.putInstallment(id), editWallet).then(res => {
      setStatus(currentStatus => !currentStatus);
    });
  }

  useEffect(() => {
    axiosInstance.get(Endpoints.wallet.getResponsiblePartyWallets(month, year))
      .then(res => {
        setWallets(Array.isArray(res.data) ? res.data : []);
      });
  }, [month, year, status])

  useEffect(() => {
    let isCurrent = true;
    setChartLoading(true);

    const periods = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(year, month - 1 - (5 - index), 1);
      return {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        label: date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")
      };
    });

    Promise.all(periods.map(period =>
      axiosInstance.get(Endpoints.wallet.getResponsiblePartyWallets(period.month, period.year))
    )).then(responses => {
      if (!isCurrent) return;

      const people = new Map();
      responses.forEach((response, monthIndex) => {
        (Array.isArray(response.data) ? response.data : []).forEach(person => {
          const key = person.id || person.responsiblePartyId || person.name;
          if (!people.has(key)) {
            people.set(key, { name: person.name, data: Array(6).fill(0) });
          }

          const monthValue = (person.walletAppModels || []).reduce((total, wallet) => {
            const installment = wallet.walletInstallments?.[0];
            return total + (Number(installment?.value) || 0);
          }, 0);
          people.get(key).data[monthIndex] += monthValue;
        });
      });

      const series = Array.from(people.values()).map(person => ({
        name: person.name,
        data: person.data
      }));

      setMonthlyChart({
        categories: periods.map(period => period.label),
        series
      });
    }).catch(() => {
      if (isCurrent) setMonthlyChart({ categories: periods.map(period => period.label), series: [] });
    }).finally(() => {
      if (isCurrent) setChartLoading(false);
    });

    return () => { isCurrent = false; };
  }, [month, year]);

  const walletEntries = wallets.flatMap(person =>
    (person.walletAppModels || []).map(wallet => ({ person, wallet, installment: wallet.walletInstallments?.[0] }))
  ).filter(entry => entry.installment);
  const toReceiveValue = walletEntries
    .filter(({ installment }) => !installment.receivedStatus)
    .reduce((total, { installment }) => total + (Number(installment.value) || 0), 0);
  const receivedValue = walletEntries
    .filter(({ installment }) => installment.receivedStatus)
    .reduce((total, { installment }) => total + (Number(installment.value) || 0), 0);
  const totalValue = toReceiveValue + receivedValue;

  const chartOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#5840d8", "#3b9d63", "#4d91b8", "#d38a4a", "#c35f78", "#6c78ad"],
    plotOptions: { bar: { horizontal: false, columnWidth: "52%", borderRadius: 3 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: { categories: monthlyChart?.categories || [], axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: {
      labels: {
        formatter: value => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value)
      }
    },
    tooltip: { y: { formatter: value => `R$ ${decimalAdjust(value)}` } },
    grid: { borderColor: "#edf0f3", strokeDashArray: 4 },
    legend: { position: "bottom", fontSize: "13px", markers: { radius: 4 } },
    noData: { text: "Sem entradas neste período" },
    responsive: [{ breakpoint: 600, options: { legend: { fontSize: "11px", itemMargin: { horizontal: 8 } }, plotOptions: { bar: { columnWidth: "68%" } } } }]
  };

  return (
    <main className="walletPage">
      <header className="walletPageHeader">
        <div>
          <span className="walletEyebrow">FINANÇAS / ENTRADAS</span>
          <h1>Carteira</h1>
          <p>Acompanhe os valores recebidos e previstos por pessoa.</p>
        </div>
        <SetModalAdd name="Adicionar entrada" modalName="Adicionar entrada" simbol="fas fa-plus" />
      </header>

      <section className="walletMetrics" aria-label="Resumo das entradas">
        <div className="walletMetric">
          <span className="walletMetricIcon received"><i className="fas fa-arrow-down" aria-hidden="true" /></span>
          <div><span>Recebido</span><strong>R$ {decimalAdjust(receivedValue)}</strong></div>
        </div>
        <div className="walletMetric">
          <span className="walletMetricIcon pending"><i className="fas fa-hourglass-half" aria-hidden="true" /></span>
          <div><span>A receber</span><strong>R$ {decimalAdjust(toReceiveValue)}</strong></div>
        </div>
        <div className="walletMetric walletMetricTotal">
          <span className="walletMetricIcon total"><i className="fas fa-wallet" aria-hidden="true" /></span>
          <div><span>Total do período</span><strong>R$ {decimalAdjust(totalValue)}</strong></div>
        </div>
      </section>

      <section className="walletPanel walletChartPanel">
        <div className="walletPanelHeader">
          <div>
            <span className="walletSectionIcon"><i className="fas fa-chart-column" aria-hidden="true" /></span>
            <div><h2>Entradas por pessoa</h2><p>Comparativo mensal dos últimos seis meses</p></div>
          </div>
          <span className="walletPeriodLabel">{String(month).padStart(2, "0")}/{year}</span>
        </div>
        {chartLoading ? (
          <div className="walletChartState"><i className="fas fa-spinner fa-spin" aria-hidden="true" /> Carregando gráfico...</div>
        ) : monthlyChart?.series.length ? (
          <ReactApexChart options={chartOptions} series={monthlyChart.series} type="bar" height={320} />
        ) : (
          <div className="walletChartState">Ainda não há entradas para comparar neste período.</div>
        )}
      </section>

      <section className="walletPanel walletPeoplePanel">
        <div className="walletPanelHeader">
          <div>
            <span className="walletSectionIcon"><i className="fas fa-users" aria-hidden="true" /></span>
            <div><h2>Lançamentos</h2><p>Entradas do período por pessoa</p></div>
          </div>
          <span className="walletCount">{wallets.length} {wallets.length === 1 ? "pessoa" : "pessoas"}</span>
        </div>
        {wallets.length ? (
          <Accordion className="walletAccordion">
            {wallets.map((person, index) => {
              const entries = person.walletAppModels || [];
              const pendingValue = entries.reduce((total, wallet) => {
                const installment = wallet.walletInstallments?.[0];
                return total + (!installment?.receivedStatus ? Number(installment?.value) || 0 : 0);
              }, 0);

              return (
                <Accordion.Item eventKey={String(index)} key={person.id || person.name}>
                  <Accordion.Header>
                    <span className="walletPersonHeading">
                      <span className="walletPersonAvatar">{person.name?.charAt(0)?.toUpperCase() || "?"}</span>
                      <span className="walletPersonName">{person.name}</span>
                      <span className="walletPersonTotal">R$ {decimalAdjust(person.value || 0)}</span>
                      {pendingValue > 0 && <span className="walletPendingBadge">R$ {decimalAdjust(pendingValue)} a receber</span>}
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Table responsive className="walletEntriesTable" borderless>
                      <thead><tr><th>Entrada</th><th>Valor</th><th>Tipo</th><th>Parcelas</th><th>Status e ações</th></tr></thead>
                      <tbody>
                        {entries.map(wallet => {
                          const installment = wallet.walletInstallments?.[0];
                          if (!installment) return null;

                          return (
                            <tr key={wallet.id}>
                              <td data-label="Entrada">{wallet.name}</td>
                              <td data-label="Valor" className="walletEntryValue">R$ {decimalAdjust(installment.value)}</td>
                              <td data-label="Tipo">{debtInstallmentTransform(wallet.walletInstallmentType)}</td>
                              <td data-label="Parcelas">{wallet.walletInstallmentType === "Installment" ? `${installment.installmentNumber}/${wallet.numberOfInstallments}` : "1/1"}</td>
                              <td data-label="Status e ações" className="walletActionsCell">
                                <Form.Check
                                  type="switch"
                                  id={`wallet-received-${installment.id}`}
                                  label={walletInstallmentStatusTransform(installment.receivedStatus)}
                                  checked={Boolean(installment.receivedStatus)}
                                  onChange={() => EditWalletStatus(!installment.receivedStatus, installment.id)}
                                />
                                <span className="walletActionButtons">
                                  <SetModal value={wallet.id} name={wallet.name} modalName="" simbol="fas fa-pen" />
                                  <SetModalDelete value={wallet} name={wallet.name} modalName="" simbol="fas fa-trash" />
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        ) : (
          <div className="walletEmptyState"><i className="fas fa-inbox" aria-hidden="true" /><span>Nenhuma entrada cadastrada neste período.</span></div>
        )}
      </section>
    </main>
  )
}
