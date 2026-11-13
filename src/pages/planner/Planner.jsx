import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  ProgressBar
} from 'react-bootstrap';
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from '../../api';
import MaskedFormControl from '../../utils/maskedInputs';
import { decimalAdjust } from '../../utils/valuesFormater';
import { translateFrequency } from '../../utils/utils';
import dayjs from 'dayjs'; // Instale: npm install dayjs
import { addMonthsToDate, addMonthsToDateNoChangeFormat, dateAdjust, dateFromDatetime, formatDate, formatDateBrazilian, monthByNumber } from '../../utils/dateFormater';
import './Planner.css';

const getEffectiveBudget = (category) => Math.max(
  Number(category.orcado) || 0,
  Number(category.gasto) || 0
);

const getCategoryKey = (name) => {
  const normalizedName = typeof name === 'string' ? name.trim().toLowerCase() : '';
  return normalizedName || '__uncategorized__';
};

export default function Planner() {
  const [planejamento, setPlanejamento] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [frequencia, setFrequencia] = useState('semanal');
  const [year, setYear] = useState(localStorage.getItem('year'));
  const [month, setMonth] = useState(localStorage.getItem('month'));
  const [monthlyCategoryExpenses, setMonthlyCategoryExpenses] = useState(null);
  const [monthlySummaryError, setMonthlySummaryError] = useState('');
  const [lastMonth, setLastMonth] = useState(month - 1);
  const [provisionedValue, setProvisionedValue] = useState(0.00);
  const [categoryName, setCategoryName] = useState('');
  const [blockFilter, setBlockFilter] = useState('all');
  const [showUnplannedCategories, setShowUnplannedCategories] = useState(true);
  const [showAllUnplannedCategories, setShowAllUnplannedCategories] = useState(false);

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
    setMonthlyCategoryExpenses(null);
    setMonthlySummaryError('');

    axiosInstance.get(Endpoints.debt.getDebtCategories(month, year))
      .then(res => {
        setMonthlyCategoryExpenses(res.data.map(item => {
          const simpleInstallments = (item.installmentsPerCategory || [])
            .filter(installment => installment.isSimple);

          return {
            name: item.name,
            value: Number(item.value) || 0,
            simpleValue: simpleInstallments
              .reduce((total, installment) => total + (Number(installment.value) || 0), 0)
          };
        }));
      })
      .catch(err => {
        console.error('Erro ao buscar gastos do mês para o resumo:', err);
        setMonthlySummaryError('Não foi possível carregar os gastos do mês.');
      });
  }, [month, year]);

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
                orcadoOriginal: cat.originalBudgetedValue ?? cat.budgetedValue,
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
            return ({ name: item.name, valueTotal: Number(item.value) || 0 })
          })

          Promise.all(bloco.categorias.map(async cat => {
            const catFound = lis.find(c => getCategoryKey(c.name) === getCategoryKey(cat.nome));
            if (!catFound) return cat;

            const atualizado = { ...cat, gasto: catFound.valueTotal };
            const orcadoOriginal = Number(cat.orcadoOriginal ?? cat.orcado) || 0;
            const orcadoAtualizado = Math.max(orcadoOriginal, catFound.valueTotal);
            if (atualizado.id && orcadoAtualizado !== Number(cat.orcado)) {
              try {
                const budgetResponse = await axiosInstance.put(
                  Endpoints.planer.adjustCategoryBudget(cat.id),
                  { spentValue: catFound.valueTotal }
                );
                atualizado.orcado = Number(budgetResponse.data.budgetedValue);
                atualizado.orcadoOriginal = Number(
                  budgetResponse.data.originalBudgetedValue ?? cat.orcadoOriginal ?? cat.orcado
                );
              } catch (err) {
                console.error('Erro ao ajustar orçamento pelo gasto:', err);
              }
            }
            return atualizado;
          })).then(categoriasAtualizadas => {
            setPlanejamento(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                blocos: prev.blocos.map(blocoAtual => (
                  blocoAtual.id === bloco.id
                    ? { ...blocoAtual, categorias: categoriasAtualizadas }
                    : blocoAtual
                ))
              };
            });
          });
        })
        .catch(err => {
          console.error('Erro ao buscar gastos do período do planejamento:', err);
        });
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
            orcadoOriginal: cat.budgetedAmount,
            gasto: 0
            }))
        }))
      });
      setUpdated(true);
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
        categoria.orcadoOriginal = Number(categoria.orcado);
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
        const responses = await Promise.all(promises);

        const atualizado = { ...planejamento };
        atualizado.blocos = atualizado.blocos.map((bloco, index) => {
          const jaExiste = bloco.categorias.some((cat) => cat.nome === categoryName);
          if (!jaExiste) {
            const addedCategory = responses[index].data.plannerCategories
              .find(cat => cat.debtCategoryId === novaCategoria);
            return {
              ...bloco,
              categorias: [...bloco.categorias, {
                id: addedCategory?.id,
                nome: categoryName,
                orcado: Number(novoValor),
                orcadoOriginal: Number(novoValor),
                gasto: 0
              }],
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
        const response = await axiosInstance.put(Endpoints.planer.AddCategory(plannerFrequencyId), payload);
        const addedCategory = response.data.plannerCategories
          .find(cat => cat.debtCategoryId === novaCategoria);

        const novaCat = {
          id: addedCategory?.id,
          nome: categoryName,
          orcado: Number(novoValor),
          orcadoOriginal: Number(novoValor),
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
        setUpdated(true);
      } catch (err) {
        console.error('Erro ao adicionar categoria:', err);
      }
    }
  };

  const plannerBlocks = planejamento?.blocos || [];
  const blockHasOverspend = (block) => block.categorias.some(category => (
    Number(category.gasto) > Number(category.orcadoOriginal ?? category.orcado)
  ));
  const blockHasBalance = (block) => block.categorias.some(category => (
    getEffectiveBudget(category) > (Number(category.gasto) || 0)
  ));
  const overspentCategories = plannerBlocks.flatMap(block => block.categorias
    .filter(category => Number(category.gasto) > Number(category.orcadoOriginal ?? category.orcado))
    .map(category => ({
      block,
      category,
      exceeded: Number(category.gasto) - Number(category.orcadoOriginal ?? category.orcado)
    })));
  const overspendAlert = overspentCategories[0];
  const currentDate = dayjs().startOf('day');
  const currentBlock = plannerBlocks.find(block => (
    !currentDate.isBefore(dayjs(block.start).startOf('day')) &&
    !currentDate.isAfter(dayjs(block.end).startOf('day'))
  ));
  const nextBlock = plannerBlocks.find(block => dayjs(block.start).isAfter(currentDate));
  const filteredPlannerBlocks = plannerBlocks.filter(block => {
    if (blockFilter === 'overspent') return blockHasOverspend(block);
    if (blockFilter === 'balance') return blockHasBalance(block);
    return true;
  });

  let monthlySummary = null;
  if (monthlyCategoryExpenses !== null) {
    const categories = {};
    const plannedCategoryKeys = new Set();
    let totalOrcado = 0;
    let totalGasto = 0;
    let totalForaDoPlano = 0;

    plannerBlocks.forEach(block => {
      block.categorias.forEach(category => {
        const key = getCategoryKey(category.nome);
        plannedCategoryKeys.add(key);
        if (!categories[key]) {
          categories[key] = {
            key,
            name: category.nome || 'Sem categoria',
            budget: 0,
            originalBudget: 0,
            spent: 0
          };
        }

        const budget = getEffectiveBudget(category);
        const originalBudget = Number(category.orcadoOriginal ?? category.orcado) || 0;
        const spent = Number(category.gasto) || 0;
        categories[key].budget += budget;
        categories[key].originalBudget += originalBudget;
        categories[key].spent += spent;
        totalOrcado += budget;
        totalGasto += spent;
      });
    });

    const unplannedCategories = {};
    monthlyCategoryExpenses.forEach(category => {
      const key = getCategoryKey(category.name);
      if (plannedCategoryKeys.has(key)) return;

      const name = typeof category.name === 'string' && category.name.trim()
        ? category.name.trim()
        : 'Sem categoria';
      const simpleValue = Number(category.simpleValue) || 0;
      if (simpleValue <= 0) return;

      totalForaDoPlano += simpleValue;
      if (!unplannedCategories[key]) {
        unplannedCategories[key] = { key, name, value: 0 };
      }
      unplannedCategories[key].value += simpleValue;
    });

    const allUnplannedCategories = Object.values(unplannedCategories)
      .sort((first, second) => second.value - first.value);
    monthlySummary = {
      categories: Object.values(categories).sort((first, second) => second.spent - first.spent),
      totalOrcado,
      totalGasto,
      totalForaDoPlano,
      saldo: (Number(provisionedValue) || 0) - (totalOrcado - totalGasto),
      totalSpentPercent: totalOrcado > 0 ? Math.min((totalGasto / totalOrcado) * 100, 100) : 0,
      allUnplannedCategories,
      topUnplannedCategories: allUnplannedCategories.slice(0, 5)
    };
  }

  const scrollToBlock = (blockId) => {
    const blockElement = document.getElementById(`planner-block-${blockId}`);
    if (blockElement) {
      blockElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        <div className="plannerHeaderActions">
          {planejamento ? (
            <>
              <span className="plannerSummaryPeriod">
                {monthByNumber(month) || 'Período selecionado'} {year}
              </span>
              <button type="button" className="plannerPrimaryButton" onClick={() => handleAbrirModalCategoria(null)}>
                <i className="fas fa-plus" aria-hidden="true"></i>
                Categoria em todas as semanas
              </button>
            </>
          ) : (
            <button type="button" className="plannerPrimaryButton" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus" aria-hidden="true"></i>
              Criar planejamento
            </button>
          )}
        </div>
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

      {overspendAlert && (
        <div className="plannerOverspendAlert" role="alert">
          <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
          <span>
            <strong>{overspendAlert.category.nome}</strong> passou do planejado em R$ {decimalAdjust(overspendAlert.exceeded)}
            {' '}na semana {formatDateBrazilian(overspendAlert.block.start)} - {formatDateBrazilian(overspendAlert.block.end)}.
          </span>
          <button type="button" onClick={() => scrollToBlock(overspendAlert.block.id)}>Ver semana</button>
        </div>
      )}

      {planejamento && (
        monthlySummaryError ? (
          <div className="plannerSummaryMessage plannerSummaryMessage--error" role="alert">
            {monthlySummaryError}
          </div>
        ) : monthlySummary === null ? (
          <div className="plannerSummaryMessage">
            <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
            Carregando os gastos do mês...
          </div>
        ) : (
          <>
            <section className="plannerSummaryMetrics" aria-label="Indicadores financeiros do mês">
              <article className="plannerSummaryMetric plannerSummaryMetric--budget">
                <span className="plannerSummaryMetricIcon"><i className="fas fa-bullseye" aria-hidden="true"></i></span>
                <div>
                  <span>Orçamento planejado</span>
                  <strong>R$ {decimalAdjust(monthlySummary.totalOrcado)}</strong>
                  <small>Soma das categorias do mês</small>
                </div>
              </article>
              <article className="plannerSummaryMetric plannerSummaryMetric--spent">
                <span className="plannerSummaryMetricIcon"><i className="fas fa-wallet" aria-hidden="true"></i></span>
                <div>
                  <span>Total gasto</span>
                  <strong>R$ {decimalAdjust(monthlySummary.totalGasto)}</strong>
                  <div className="plannerMetricProgress" aria-label={`${Math.round(monthlySummary.totalSpentPercent)}% do orçamento planejado`}>
                    <span style={{ width: `${monthlySummary.totalSpentPercent}%` }}></span>
                  </div>
                  <small>{Math.round(monthlySummary.totalSpentPercent)}% do orçamento planejado</small>
                </div>
              </article>
              <article className={`plannerSummaryMetric plannerSummaryMetric--unplanned ${monthlySummary.totalForaDoPlano > 0 ? '' : 'plannerSummaryMetric--clear'}`}>
                <span className="plannerSummaryMetricIcon"><i className="fas fa-eye-slash" aria-hidden="true"></i></span>
                <div>
                  <span>Fora do plano</span>
                  <strong>R$ {decimalAdjust(monthlySummary.totalForaDoPlano)}</strong>
                  <small>Gastos fora das categorias previstas</small>
                </div>
              </article>
              <article className={`plannerSummaryMetric plannerSummaryMetric--balance ${monthlySummary.saldo < 0 ? 'plannerSummaryMetric--negative' : ''}`}>
                <span className="plannerSummaryMetricIcon"><i className="fas fa-balance-scale" aria-hidden="true"></i></span>
                <div>
                  <span>Balanço do mês</span>
                  <strong>{monthlySummary.saldo < 0 ? '-' : ''}R$ {decimalAdjust(Math.abs(monthlySummary.saldo))}</strong>
                  <small className="plannerBalanceBadge">
                    {monthlySummary.saldo < 0 ? 'Saldo negativo' : 'Saldo positivo'}
                  </small>
                </div>
              </article>
            </section>

            <div className="plannerMonthSummaryGrid">
              <section className="plannerMonthlyCategories">
                <header className="plannerSummarySectionHeader">
                  <div>
                    <strong>Por categoria</strong>
                    <span>Quanto já foi gasto do que foi orçado no mês</span>
                  </div>
                </header>
                <div className="plannerMonthlyCategoryList">
                  {monthlySummary.categories.length === 0 ? (
                    <div className="plannerSummaryEmpty">Nenhuma categoria planejada neste mês.</div>
                  ) : monthlySummary.categories.map(category => {
                    const progress = category.budget > 0
                      ? Math.min((category.spent / category.budget) * 100, 100)
                      : 0;
                    const isOverBudget = category.spent > category.originalBudget;
                    const remaining = category.budget - category.spent;
                    const status = isOverBudget
                      ? 'Acima do plano'
                      : category.budget > 0 && category.spent >= category.budget
                        ? 'Concluída'
                        : category.spent > 0
                          ? `Em andamento · ${Math.round(progress)}%`
                          : 'Não iniciada';

                    return (
                      <div className={`plannerMonthlyCategory ${isOverBudget ? 'plannerMonthlyCategory--over' : ''}`} key={category.key}>
                        <div className="plannerMonthlyCategoryHeading">
                          <strong>{category.name}</strong>
                          <span><b>R$ {decimalAdjust(category.spent)}</b> de R$ {decimalAdjust(category.budget)}</span>
                        </div>
                        <div className="plannerMonthlyProgress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                          <span style={{ width: `${progress}%` }}></span>
                        </div>
                        <div className="plannerMonthlyCategoryFooter">
                          <span className={`plannerCategoryStatus ${isOverBudget ? 'plannerCategoryStatus--over' : category.spent >= category.budget && category.budget > 0 ? 'plannerCategoryStatus--done' : ''}`}>
                            {status}
                          </span>
                          <span>{remaining < 0 ? 'Acima' : 'Sobra'} R$ {decimalAdjust(Math.abs(remaining))}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <footer className="plannerMonthlyTotals">
                  <div><span>Total orçado</span><strong>R$ {decimalAdjust(monthlySummary.totalOrcado)}</strong></div>
                  <div><span>Total gasto</span><strong>R$ {decimalAdjust(monthlySummary.totalGasto)}</strong></div>
                  <div className={monthlySummary.saldo < 0 ? 'plannerMonthlyTotalsNegative' : ''}>
                    <span>Balanço</span>
                    <strong>{monthlySummary.saldo < 0 ? '-' : ''}R$ {decimalAdjust(Math.abs(monthlySummary.saldo))}</strong>
                  </div>
                </footer>
              </section>

              <section className="plannerUnplannedTop">
                <header className="plannerUnplannedTopHeader">
                  <div>
                    <strong>Maiores gastos fora do plano</strong>
                    <span>Despesas simples; fixas e parceladas excluídas</span>
                  </div>
                  <button
                    type="button"
                    aria-expanded={showUnplannedCategories}
                    onClick={() => setShowUnplannedCategories(value => !value)}
                  >
                    {showUnplannedCategories ? 'Ocultar' : 'Mostrar'}
                    <i className={`fas fa-chevron-${showUnplannedCategories ? 'up' : 'down'}`} aria-hidden="true"></i>
                  </button>
                </header>
                {showUnplannedCategories && (
                  <>
                    {monthlySummary.allUnplannedCategories.length === 0 ? (
                      <div className="plannerUnplannedEmpty">Nenhum gasto fora do plano encontrado.</div>
                    ) : (
                      <ol className="plannerUnplannedTopList">
                        {(showAllUnplannedCategories
                          ? monthlySummary.allUnplannedCategories
                          : monthlySummary.topUnplannedCategories
                        ).map((category, index) => {
                          const percentage = monthlySummary.totalForaDoPlano > 0
                            ? Math.round((category.value / monthlySummary.totalForaDoPlano) * 100)
                            : 0;
                          return (
                            <li key={category.key}>
                              <span className="plannerUnplannedTopRank">{index + 1}</span>
                              <div className="plannerUnplannedTopDescription">
                                <strong>{category.name}</strong>
                                <span><i style={{ width: `${percentage}%` }}></i></span>
                              </div>
                              <strong className="plannerUnplannedTopValue">R$ {decimalAdjust(category.value)}</strong>
                              <small>{percentage}%</small>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                    {monthlySummary.allUnplannedCategories.length > 5 && (
                      <button
                        type="button"
                        className="plannerUnplannedShowAll"
                        onClick={() => setShowAllUnplannedCategories(value => !value)}
                      >
                        {showAllUnplannedCategories ? 'Mostrar somente o Top 5' : 'Ver todas as categorias fora do plano'}
                      </button>
                    )}
                  </>
                )}
              </section>
            </div>
          </>
        )
      )}

      {/* Exibição de Blocos */}
      {planejamento && (
        <section className="plannerCycleSection">
          <header className="plannerCycleHeader">
            <div className="plannerCycleTitle">
              <h2>{planejamento.frequencia === 'semanal' ? 'Semanas do ciclo' : 'Períodos do ciclo'}</h2>
              <p>
                {plannerBlocks.length > 0
                  ? `De ${formatDateBrazilian(plannerBlocks[0].start)} a ${formatDateBrazilian(plannerBlocks[plannerBlocks.length - 1].end)}`
                  : 'Nenhum período cadastrado'}
                {' · '}a semana atual fica destacada
              </p>
            </div>
            <div className="plannerCycleTools">
              <div className="plannerCycleFilters" role="group" aria-label="Filtrar períodos">
                <button type="button" className={blockFilter === 'all' ? 'is-active' : ''} aria-pressed={blockFilter === 'all'} onClick={() => setBlockFilter('all')}>
                  Todas <span>{plannerBlocks.length}</span>
                </button>
                <button type="button" className={blockFilter === 'overspent' ? 'is-active' : ''} aria-pressed={blockFilter === 'overspent'} onClick={() => setBlockFilter('overspent')}>
                  Estouradas <span>{plannerBlocks.filter(blockHasOverspend).length}</span>
                </button>
                <button type="button" className={blockFilter === 'balance' ? 'is-active' : ''} aria-pressed={blockFilter === 'balance'} onClick={() => setBlockFilter('balance')}>
                  Com saldo <span>{plannerBlocks.filter(blockHasBalance).length}</span>
                </button>
              </div>
              {(currentBlock || nextBlock || plannerBlocks[0]) && (
                <button
                  type="button"
                  className="plannerCurrentWeekLink"
                  onClick={() => scrollToBlock((currentBlock || nextBlock || plannerBlocks[0]).id)}
                >
                  Ir para a semana atual
                </button>
              )}
            </div>
          </header>

          {filteredPlannerBlocks.length === 0 ? (
            <div className="plannerFilteredEmpty">Nenhum período corresponde a este filtro.</div>
          ) : (
            <div className="plannerBlocksGrid">
              {filteredPlannerBlocks.map(bloco => {
                const isCurrentBlock = currentBlock?.id === bloco.id;
                const isNextBlock = !currentBlock && nextBlock?.id === bloco.id;
                const hasOverspend = blockHasOverspend(bloco);
                return (
                  <article
                    id={`planner-block-${bloco.id}`}
                    key={bloco.id}
                    className={`plannerBlockCard ${isCurrentBlock ? 'plannerBlockCard--current' : ''} ${hasOverspend ? 'plannerBlockCard--over' : ''}`}
                  >
                    <header className="plannerBlockHeader">
                      <div className="plannerBlockHeading">
                        {editModeFrequency[bloco.id] ? (
                          <div className="plannerDateEditor">
                            <Form.Control required name="start" type="date" onChange={(e) => handleEditChangeFrequency(e, bloco.id, 'start')} defaultValue={dateFromDatetime(bloco.start)} />
                            <Form.Control required name="end" type="date" onChange={(e) => handleEditChangeFrequency(e, bloco.id, 'end')} defaultValue={dateFromDatetime(bloco.end)} />
                            <button type="button" className="plannerIconButton" aria-label="Salvar período" onClick={() => handleSaveEditFrequency(bloco.id)}><i className="fas fa-check" aria-hidden="true"></i></button>
                            <button type="button" className="plannerIconButton" aria-label="Cancelar edição do período" onClick={() => toggleEditModeFrequency(bloco.id)}><i className="fas fa-times" aria-hidden="true"></i></button>
                          </div>
                        ) : (
                          <strong>{formatDateBrazilian(bloco.start)} - {formatDateBrazilian(bloco.end)}</strong>
                        )}
                        {isCurrentBlock && <span className="plannerBlockStatus plannerBlockStatus--current">Semana atual</span>}
                        {isNextBlock && <span className="plannerBlockStatus">Próxima</span>}
                        {hasOverspend && <span className="plannerBlockStatus plannerBlockStatus--over">Acima do plano</span>}
                      </div>
                      <div className="plannerBlockActions">
                        <button type="button" className="plannerIconButton" aria-label="Editar período" onClick={() => toggleEditModeFrequency(bloco.id)}><i className="fas fa-pen" aria-hidden="true"></i></button>
                        <button type="button" className="plannerIconButton plannerIconButton--danger" aria-label="Excluir período" onClick={() => handleDeletePlannerFrequency(bloco.id)}><i className="fas fa-trash" aria-hidden="true"></i></button>
                      </div>
                    </header>
                    <div className="plannerBlockBody">
                      {bloco.categorias.length === 0 ? (
                        <p className="plannerEmptyState">Nenhuma categoria adicionada.</p>
                      ) : (
                        bloco.categorias.map((category, categoryIndex) => {
                          const spent = Number(category.gasto) || 0;
                          const budget = getEffectiveBudget(category);
                          const originalBudget = Number(category.orcadoOriginal ?? category.orcado) || 0;
                          const isOverBudget = spent > originalBudget;
                          const remaining = budget - spent;
                          const progress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
                          return (
                            <div key={category.id || categoryIndex} className={`plannerCategoryRow ${isOverBudget ? 'plannerCategoryRow--over' : ''}`}>
                              <div className="plannerCategoryHeader">
                                {editMode[category.id] ? (
                                  <>
                                    <strong>{category.nome}</strong>
                                    <input
                                      type="text"
                                      aria-label={`Orçamento de ${category.nome}`}
                                      value={category.orcado}
                                      onChange={(e) => handleEditChange(e, category.id, 'value')}
                                    />
                                    <button type="button" className="plannerIconButton" aria-label="Salvar orçamento" onClick={() => handleSaveEdit(category.id)}><i className="fas fa-check" aria-hidden="true"></i></button>
                                  </>
                                ) : (
                                  <>
                                    <strong>{category.nome}</strong>
                                    <span className="plannerCategoryBudget">
                                      {isOverBudget && <del>{decimalAdjust(originalBudget)}</del>}
                                      R$ {decimalAdjust(budget)}
                                    </span>
                                    <button type="button" className="plannerIconButton" aria-label={`Editar ${category.nome}`} onClick={() => toggleEditMode(category.id)}><i className="fas fa-pen" aria-hidden="true"></i></button>
                                    <button type="button" className="plannerIconButton plannerIconButton--danger" aria-label={`Excluir ${category.nome}`} onClick={() => handleDeletePlannerCategory(category.id)}><i className="fas fa-trash" aria-hidden="true"></i></button>
                                  </>
                                )}
                              </div>
                              <ProgressBar
                                now={progress}
                                className="plannerProgress"
                                variant={isOverBudget ? 'danger' : 'success'}
                              />
                              <div className="plannerCategoryAmounts">
                                <span>Gasto R$ {decimalAdjust(spent)}</span>
                                <span>{remaining < 0 ? `R$ ${decimalAdjust(Math.abs(remaining))} acima do planejado` : `Sobra R$ ${decimalAdjust(remaining)}`}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <button
                        type="button"
                        className="plannerAddCategoryButton"
                        onClick={() => handleAbrirModalCategoria(bloco.id)}
                      >
                        <i className="fas fa-plus" aria-hidden="true"></i>
                        Categoria
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
