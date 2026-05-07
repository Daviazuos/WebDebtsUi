# Invoice Reconciliation Modal

> Componente para reconciliação de fatura de cartão de crédito com validação automática de lançamentos.

## 📋 Funcionalidades

✅ Campo para inserir o total da fatura do banco  
✅ Exibição automática do total lançado (soma das transações)  
✅ Cálculo automático da diferença  
✅ Mensagens condicionais de status  
✅ Detecção de possíveis duplicatas  
✅ Modo checklist com seleção individual de transações  
✅ Abas de visualização (resumo, detalhado, checklist, duplicados)  
✅ Formatação automática de moeda em padrão brasileiro  
✅ Sem dependências externas além do React Bootstrap  
✅ Código limpo com funções puras reutilizáveis  

## 📁 Estrutura de Arquivos

```
src/components/invoiceReconciliation/
├── InvoiceReconciliationModal.jsx          # Componente principal
├── InvoiceReconciliationModal.css          # Estilos do modal
├── invoiceReconciliationUtils.js           # Funções utilitárias
├── index.js                                 # Arquivo de exportação
└── README.md                                # Este arquivo
```

## 🚀 Como Usar

### 1. Importar o componente

```jsx
import { InvoiceReconciliationModal } from '../../components/invoiceReconciliation';
```

### 2. Adicionar estado no seu componente

```jsx
const [showInvoiceModal, setShowInvoiceModal] = useState(false);
```

### 3. Adicionar o comando para abrir o modal

```jsx
<Button 
  variant='custom' 
  onClick={() => setShowInvoiceModal(true)}
  className='btn-custom'
>
  <i className="fas fa-receipt"></i> Conferir Fatura
</Button>
```

### 4. Incluir o componente no JSX

```jsx
<InvoiceReconciliationModal
  show={showInvoiceModal}
  handleClose={() => setShowInvoiceModal(false)}
  transactions={installments.items || []}
  totalLancado={cardMonthValue.get(selectedCard.id)?.totalValue || 0}
  valueKey="value"
  dateKey="date"
  nameKey="debtName"
  idKey="id"
  statusKey="status"
/>
```

## 📊 Props do Componente

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `show` | boolean | ✅ | Controla visibilidade do modal |
| `handleClose` | function | ✅ | Função chamada ao fechar o modal |
| `transactions` | array | ❌ | Array de transações a reconciliar |
| `totalLancado` | number | ❌ | Total pré-calculado das transações |
| `valueKey` | string | ❌ | Chave do valor na transação (padrão: 'value') |
| `dateKey` | string | ❌ | Chave da data na transação (padrão: 'date') |
| `nameKey` | string | ❌ | Chave do nome na transação (padrão: 'debtName') |
| `idKey` | string | ❌ | Chave do ID na transação (padrão: 'id') |
| `statusKey` | string | ❌ | Chave do status na transação (padrão: 'status') |

## 🔧 Funções Utilitárias

### `calculateTotal(transactions, valueKey)`
Calcula o total de todas as transações.

```jsx
const total = calculateTotal(transactions, 'value');
// Resultado: 1234.56
```

### `calculateDifference(totalFatura, totalLancado)`
Calcula a diferença entre a fatura e o total lançado.

```jsx
const diff = calculateDifference(1500.00, 1234.56);
// Resultado: 265.44 (faltam lançamentos)
```

### `getDifferenceMessage(difference)`
Retorna mensagem e tipo baseado na diferença.

```jsx
const { message, type } = getDifferenceMessage(265.44);
// Resultado: { 
//   message: '⚠ Faltam lançamentos: R$ 265.44',
//   type: 'warning'
// }
```

### `detectDuplicates(transactions, valueKey, dateKey, idKey)`
Detecta possíveis duplicatas (mesmo valor + mesma data).

```jsx
const duplicates = detectDuplicates(transactions, 'value', 'date', 'id');
// Resultado: [
//   [
//     { id: 1, debtName: 'Item A', value: 100, date: '2024-01-15' },
//     { id: 2, debtName: 'Item A', value: 100, date: '2024-01-15' }
//   ]
// ]
```

### `calculateSelectedTotal(transactions, selectedIds, valueKey, idKey)`
Calcula o total das transações selecionadas no checklist.

```jsx
const selectedTotal = calculateSelectedTotal(transactions, [1, 3, 5], 'value', 'id');
// Resultado: 567.89
```

