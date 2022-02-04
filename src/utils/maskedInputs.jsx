import React from "react";
import IntlCurrencyInput from "react-intl-currency-input"
import { FormControl } from "react-bootstrap";

const currencyConfig = {
    locale: "pt-BR",
    formats: {
      number: {
        BRL: {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
  };

export default function MaskedFormControl(props) {
  return <FormControl as={IntlCurrencyInput} config={currencyConfig} {...props} />;
}