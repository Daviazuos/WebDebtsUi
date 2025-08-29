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
  InputGroup
} from 'react-bootstrap';
import { Endpoints } from '../../api/endpoints';
import { axiosInstance } from '../../api';
import MaskedFormControl from '../../utils/maskedInputs';
import { decimalAdjust } from '../../utils/valuesFormater';
import { translateFrequency } from '../../utils/utils';

export default function Planner() {
  const [planejamento, setPlanejamento] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [frequencia, setFrequencia] = useState('semanal');
  const [year, setYear] = useState(localStorage.getItem('year'));
  const [month, setMonth] = useState(localStorage.getItem('month'));
  const [categoryName, setCategoryName] = useState('');

  const [novaCategoria, setNovaCategoria] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [blocoSelecionado, setBlocoSelecionado] = useState(null);
  const [list_categories, setlist_categories] = useState([]);

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

  const handleAdicionarPlanejamento = () => {
    const requestData = {
      frequency: frequencia,
      month: month,
      year: year
    }

    axiosInstance.post(Endpoints.planer.add(), requestData).then(res => {
      setPlanejamento({
        frequencia: translateFrequency(res.data.frequency),
        blocos: res.data.plannerFrequencies.map((freq, index) => ({
          id: freq.id,
          idBloco: index + 1,
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

  const handleAdicionarCategoria = async () => {
    if (!novaCategoria || !novoValor) return;

    const blocos = planejamento.blocos;
    const promises = blocos.map((bloco) => {
      const plannerFrequencyId = bloco.id;
      const payload = {
        debtCategoryId: novaCategoria,
        budgetedValue: Number(novoValor),
      };
      return axiosInstance.put(Endpoints.planer.AddCategory(plannerFrequencyId), payload);
    });

    try {
      await Promise.all(promises);

      // Atualiza o planejamento após todas as requisições
      const novaCat = {
        nome: categoryName,
        orcado: Number(novoValor),
        gasto: 0
      };

      console.log(novaCat);

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
      setBlocoSelecionado(null);
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
    }

    console.log(novaCategoria)
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span id="PagesTitle">Planejamento Mensal</span>
        <p></p>
        {!planejamento && (
          <Button variant="success" className="mb-4" onClick={() => setShowModal(true)}>
            Adicionar Planejamento
          </Button>
        )}
      </div>

      {/* Modal de Frequência */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAdicionarPlanejamento}>Confirmar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Adicionar Categoria */}
      <Modal show={blocoSelecionado !== null} onHide={() => setBlocoSelecionado(null)} centered>
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
          <Button variant="secondary" onClick={() => setBlocoSelecionado(null)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAdicionarCategoria}>Adicionar para todos</Button>
        </Modal.Footer>
      </Modal>

      {/* Exibição de Blocos */}
      {planejamento && (
        <Row>
          {planejamento.blocos.map((bloco) => (
            <Col md={6} key={bloco.id} className="mb-4">
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>
                    {planejamento.frequencia === 'mensal' && 'Mês inteiro'}
                    {planejamento.frequencia === 'semanal' && `Semana ${bloco.id}`}
                    {planejamento.frequencia === 'quinzenal' && `Quinzena ${bloco.id}`}
                    {planejamento.frequencia === 'diario' && `Dia ${bloco.id}`}
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleAbrirModalCategoria(bloco.id)}
                  >
                    + Categoria
                  </Button>
                </Card.Header>
                <Card.Body>
                  {bloco.categorias.length === 0 ? (
                    <p className="text-muted">Nenhuma categoria adicionada.</p>
                  ) : (
                    bloco.categorias.map((cat, catIdx) => (
                      <div key={catIdx} className="mb-3">
                        <Form.Label>{cat.nome} - R$ {decimalAdjust(cat.orcado)}</Form.Label>
                        <ProgressBar
                          now={cat.orcado === 0 ? 0 : (cat.gasto / cat.orcado) * 100}
                          label={`R$ ${cat.gasto.toFixed(2)} / R$ ${cat.orcado}`}
                          className="mt-1"
                          variant="success"
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
    </>
  );
}
