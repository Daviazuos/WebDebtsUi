import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";
import { cn } from "../../lib/utils";

interface SummaryData {
  [categoryName: string]: {
    orcado: number;
    gasto: number;
  };
}

interface SummaryCardProps {
  planejamento: {
    blocos: Array<{
      categorias: Array<{
        nome: string;
        orcado: number;
        gasto: number;
      }>;
    }>;
  };
  provisionedValue: number | null;
}

export function SummaryCard({ planejamento, provisionedValue }: SummaryCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular resumo
  const resumo: SummaryData = {};
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

  const balanco = (provisionedValue ?? 0) - (totalOrcado - totalGasto);
  const percentualGasto = totalOrcado > 0 ? (totalGasto / totalOrcado) * 100 : 0;
  const isOverBudget = totalGasto > totalOrcado;

  return (
    <Card className="w-full mb-6 border-primary/20 shadow-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <PiggyBank className="h-6 w-6 text-primary" />
          Resumo do Mês
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-card/50 border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-info" />
              <span className="text-sm font-medium">Total Orçado</span>
            </div>
            <p className="text-2xl font-bold text-info">{formatCurrency(totalOrcado)}</p>
          </div>
          
          <div className="p-4 rounded-lg bg-card/50 border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Total Gasto</span>
            </div>
            <p className="text-2xl font-bold text-warning">{formatCurrency(totalGasto)}</p>
          </div>
          
          <div className="p-4 rounded-lg bg-card/50 border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={cn("h-4 w-4", balanco >= 0 ? "text-success" : "text-destructive")} />
              <span className="text-sm font-medium">Balanço</span>
            </div>
            <p className={cn(
              "text-2xl font-bold",
              balanco >= 0 ? "text-success" : "text-destructive"
            )}>
              {formatCurrency(balanco)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-card/50 border">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-4 rounded-full bg-primary" />
              <span className="text-sm font-medium">Progresso</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{percentualGasto.toFixed(1)}%</p>
              <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                {isOverBudget ? "Acima" : "Dentro"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Lista de categorias */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg mb-3">Detalhamento por Categoria</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {Object.entries(resumo).map(([nome, val]) => {
              const categoryProgress = val.orcado > 0 ? (val.gasto / val.orcado) * 100 : 0;
              const isOverCategory = val.gasto > val.orcado;
              
              return (
                <div key={nome} className="flex items-center justify-between p-3 rounded-lg bg-card/30 border">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{nome}</span>
                      <Badge variant={isOverCategory ? "destructive" : "secondary"}>
                        {categoryProgress.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>Orçado: {formatCurrency(val.orcado)}</span>
                      <span className="mx-2">•</span>
                      <span>Gasto: {formatCurrency(val.gasto)}</span>
                      <span className="mx-2">•</span>
                      <span className={cn(
                        "font-medium",
                        val.orcado - val.gasto >= 0 ? "text-success" : "text-destructive"
                      )}>
                        Saldo: {formatCurrency(val.orcado - val.gasto)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}