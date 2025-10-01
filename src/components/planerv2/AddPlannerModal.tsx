import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Calendar, Clock } from "lucide-react";

interface AddPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  frequencia: string;
  setFrequencia: (freq: string) => void;
}

export function AddPlannerModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  frequencia, 
  setFrequencia 
}: AddPlannerModalProps) {
  const frequencyOptions = [
    { value: "daily", label: "Diário", description: "Um bloco para cada dia" },
    { value: "weekly", label: "Semanal", description: "Blocos de 7 dias" },
    { value: "biweekly", label: "Quinzenal", description: "Blocos de 15 dias" },
    { value: "monthly", label: "Mensal", description: "Um bloco para o mês inteiro" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Criar Novo Planejamento
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Selecione a frequência do planejamento:
              </label>
              <Select value={frequencia} onValueChange={setFrequencia}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma frequência" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground">
                <strong>Dica:</strong> Escolha a frequência que melhor se adapta ao seu estilo de controle financeiro. 
                Você poderá adicionar categorias e definir orçamentos para cada período.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="bg-gradient-primary hover:opacity-90">
            Criar Planejamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}