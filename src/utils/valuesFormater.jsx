

export function decimalAdjust(value) {
    if (value){
      return (Math.round(value * 100) / 100).toLocaleString('pt-br', {minimumFractionDigits: 2});
    }
    else if (value === 0) {
      return value.toLocaleString('pt-br', {minimumFractionDigits: 2});;
    }
    
  }