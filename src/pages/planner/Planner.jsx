import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Container,
  Modal,
  Row,
  Col,
  Form,
  ProgressBar,
  InputGroup,
  Table
} from 'react-bootstrap';
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from '../../api';
import MaskedFormControl from '../../utils/maskedInputs';
import { decimalAdjust } from '../../utils/valuesFormater';
import { translateFrequency } from '../../utils/utils';
import dayjs from 'dayjs'; // Instale: npm install dayjs
import { addMonthsToDate, addMonthsToDateNoChangeFormat, dateAdjust, dateFromDatetime, formatDate, formatDateBrazilian } from '../../utils/dateFormater';
import './Planner.css';

export default function Planner() {
  const [planejamento, setPlanejamento] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [frequencia, setFrequencia] = useState('semanal');
  const [year, setYear] = useState(localStorage.getItem('year'));
  const [month, setMonth] = useState(localStorage.getItem('month'));
  const [lastMonth, setLastMonth] = useState(month - 1);
  const [provisionedValue, setProvisionedValue] = useState(0.00);
  const [categoryName, setCategoryName] = useState('');

  const [novaCategoria, setNovaCategoria] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [blocoSelecionado, setBlocoSelecionado] = useState(undefined);
  const [list_categories, setlist_categories] = useState([]);
  const [debtCategories, setCategory] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [editModeFrequency, setEditModeFrequency] = useState({});
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.getCategories())
      .then(res => {
        const categories = res.data;

        const lis = categories.map(item => {
          return (
            <option value={item.id} data-nome={item.name}>{item.name}</option>
          )
        })
        lis.unshift(<option value="">Escolha uma categoria</option>)
        setlist_categories(lis)
      })
  }, [])

  useEffect(() => {
    let provision = localStorage.getItem('provisionedValue')
    if (provision) {
      setProvisionedValue(provision);
    }
  }, []);

  useEffect(() => {
    axiosInstance.get(Endpoints.planer.getByMonthYear(month, year))
      .then(res => {
        if (res.data) {
          var response = res.data[0];
          setPlanejamento({
            frequencia: translateFrequency(response.frequency),
            blocos: response.plannerFrequencies.map((freq, index) => ({
              id: freq.id,
              idBloco: index + 1,
              start: freq.start,
              end: freq.end,
              categorias: freq.plannerCategories.map(cat => ({
                nome: cat.debtCategoryName,
                orcado: cat.budgetedValue,
                gasto: 0.00,
                id: cat.id,
              }))
            }))
          });
          setUpdated(!updated);
        } else {
          setPlanejamento(null);
        }
      })
      .catch(err => {
        console.error('Erro ao buscar planejamento:', err);
      });


  }, [month, year]);

  useEffect(() => {
    if (updated === false) return;
    planejamento.blocos.forEach(bloco => {
      axiosInstance.get(Endpoints.debt.getDebtCategories(month, year, undefined, bloco.start, bloco.end))
        .then(res => {
          const lis = res.data.map(item => {
            return ({ name: item.name, valueTotal: item.value })
          })

          planejamento.blocos.find(b => b.id === bloco.id).categorias.forEach(cat => {
            const catFound = lis.find(c => c.name === cat.nome);
            if (catFound) {
              cat.gasto = catFound.valueTotal;
            }
          });
          setPlanejamento({ ...planejamento });
        })
    })

    setUpdated(false);
  }, [updated]);

  const getBlocksByFrequency = (frequency, month, year) => {
    const today = dayjs();
    const selectedMonth = Number(month);
    const selectedYear = Number(year);

    // Primeiro dia do mês selecionado
    const firstDay = dayjs(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`);
    // Último dia do mês selecionado
    const lastDay = firstDay.endOf('month');
    // Dia de início: hoje, se o mês/ano for o atual, senão, primeiro dia do mês
    const startDay = (today.month() + 1 === selectedMonth && today.year() === selectedYear)
      ? today
      : firstDay;

    const daysLeft = lastDay.diff(startDay, 'day') + 1;

    let blocks = [];
    if (frequency === 'weekly') {
      let current = startDay;
      let remaining = daysLeft;
      while (remaining > 0) {
        const weekLength = Math.min(7, remaining);
        const end = current.add(weekLength - 1, 'day');
        blocks.push({
          startDate: current.format('YYYY-MM-DD'),
          endDate: end.format('YYYY-MM-DD')
        });
        current = end.add(1, 'day');
        remaining -= weekLength;
      }
    } else if (frequency === 'biweekly') {
      let current = startDay;
      let remaining = daysLeft;
      while (remaining > 0) {
        const periodLength = Math.min(15, remaining);
        const end = current.add(periodLength - 1, 'day');
        blocks.push({
          startDate: current.format('YYYY-MM-DD'),
          endDate: end.format('YYYY-MM-DD')
        });
        current = end.add(1, 'day');
        remaining -= periodLength;
      }
    } else if (frequency === 'daily') {
      let current = startDay;
      for (let i = 0; i < daysLeft; i++) {
        blocks.push({
          startDate: current.format('YYYY-MM-DD'),
          endDate: current.format('YYYY-MM-DD')
        });
        current = current.add(1, 'day');
      }
    } else if (frequency === 'monthly') {
      blocks.push({
        startDate: startDay.format('YYYY-MM-DD'),
        endDate: lastDay.format('YYYY-MM-DD')
      });
    }
    return blocks;
  };

  const handleAdicionarPlanejamento = () => {
    // Frequências do backend: daily, weekly, biweekly, monthly
    const blocks = getBlocksByFrequency(frequencia, lastMonth, year);

    const requestData = {
      frequency: frequencia,
      month: month,
      year: year,
      blocks: blocks
    };

    axiosInstance.post(Endpoints.planer.add(), requestData).then(res => {
      setPlanejamento({
        frequencia: translateFrequency(res.data.frequency),
        blocos: res.data.plannerFrequencies.map((freq, index) => ({
          id: freq.id,
          idBloco: index + 1,
          start: freq.start,
          end: freq.end,
          categorias: freq.plannerCategories.map(cat => ({
            nome: cat.name,
            orcado: cat.budgetedAmount,
            gasto: 0
          }))
        }))
      });
    }).catch(err => {
      console.error('Erro ao criar planejamento:', err);
    });
    setShowModal(false);
  };

  const handleAbrirModalCategoria = (idx) => {
    setBlocoSelecionado(idx);
    setNovaCategoria('');
    setNovoValor('');
  };

  const toggleEditMode = (plannerFrequencyId) => {
    setEditMode(prevState => ({
      ...prevState,
      [plannerFrequencyId]: !prevState[plannerFrequencyId]
    }));
  }

  const toggleEditModeFrequency = (plannerFrequencyId) => {
    setEditModeFrequency(prevState => ({
      ...prevState,
      [plannerFrequencyId]: !prevState[plannerFrequencyId]
    }));
  }

  const handleEditChange = (e, plannerFrequencyId, field) => {
    const valor = e.target.value;
    const blocoAtualizado = { ...planejamento };
    const categoria = blocoAtualizado.blocos.flatMap(bloco => bloco.categorias).find(cat => cat.id === plannerFrequencyId);
    if (!categoria) return;

    if (field === 'value') {
      // Remove tudo que não for número ou ponto
      const valorNumerico = valor.replace(/[^0-9.]/g, '');
      categoria.orcado = valorNumerico;
    }
    setPlanejamento(blocoAtualizado);
  }

  const handleEditChangeFrequency = (e, plannerFrequencyId, field) => {
    const valor = e.target.value;
    const blocoAtualizado = { ...planejamento };
    const bloco = blocoAtualizado.blocos.find(bloco => bloco.id === plannerFrequencyId);
    if (!bloco) return;
    if (field === 'start') {
      bloco.start = valor + 'T00:00:00';
    }
    if (field === 'end') {
      bloco.end = valor + 'T00:00:00';
    }
    setPlanejamento(blocoAtualizado);
  }

  const handleSaveEdit = (plannerFrequencyId) => {
    const blocoAtualizado = { ...planejamento };
    const categoria = blocoAtualizado.blocos.flatMap(bloco => bloco.categorias).find(cat => cat.id === plannerFrequencyId);
    if (!categoria) return;
    const payload = {
      budgetedValue: Number(categoria.orcado),
    };
    axiosInstance.put(Endpoints.planer.updateCategory(plannerFrequencyId), payload)
      .then(() => {
        setPlanejamento(blocoAtualizado);
      })
      .catch(err => {
        console.error('Erro ao salvar edição:', err);
      });

    toggleEditMode(plannerFrequencyId); // Toggle edit mode back to view mode after saving
  }

  const handleSaveEditFrequency = (plannerFrequencyId) => {
    const blocoAtualizado = { ...planejamento };
    const bloco = blocoAtualizado.blocos.find(bloco => bloco.id === plannerFrequencyId);
    if (!bloco) return;
    const payload = {
      start: bloco.start,
      end: bloco.end,
    };
    axiosInstance.put(Endpoints.planer.updateFrequency(plannerFrequencyId), payload)
      .then(() => {
        setPlanejamento(blocoAtualizado);
      })
      .catch(err => {
        console.error('Erro ao salvar edição:', err);
      });
    toggleEditModeFrequency(plannerFrequencyId); // Toggle edit mode back to view mode after saving
  }

  const handleDeletePlannerCategory = (plannerCategoryId) => {
    axiosInstance.delete(Endpoints.planer.deleteCategory(plannerCategoryId))
      .then(() => {
        const blocoAtualizado = { ...planejamento };
        blocoAtualizado.blocos.forEach(bloco => {
          bloco.categorias = bloco.categorias.filter(cat => cat.id !== plannerCategoryId);
        });
        setPlanejamento(blocoAtualizado);
      })
      .catch(err => {
        console.error('Erro ao deletar categoria do planejamento:', err);
      });
  }

  const handleDeletePlannerFrequency = (plannerFrequencyId) => {
    axiosInstance.delete(Endpoints.planer.deleteFrequency(plannerFrequencyId))
      .then(() => {
        const blocoAtualizado = { ...planejamento };
        blocoAtualizado.blocos = blocoAtualizado.blocos.filter(bloco => bloco.id !== plannerFrequencyId);
        setPlanejamento(blocoAtualizado);
      })
      .catch(err => {
        console.error('Erro ao deletar bloco do planejamento:', err);
      });
  }

  const handleAdicionarCategoria = async () => {
    if (!novaCategoria || !novoValor) return;

    // Se blocoSelecionado for null, adiciona em todos
    if (blocoSelecionado === null) {
      const promises = planejamento.blocos.map((bloco) => {
        const plannerFrequencyId = bloco.id;
        const payload = {
          debtCategoryId: novaCategoria,
          budgetedValue: Number(novoValor),
        };
        return axiosInstance.put(Endpoints.planer.AddCategory(plannerFrequencyId), payload);
      });

      try {
        await Promise.all(promises);
        const novaCat = {
          nome: categoryName,
          orcado: Number(novoValor),
          gasto: 0
        };

        const atualizado = { ...planejamento };
        atualizado.blocos = atualizado.blocos.map((bloco) => {
          const jaExiste = bloco.categorias.some((cat) => cat.nome === categoryName);
          if (!jaExiste) {
            return {
              ...bloco,
              categorias: [...bloco.categorias, { ...novaCat }],
            };
          }
          return bloco;
        });

        setPlanejamento(atualizado);
        setNovaCategoria('');
        setNovoValor('');
        setBlocoSelecionado(undefined);
        setUpdated(true);
      } catch (err) {
        console.error('Erro ao adicionar categoria:', err);
      }
    } else {
      // Adiciona só no bloco selecionado
      const bloco = planejamento.blocos.find(b => b.id === blocoSelecionado);
      if (!bloco) return;

      const plannerFrequencyId = bloco.id;
      const payload = {
        debtCategoryId: novaCategoria,
        budgetedValue: Number(novoValor),
      };

      try {
        await axiosInstance.put(Endpoints.planer.AddCategory(plannerFrequencyId), payload);

        const novaCat = {
          nome: categoryName,
          orcado: Number(novoValor),
          gasto: 0
        };

        const atualizado = { ...planejamento };
        atualizado.blocos = atualizado.blocos.map((b) => {
          if (b.id === blocoSelecionado) {
            const jaExiste = b.categorias.some((cat) => cat.nome === categoryName);
            if (!jaExiste) {
              return {
                ...b,
                categorias: [...b.categorias, { ...novaCat }],
              };
            }
          }
          return b;
        });

        setPlanejamento(atualizado);
        setNovaCategoria('');
        setNovoValor('');
        setBlocoSelecionado(undefined);
      } catch (err) {
        console.error('Erro ao adicionar categoria:', err);
      }
    }
  };

  return (
    <main className="plannerPage">
      <header className="plannerPageHeader">
        <div>
          <span className="plannerEyebrow">FINANÇAS / ORGANIZAÇÃO</span>
          <h1>Planejamento mensal</h1>
          <p>Distribua seu orçamento por período e acompanhe seus gastos.</p>
        </div>
        {!planejamento && (
          <button type="button" className="plannerPrimaryButton" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus" aria-hidden="true"></i>
            Criar planejamento
          </button>
        )}
      </header>


      {/* Modal de Frequência */}
      <Modal className="plannerModal" show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Selecionar Frequência</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Frequência:</Form.Label>
            <Form.Select
              value={frequencia}
              onChange={(e) => setFrequencia(e.target.value)}
            >
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="biweekly">Quinzenal</option>
              <option value="monthly">Mensal</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="plannerModalActionButton plannerModalActionButton--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
          <button type="button" className="plannerModalActionButton plannerModalActionButton--primary" onClick={handleAdicionarPlanejamento}>Confirmar</button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Adicionar Categoria */}
      <Modal className="plannerModal" show={blocoSelecionado !== undefined} onHide={() => setBlocoSelecionado(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Categoria</Form.Label>
            <Form.Select
              value={novaCategoria}
              onChange={(e) => {
                setNovaCategoria(e.target.value);
                // Se quiser pegar o nome da categoria selecionada:
                const selectedOption = e.target.options[e.target.selectedIndex];
                // Você pode salvar esse nome em outro state se quiser
                setCategoryName(selectedOption.getAttribute('data-nome'));
              }}
            >
              {list_categories}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Valor Orçado (R$)</Form.Label>
            <div style={{ display: 'flex' }}>
              <MaskedFormControl currency="BRL" required="true" placeholder="Valor" onChange={(event, value, maskedValue) => setNovoValor(value)} />
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="plannerModalActionButton plannerModalActionButton--secondary" onClick={() => setBlocoSelecionado(undefined)}>Cancelar</button>
          <button type="button" className="plannerModalActionButton plannerModalActionButton--primary" onClick={handleAdicionarCategoria}>Adicionar</button>
        </Modal.Footer>
      </Modal>

      <>
        {/* Card de Resumo */}
        <Row className="plannerSummaryRow">
          <Col md={12}>
            <Card className="plannerSummaryPanel">
              <Card.Header className="plannerPanelHeader">
                <div className="plannerSectionTitle">
                  <span className="plannerPanelIcon"><i className="fas fa-chart-pie" aria-hidden="true"></i></span>
                  <div><strong>Resumo do mês</strong><span>Orçamento e gastos agrupados por categoria</span></div>
                </div>
                <button type="button" className="plannerSecondaryButton" onClick={() => handleAbrirModalCategoria(null)}>
                  <i className="fas fa-plus" aria-hidden="true"></i>
                  Categoria em todos
                </button>
              </Card.Header>
              <Card.Body className="plannerSummaryBody">
                {!planejamento?.blocos ? '' : (() => {
                  // Agrupa categorias e soma orçado/gasto
                  const resumo = {};
                  let totalOrcado = 0;
                  let totalGasto = 0;
                  planejamento.blocos.forEach(bloco => {
                    bloco.categorias.forEach(cat => {
                      if (!resumo[cat.nome]) resumo[cat.nome] = { orcado: 0, gasto: 0 };
                      resumo[cat.nome].orcado += Number(cat.orcado);
                      resumo[cat.nome].gasto += Number(cat.gasto);
                      totalOrcado += Number(cat.orcado);
                      totalGasto += Number(cat.gasto);
                    });
                  });
                  return (
                    <>
                      <Table borderless responsive className="plannerSummaryTable" size="sm">
                        <thead>
                          <tr>
                            <th>Categoria</th>
                            <th>Orçado</th>
                            <th>Gasto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(resumo).map(([nome, val]) => (
                            <tr key={nome}>
                              <td>{nome}</td>
                              <td>R$ {decimalAdjust(val.orcado)}</td>
                              <td>R$ {decimalAdjust(val.gasto)}</td>
                            </tr>
                          ))}
                          <tr className="plannerSummaryTotal">
                            <td>Total</td>
                            <td>R$ {decimalAdjust(totalOrcado)}</td>
                            <td>R$ {decimalAdjust(totalGasto)}</td>
                          </tr>
                          <tr className="plannerSummaryBalance">
                            <td>Balanço</td>
                            <td colSpan={2}>
                              R$ {decimalAdjust(Number(localStorage.getItem('provisionedValue')) - (totalOrcado - totalGasto))}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </>
                  );
                })()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>

      {/* Exibição de Blocos */}
      {planejamento && (
        <Row className="plannerBlocksGrid">
          {planejamento.blocos.map((bloco) => (
            <Col md={6} key={bloco.id} className="plannerBlockColumn">
              <Card className="plannerBlockCard">
                <Card.Header className="plannerBlockHeader">
                  <span>
                    {planejamento.frequencia === 'mensal' && 'Mês inteiro'}
                    {planejamento.frequencia === 'semanal' && `Semana ${bloco.id}`}
                    {planejamento.frequencia === 'quinzenal' && `Quinzena ${bloco.id}`}
                    {planejamento.frequencia === 'diario' && `Dia ${bloco.id}`}
                  </span>
                  <span style={{ fontSize: '0.9em', color: '#888' }}></span>
                  <>
                    {editModeFrequency[bloco.id] ? (
                      <>
                        <Form.Control required="true" name='date' type="date" onChange={(e) => handleEditChangeFrequency(e, bloco.id, 'start')} defaultValue={dateFromDatetime(bloco.start)} />
                        <Form.Control required="true" name='date' type="date" onChange={(e) => handleEditChangeFrequency(e, bloco.id, 'end')} defaultValue={dateFromDatetime(bloco.end)} />
                        <button type="button" className="plannerIconButton" aria-label="Salvar período" onClick={() => handleSaveEditFrequency(bloco.id)}><i className="fas fa-check" aria-hidden="true"></i></button>
                        <button type="button" className="plannerIconButton" aria-label="Cancelar edição do período" onClick={() => toggleEditModeFrequency(bloco.id)}><i className="fas fa-times" aria-hidden="true"></i></button>
                      </>
                    ) : (
                      <>
                        {formatDateBrazilian(bloco.start)} - {formatDateBrazilian(bloco.end)}
                      </>
                    )}
                  </>
                  <button type="button" className="plannerIconButton" aria-label="Editar frequência" onClick={() => toggleEditModeFrequency(bloco.id)}><i className="fas fa-pen" aria-hidden="true"></i></button>
                  <button type="button" className="plannerIconButton plannerIconButton--danger" aria-label="Excluir frequência" onClick={() => handleDeletePlannerFrequency(bloco.id)}><i className="fas fa-trash" aria-hidden="true"></i></button>
                  <button
                    type="button"
                    className="plannerAddCategoryButton"
                    onClick={() => handleAbrirModalCategoria(bloco.id)}
                  >
                    + Categoria
                  </button>
                </Card.Header>
                <Card.Body className="plannerBlockBody">
                  {bloco.categorias.length === 0 ? (
                    <p className="text-muted">Nenhuma categoria adicionada.</p>
                  ) : (
                    bloco.categorias.map((cat, catIdx) => (
                      <div key={catIdx} className="plannerCategoryRow">
                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                          {editMode[cat.id] ? (
                            <>
                              <Form.Label>{cat.nome} - R$ </Form.Label>
                              <input
                                type="text"
                                value={cat.orcado}
                                onChange={(e) => handleEditChange(e, cat.id, 'value')}
                              />
                              <button type="button" className="plannerIconButton" aria-label="Salvar orçamento" onClick={() => handleSaveEdit(cat.id)}><i className="fas fa-check" aria-hidden="true"></i></button>
                            </>
                          ) : (
                            <>
                              <Form.Label>{cat.nome} - R$ {decimalAdjust(cat.orcado)}</Form.Label>
                              <button type="button" className="plannerIconButton" aria-label={`Editar ${cat.nome}`} onClick={() => toggleEditMode(cat.id)}><i className="fas fa-pen" aria-hidden="true"></i></button>
                              <button type="button" className="plannerIconButton plannerIconButton--danger" aria-label={`Excluir ${cat.nome}`} onClick={() => handleDeletePlannerCategory(cat.id)}><i className="fas fa-trash" aria-hidden="true"></i></button>
                            </>
                          )}

                        </div>

                        <div style={{ fontSize: '0.6rem', marginBottom: '0.4rem', color: '#333' }}>
                          R$ {cat.gasto} / R$ {decimalAdjust(cat.orcado)} - sobra R$ {decimalAdjust(cat.orcado - cat.gasto)}
                        </div>
                        <ProgressBar
                          now={cat.orcado > 0 ? Math.min((cat.gasto / cat.orcado) * 100, 100) : 0}
                          className="plannerProgress"
                          variant={cat.gasto > cat.orcado ? "danger" : "success"}
                        />
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </main>
  );
}
