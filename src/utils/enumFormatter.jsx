export function statusTransform(status) {
    if (status == 'Paid') {
        return 'Pago'
    }
    else {
        return 'Pendente'
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