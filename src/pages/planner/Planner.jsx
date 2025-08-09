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


const FREQUENCIA_CONFIG = {
  diario: 30,
  semanal: 4,
  quinzenal: 2,
  mensal: 1
};

export default function Planner() {
  const [planejamento, setPlanejamento] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [frequencia, setFrequencia] = useState('semanal');

  const [novaCategoria, setNovaCategoria] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [blocoSelecionado, setBlocoSelecionado] = useState(null);
  const [list_categories, setlist_categories] = useState([]);

  const gerarBlocos = (frequencia) => {
    const quantidade = FREQUENCIA_CONFIG[frequencia] || 1;
    return Array.from({ length: quantidade }, (_, index) => ({
      id: index + 1,
      categorias: []
    }));
  };


  useEffect(() => {
    axiosInstance.get(Endpoints.debt.getCategories())
      .then(res => {
        const categories = res.data;

        const lis = categories.map(item => {
          return (
            <option value={item.name}>{item.name}</option>
          )
        })
        lis.unshift(<option value="">Escolha uma categoria</option>)
        setlist_categories(lis)
      })
  }, [])

  const handleAdicionarPlanejamento = () => {
    const novoPlanejamento = {
      frequencia,
      blocos: gerarBlocos(frequencia)
    };
    setPlanejamento(novoPlanejamento);
    setShowModal(false);
  };

  const handleAbrirModalCategoria = (idx) => {
    setBlocoSelecionado(idx);
    setNovaCategoria('');
    setNovoValor('');
  };

  const handleAdicionarCategoria = () => {
    if (!novaCategoria || !novoValor) return;

    const novaCat = {
      nome: novaCategoria,
      orcado: Number(novoValor),
      gasto: 0
    };

    console.log(novaCat)

    const atualizado = { ...planejamento };

    // Adiciona em todos os blocos, menos se já existir essa categoria
    atualizado.blocos = atualizado.blocos.map((bloco) => {
      const jaExiste = bloco.categorias.some(cat => cat.nome === novaCategoria);
      if (!jaExiste) {
        return {
          ...bloco,
          categorias: [...bloco.categorias, { ...novaCat }]
        };
      }
      return bloco;
    });

    setPlanejamento(atualizado);
    setNovaCategoria('');
    setNovoValor('');
    setBlocoSelecionado(null);
  };

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column'}}>
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
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="quinzenal">Quinzenal</option>
              <option value="mensal">Mensal</option>
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
              onChange={(e) => setNovaCategoria(e.target.value)}
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
          {planejamento.blocos.map((bloco, blocoIdx) => (
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
                    onClick={() => handleAbrirModalCategoria(blocoIdx)}
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
