

export function dateAdjust(t) {
    console.log(t)
    if (t != null){
        const dateParsed = new Date(t)
        console.log(dateParsed)
        const date = ('0' + dateParsed.getDate()).slice(-2);
        const month = ('0' + (dateParsed.getMonth() + 1)).slice(-2);
        const year = dateParsed.getFullYear();
        return `${date}/${month}/${year}`;
    }
  }