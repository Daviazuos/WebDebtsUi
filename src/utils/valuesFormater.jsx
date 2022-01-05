

export function decimalAdjust(value) {
    if (value){
      return (Math.round(value * 100) / 100).toFixed(2);
    }
    else {
      return value
    }
    
  }