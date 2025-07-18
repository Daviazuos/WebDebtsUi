

export function decimalAdjust(value) {
  if (value) {
    return (Math.round(value * 100) / 100).toLocaleString('pt-br', { minimumFractionDigits: 2 });
  }
  else if (value === 0) {
    return value.toLocaleString('pt-br', { minimumFractionDigits: 2 });;
  }
  else {
    return ''
  }

}

export function decimalAdjustWithoutPoint(value) {
  if (value.toString().includes('.')) {
    return decimalAdjust(value);
  }
  return (value / 100).toFixed(2).replace('.', ',');
  
}

export function converteMoedaFloat(valor){
  if(valor === ""){
     valor =  0;
  }else{
     valor = valor.replace(".","");
     valor = valor.replace(",",".");
     valor = parseFloat(valor);
  }
  return valor;
}

export function addLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, '0');
}