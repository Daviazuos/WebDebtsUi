export function statusTransform(status) {
    if (status == 'Paid') {
        return 'Pago'
    }
    else {
        return 'A pagar'
    }
}

export function debtInstallmentTransform(status) {
    if (status == 'Fixed') {
        return 'Fixa'
    }
    else if (status == 'Installment') {
        return 'Parcelado'
    }
    else if (status == 'Simple') {
        return 'Simples'
    }
}

export function debtTypeTransform(status) {
    if (status == 'Card') {
        return 'Cartão de crédito'
    }
    else if (status == 'Simple') {
        return 'Simples'
    }
}

export function debtInstallmentTypeToNumber(debtType) {
    if (debtType == 'Simple') {
        return '2'
    }
    else if (debtType == 'Fixed') {
        return '1'
    }
    else if (debtType == 'Installment') {
        return '0'
    }
    else {
        return ''
    }
}

export function walletStatusTransform(status) {
    if (status == 'Enable') {
        return 'Ativo'
    }
    else if (status == 'Disable') {
        return 'Desativado'
    }
    else if (status == 'Received') {
        return 'Recebido'
    }
    else if (status == 'Pending') {
        return 'Pendente'
    }
    else if (status == 'ToReceive') {
        return 'Á receber'
    }
}

export function walletInstallmentStatusTransform(status) {
    if (status == true) {
        return 'Recebido'
    }
    else if (status == false) {
        return 'Á receber'
    }
}

export function getMonthDifference(startDate, endDate) {
    const startDateUpdated = new Date(startDate)

    if (startDate !== undefined && endDate !== undefined){
        return (
            endDate.getMonth() -
            startDateUpdated.getMonth() +
            12 * (endDate.getFullYear() - startDateUpdated.getFullYear())
          );
    }
    return 0
   
  }