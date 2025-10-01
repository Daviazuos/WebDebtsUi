import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { PenTool, Trash2, Calendar, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

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

interface PlannerCardProps {
  bloco: PlannerBlock;
  frequencia: string;
  onEditFrequency: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onAddCategory: (id: string) => void;
  onEditCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  isActive?: boolean;
}

export function PlannerCard({
  bloco,
  frequencia,
  onEditFrequency,
  onDeleteBlock,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  isActive = false
}: PlannerCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getBlockTitle = () => {
    switch (frequencia) {
      case 'mensal': return 'Mês Inteiro';
      case 'semanal': return `Semana ${bloco.idBloco}`;
      case 'quinzenal': return `Quinzena ${bloco.idBloco}`;
      case 'diario': return `Dia ${bloco.idBloco}`;
      default: return `Período ${bloco.idBloco}`;
    }
  };

  const totalOrcado = bloco.categorias.reduce((sum, cat) => sum + cat.orcado, 0);
  const totalGasto = bloco.categorias.reduce((sum, cat) => sum + cat.gasto, 0);
  const progressPercentage = totalOrcado > 0 ? (totalGasto / totalOrcado) * 100 : 0;

  return (
    <Card 
      className={cn(
        "min-w-[400px] h-[600px] flex flex-col transition-all duration-300 cursor-pointer",
        "border-2 shadow-card hover:shadow-card-hover",
        isActive 
          ? "border-primary shadow-premium" 
          : "border-border hover:border-primary/50"
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{getBlockTitle()}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditFrequency(bloco.id)}
              className="h-8 w-8 p-0"
            >
              <Calendar className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteBlock(bloco.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(bloco.start)} - {formatDate(bloco.end)}</span>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm">
            <span>Progresso do período</span>
            <span className="font-medium">
              {formatCurrency(totalGasto)} / {formatCurrency(totalOrcado)}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
            // @ts-ignore
            variant={progressPercentage > 100 ? "destructive" : "default"}
          />
          <div className="flex justify-between items-center">
            <Badge variant={progressPercentage > 100 ? "destructive" : "secondary"}>
              {progressPercentage.toFixed(1)}%
            </Badge>
            <span className={cn(
              "text-sm font-medium",
              totalOrcado - totalGasto >= 0 ? "text-success" : "text-destructive"
            )}>
              Saldo: {formatCurrency(totalOrcado - totalGasto)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {bloco.categorias.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Nenhuma categoria adicionada</p>
              <p className="text-sm">Clique no botão abaixo para começar</p>
            </div>
          ) : (
            bloco.categorias.map((categoria) => {
              const categoryProgress = categoria.orcado > 0 ? (categoria.gasto / categoria.orcado) * 100 : 0;
              const isOverBudget = categoria.gasto > categoria.orcado;
              
              return (
                <div key={categoria.id} className="p-4 rounded-lg border bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{categoria.nome}</h4>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditCategory(categoria.id)}
                        className="h-6 w-6 p-0"
                      >
                        <PenTool className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteCategory(categoria.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Orçado: {formatCurrency(categoria.orcado)}</span>
                      <span className={isOverBudget ? "text-destructive" : "text-muted-foreground"}>
                        Gasto: {formatCurrency(categoria.gasto)}
                      </span>
                    </div>
                    <Progress 
                      value={categoryProgress} 
                      className="h-1.5"
                      // @ts-ignore
                      variant={isOverBudget ? "destructive" : "default"}
                    />
                    <div className="flex justify-between items-center">
                      <Badge 
                        variant={isOverBudget ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {categoryProgress.toFixed(1)}%
                      </Badge>
                      <span className={cn(
                        "text-xs font-medium",
                        categoria.orcado - categoria.gasto >= 0 ? "text-success" : "text-destructive"
                      )}>
                        {formatCurrency(categoria.orcado - categoria.gasto)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <Button
          onClick={() => onAddCategory(bloco.id)}
          className="w-full mt-4 bg-gradient-primary hover:opacity-90"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Categoria
        </Button>
      </CardContent>
    </Card>
  );
}