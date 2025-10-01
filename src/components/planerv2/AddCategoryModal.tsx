import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Plus, DollarSign } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  novaCategoria: string;
  setNovaCategoria: (cat: string) => void;
  novoValor: string;
  setNovoValor: (val: string) => void;
  categories: Category[];
  setCategoryName: (name: string) => void;
  isAddingToAll: boolean;
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onConfirm,
  novaCategoria,
  setNovaCategoria,
  novoValor,
  setNovoValor,
  categories,
  setCategoryName,
  isAddingToAll
}: AddCategoryModalProps) {
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const formattedValue = (Number(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return formattedValue;
  };

  const handleValueChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setNovoValor(numericValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Adicionar Categoria
            {isAddingToAll && (
              <Badge variant="secondary" className="ml-2">
                Todos os períodos
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={novaCategoria} 
              onValueChange={(value) => {
                setNovaCategoria(value);
                const selectedCategory = categories.find(cat => cat.id === value);
                if (selectedCategory) {
                  setCategoryName(selectedCategory.name);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor Orçado
            </Label>
            <div className="relative">
              <Input
                id="value"
                type="text"
                placeholder="R$ 0,00"
                value={novoValor ? formatCurrency(novoValor) : ''}
                onChange={(e) => handleValueChange(e.target.value)}
                className="pl-8"
              />
              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Digite o valor que você planeja gastar nesta categoria
            </p>
          </div>

          {isAddingToAll && (
            <div className="p-4 rounded-lg bg-info/10 border border-info/20">
              <p className="text-sm text-info-foreground">
                <strong>Atenção:</strong> Esta categoria será adicionada a todos os períodos do planejamento 
                com o mesmo valor orçado.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm} 
            className="bg-gradient-primary hover:opacity-90"
            disabled={!novaCategoria || !novoValor}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}