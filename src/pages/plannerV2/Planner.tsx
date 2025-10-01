import { useState, useEffect, useRef } from 'react';
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Plus, ChevronLeft, ChevronRight, Calendar, PieChart } from "lucide-react";
import { PlannerCard } from "../../components/planerv2/PlannerCard";
import { SummaryCard } from "../../components/planerv2/SummaryCard";
import { AddPlannerModal } from "../../components/planerv2/AddPlannerModal";
import { AddCategoryModal } from "../../components/planerv2/AddCategoryModal";
import { cn } from "../../lib/utils";
import { axiosInstance } from '../../api';
import { Endpoints } from '../../api/endpoints';
import { translateFrequency } from '../../utils/utils';
import { useProvisionedValue } from "../../context/ProvisionedValueContext";

// Mock data interfaces (replace with your actual API types)
interface Category {
  id: string;
  nome: string;
  orcado: number;
  gasto: number;
}

interface PlannerBlock {
  id: string;
  idBloco: number;
  start: string;
  end: string;
  categorias: Category[];
}

interface Planning {
  frequencia: string;
  blocos: PlannerBlock[];
}

export default function PlannerV2() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [updated, setUpdated] = useState(false);
  const { provisionedValue } = useProvisionedValue();


  // State management
  const [planejamento, setPlanejamento] = useState<Planning | null>(null);
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [frequencia, setFrequencia] = useState('weekly');
  const [year, setYear] = useState(localStorage.getItem('year'));
  const [month, setMonth] = useState(localStorage.getItem('month'));
  const [provisionedValueState] = useState(Number(localStorage.getItem('provisionedValue')));

  // Category modal state
  const [novaCategoria, setNovaCategoria] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [blocoSelecionado, setBlocoSelecionado] = useState<string | null>(null);
  const [listCategories, setListCategories] = useState<{ id: string; name: string }[]>([]);

  // Fetch categories from API
  useEffect(() => {
    axiosInstance.get(Endpoints.debt.getCategories())
      .then(res => {
        listCategories.push(...res.data.map((cat: any) => ({ id: cat.id, name: cat.nome })));
      })
  }, [])


  // Mock planning data
  useEffect(() => {
    axiosInstance.get(Endpoints.planer.getByMonthYear(month, year))
      .then((res) => {
        if (res.data) {
          var response = res.data[0];
          const planning: Planning = {
            frequencia: translateFrequency(response.frequency),
            blocos: response.plannerFrequencies.map((freq: any, index: any) => ({
              id: freq.id,
              idBloco: index + 1,
              start: freq.start,
              end: freq.end,
              categorias: freq.plannerCategories.map((cat: any) => ({
                nome: cat.debtCategoryName,
                orcado: cat.budgetedValue,
                gasto: 0.00,
                id: cat.id,
              }))
            }))
          }
          setPlanejamento(planning);
          setUpdated(!updated);
        }
      }
      )}, []);

  useEffect(() => {
      if (updated === false) return;
      if (!planejamento) return;
      planejamento.blocos.forEach(bloco => {
        axiosInstance.get(Endpoints.debt.getDebtCategories(month, year, null, bloco.start, bloco.end))
          .then(res => {
            const lis = res.data.map((item: any) => {
              return ({ name: item.name, valueTotal: item.value })
            })
              
            const foundBloco = planejamento.blocos.find(b => b.id === bloco.id);
            if (foundBloco) {
              foundBloco.categorias.forEach(cat => {
                const catFound = lis.find((c: any) => c.name === cat.nome);
                if (catFound) {
                  cat.gasto = catFound.valueTotal;
                }
              });
            }
            setPlanejamento({ ...planejamento });
          })
      })
  
      setUpdated(false);
    }, [updated]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current || !planejamento) return;

    const cardWidth = 420; // 400px + gap
    const container = scrollRef.current;

    if (direction === 'left' && activeCardIndex > 0) {
      const newIndex = activeCardIndex - 1;
      setActiveCardIndex(newIndex);
      container.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth'
      });
    } else if (direction === 'right' && activeCardIndex < planejamento.blocos.length - 1) {
      const newIndex = activeCardIndex + 1;
      setActiveCardIndex(newIndex);
      container.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleCreatePlanning = () => {
    // Mock implementation
    console.log('Creating planning with frequency:', frequencia);
    setShowPlannerModal(false);
    // Here you would call your API
  };

  const handleAddCategory = () => {
    console.log('Adding category:', { novaCategoria, novoValor, blocoSelecionado });
    setShowCategoryModal(false);
    setNovaCategoria('');
    setNovoValor('');
    setBlocoSelecionado(null);
    // Here you would call your API
  };

  const handleOpenCategoryModal = (blockId: string | null) => {
    setBlocoSelecionado(blockId);
    setShowCategoryModal(true);
  };

  const currentMonth = new Date().toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">

              <Badge variant="outline" className="text-xs">
                {planejamento ? planejamento.frequencia : 'Sem planejamento'}
              </Badge>
            </div>

            {!planejamento && (
              <Button
                onClick={() => setShowPlannerModal(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Planejamento
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Summary Card */}
        {planejamento && (
          <SummaryCard
            planejamento={planejamento}
            provisionedValue={provisionedValue}
          />
        )}

        {!planejamento ? (
          // Empty state
          <Card className="h-96 flex items-center justify-center">
            <CardContent className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nenhum planejamento encontrado</h3>
                <p className="text-muted-foreground">
                  Crie seu primeiro planejamento para começar a organizar suas finanças
                </p>
              </div>
              <Button
                onClick={() => setShowPlannerModal(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Planejamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Planning cards
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Períodos do Planejamento</h2>
                <Badge variant="secondary">
                  {planejamento.blocos.length} {planejamento.blocos.length === 1 ? 'período' : 'períodos'}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenCategoryModal(null)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Categoria em Todos
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleScroll('left')}
                  disabled={activeCardIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm text-muted-foreground">
                  {activeCardIndex + 1} de {planejamento.blocos.length}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleScroll('right')}
                  disabled={activeCardIndex === planejamento.blocos.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Horizontal scroll container */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-4"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {planejamento.blocos.map((bloco, index) => (
                <div
                  key={bloco.id}
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <PlannerCard
                    bloco={bloco}
                    frequencia={planejamento.frequencia}
                    isActive={index === activeCardIndex}
                    onEditFrequency={(id) => console.log('Edit frequency:', id)}
                    onDeleteBlock={(id) => console.log('Delete block:', id)}
                    onAddCategory={(id) => handleOpenCategoryModal(id)}
                    onEditCategory={(id) => console.log('Edit category:', id)}
                    onDeleteCategory={(id) => console.log('Delete category:', id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPlannerModal
        isOpen={showPlannerModal}
        onClose={() => setShowPlannerModal(false)}
        onConfirm={handleCreatePlanning}
        frequencia={frequencia}
        setFrequencia={setFrequencia}
      />

      <AddCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onConfirm={handleAddCategory}
        novaCategoria={novaCategoria}
        setNovaCategoria={setNovaCategoria}
        novoValor={novoValor}
        setNovoValor={setNovoValor}
        categories={listCategories}
        setCategoryName={setCategoryName}
        isAddingToAll={blocoSelecionado === null}
      />
    </div>
  );
}