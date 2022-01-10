export function statusTransform(status) {
    if (status == 'Paid'){
        return 'Pago'
    }
    else{
        return 'Pendente'
    }
  }
