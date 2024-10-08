import moment from 'moment';

export function dateAdjust(t) {
    if (t != null){
        const dateParsed = new Date(t)
        const date = ('0' + dateParsed.getDate()).slice(-2);
        const month = ('0' + (dateParsed.getMonth() + 1)).slice(-2);
        const year = dateParsed.getFullYear();
        return `${date}/${month}/${year}`;
    }
  }

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('/');
}

export function monthByNumber(number) {
    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
      ];
    return meses[parseInt(number-1)]
}

export function getLessMonthYearByMonth(month, subtract, year) {
  if ((month - subtract) < 1) {
    return [12 + (month - subtract), year-1]
  }
  return [month - subtract, year]
}

export function addYearsToDate(date, years) {
  const dateParsed = new Date(date)
  return formatDate(dateParsed.setFullYear(dateParsed.getFullYear() + parseInt(years)));
}

export function addMonthsToDate(date, months) {
  const dateParsed = moment(date).add(parseInt(months), 'months').format('DD/MM/YYYY');
  return dateParsed;
}

export function addMonthsToMonth(month, months) { 
  if (month == 12) {
    return 1
  }
  return parseInt(month) + parseInt(months)
}

export function addOrRemoveMonth(number, month) {
  number = parseInt(number)
  month = parseInt(month)

  let response = number + month
  if (month == 12) {
    if (number > 0) {
      response = 1 + number
    }
  }
  else if (month == 1) {
    if (number < 0) {
      response = 13 + number
    }
  }
  return response 
}