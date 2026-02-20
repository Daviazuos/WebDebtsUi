/**
 * Funções utilitárias para reconciliação de fatura
 * Todas as funções são puras (sem efeitos colaterais)
 */

/**
 * Calcula o total das transações
 * @param {Array} transactions - Array de transações
 * @param {string} valueKey - Chave do valor na transação (padrão: 'value')
 * @returns {number} Total das transações
 */
export const calculateTotal = (transactions = [], valueKey = 'value') => {
  if (!Array.isArray(transactions)) return 0;
  
  return transactions.reduce((sum, transaction) => {
    const value = parseFloat(transaction?.[valueKey]) || 0;
    return sum + value;
  }, 0);
};

/**
 * Calcula a diferença entre totalFatura e totalLancado
 * @param {number} totalFatura - Total da fatura do banco
 * @param {number} totalLancado - Total das transações lançadas
 * @returns {number} Diferença (positiva, negativa ou zero)
 */
export const calculateDifference = (totalFatura = 0, totalLancado = 0) => {
  return parseFloat(totalFatura) - parseFloat(totalLancado);
};

/**
 * Retorna mensagem de status baseada na diferença
 * @param {number} difference - Diferença calculada
 * @returns {Object} { message: string, type: 'success' | 'warning' | 'danger' }
 */
export const getDifferenceMessage = (difference) => {
  const diff = parseFloat(difference) || 0;
  
  if (diff === 0) {
    return {
      message: '✓ Fatura conferida com sucesso',
      type: 'success',
    };
  }
  
  if (diff > 0) {
    return {
      message: `⚠ Faltam lançamentos: R$ ${Math.abs(diff).toFixed(2)}`,
      type: 'warning',
    };
  }
  
  return {
    message: `✗ Valor lançado maior que a fatura: R$ ${Math.abs(diff).toFixed(2)}`,
    type: 'danger',
  };
};

/**
 * Detecta possíveis transações duplicadas
 * Considera duplicada quando: mesmo valor + mesma data de compra
 * @param {Array} transactions - Array de transações
 * @param {string} valueKey - Chave do valor (padrão: 'value')
 * @param {string} dateKey - Chave da data (padrão: 'date')
 * @param {string} idKey - Chave do ID (padrão: 'id')
 * @returns {Array} Array com grupos de possíveis duplicados
 */
export const detectDuplicates = (
  transactions = [],
  valueKey = 'value',
  dateKey = 'date',
  idKey = 'id'
) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }

  // Criar um mapa de chave -> lista de transações
  const duplicateMap = {};
  
  transactions.forEach((transaction) => {
    const value = parseFloat(transaction?.[valueKey]) || 0;
    const date = transaction?.[dateKey] || '';
    const key = `${value.toFixed(2)}_${date}`;
    
    if (!duplicateMap[key]) {
      duplicateMap[key] = [];
    }
    duplicateMap[key].push(transaction);
  });

  // Retornar apenas grupos com mais de uma transação
  return Object.values(duplicateMap).filter((group) => group.length > 1);
};

/**
 * Calcula o total de transações selecionadas
 * @param {Array} transactions - Array de transações
 * @param {Array} selectedIds - IDs das transações selecionadas
 * @param {string} valueKey - Chave do valor (padrão: 'value')
 * @param {string} idKey - Chave do ID (padrão: 'id')
 * @returns {number} Total das transações selecionadas
 */
export const calculateSelectedTotal = (
  transactions = [],
  selectedIds = [],
  valueKey = 'value',
  idKey = 'id'
) => {
  if (!Array.isArray(transactions) || !Array.isArray(selectedIds)) {
    return 0;
  }

  const selectedSet = new Set(selectedIds);
  return transactions.reduce((sum, transaction) => {
    if (selectedSet.has(transaction?.[idKey])) {
      return sum + (parseFloat(transaction?.[valueKey]) || 0);
    }
    return sum;
  }, 0);
};

/**
 * Grupo transações por data para facilitar visualização
 * @param {Array} transactions - Array de transações
 * @param {string} dateKey - Chave da data (padrão: 'date')
 * @returns {Object} Objeto com datas como chaves e transações agrupadas
 */
export const groupTransactionsByDate = (transactions = [], dateKey = 'date') => {
  if (!Array.isArray(transactions)) return {};

  return transactions.reduce((grouped, transaction) => {
    const date = transaction?.[dateKey] || 'Sem data';
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
    return grouped;
  }, {});
};

/**
 * Formata um número para o padrão brasileiro de moeda
 * @param {number} value - Valor a formatar
 * @returns {string} Valor formatado (ex: "1.234,56")
 */
export const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return `R$ ${num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Formata uma data para o padrão brasileiro
 * @param {string | Date} date - Data a formatar
 * @returns {string} Data formatada (ex: "15/03/2024")
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('pt-BR');
};