### `groupTransactionsByDate(transactions, dateKey)`
Agrupa transações por data.

```jsx
const grouped = groupTransactionsByDate(transactions, 'date');
// Resultado: {
//   '2024-01-15': [...],
//   '2024-01-20': [...]
// }
```

### `formatCurrency(value)`
Formata número para padrão brasileiro de moeda.

```jsx
const formatted = formatCurrency(1234.56);
// Resultado: "R$ 1.234,56"
```

### `formatDate(date)`
Formata data para padrão brasileiro.

```jsx
const formatted = formatDate('2024-01-15');
// Resultado: "15/01/2024"
```

## 💡 Exemplo Completo

```jsx
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { InvoiceReconciliationModal } from '../../components/invoiceReconciliation';

function CreditCardSelected() {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [installments, setInstallments] = useState({
    items: [
      { id: 1, debtName: 'Compra 1', value: 150.00, date: '2024-01-10', status: 'pending' },
      { id: 2, debtName: 'Compra 2', value: 200.00, date: '2024-01-15', status: 'pending' },
      { id: 3, debtName: 'Compra 3', value: 100.00, date: '2024-01-20', status: 'pending' },
    ]
  });

  return (
    <>
      <Button 
        onClick={() => setShowInvoiceModal(true)}
        className="mb-3"
      >
        <i className="fas fa-receipt"></i> Conferir Fatura
      </Button>

      <InvoiceReconciliationModal
        show={showInvoiceModal}
        handleClose={() => setShowInvoiceModal(false)}
        transactions={installments.items}
        valueKey="value"
        dateKey="date"
        nameKey="debtName"
        idKey="id"
      />
    </>
  );
}

export default CreditCardSelected;
```

## 🎨 Abas Disponíveis

### 📊 Resumo
Visão rápida com:
- Quantidade de transações
- Total lançado
- Total da fatura
- Status da reconciliação

### 📋 Detalhado
Tabela completa com:
- Descrição de cada transação
- Valores individuais
- Datas de compra
- Total no rodapé

### ✅ Checklist
Modo de validação com:
- Checkboxes para uma seleção
- Contador de selecionados
- Total selecionado
- Saldo restante

### ⚠️ Duplicados
Lista de possíveis duplicatas:
- Agrupados por valor e data
- Detalhes de cada transação
- Aviso visual destacado

## 🎯 Mensagens de Status

| Status | Mensagem | Tipo |
|--------|----------|------|
| Fatura conferida | ✓ Fatura conferida com sucesso | success |
| Faltam lançamentos | ⚠ Faltam lançamentos: R$ X,XX | warning |
| Valor excedente | ✗ Valor lançado maior que a fatura: R$ X,XX | danger |

## 📱 Design Responsivo

O componente é totalmente responsivo e funciona bem em:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

## 🔒 Segurança

- ✅ Sem uso de `eval()` ou código dinâmico perigoso
- ✅ Validação de entrada de valores
- ✅ Componente controlado (sem estado global)
- ✅ Props tipadas implicitamente

## 🎓 Aprendizado

Este componente demonstra:
- ✅ React Hooks (useState, useMemo)
- ✅ Funções puras e reutilizáveis
- ✅ Programação funcional
- ✅ Separação de responsabilidades
- ✅ CSS moderno com Flexbox
- ✅ Boas práticas de React

## 🐛 Troubleshooting

### Modal não aparece
Certifique-se de que:
- A props `show` está como `true`
- O componente está dentro do retorno JSX
- Bootstrap CSS está importado

### Valores não calculam corretamente
- Verifique se `valueKey` corresponde ao nome da chave na sua transação
- Certifique-se de que os valores são números (não strings)
- Se estiverem como strings, converta com `parseFloat()`

### Duplicados não aparecem
- Verifique se `dateKey` tem o mesmo formato em todas as transações
- A comparação é exata (case-sensitive)
- Certifique-se de que há pelo menos 2 transações com mesmo valor e data

## 📝 Licença

Livre para uso em projetos pessoais e comerciais.

## 🤝 Suporte

Para dúvidas ou problemas, verifique:
1. Se todas as props obrigatórias foram passadas
2. Se a estrutura de dados das transações está correta
3. Se o React Bootstrap está instalado e importado
4. Se o arquivo CSS está sendo carregado

---

**Desenvolvido com ❤️ para facilitar reconciliação de faturas**
