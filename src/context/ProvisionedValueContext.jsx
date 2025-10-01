import React, { createContext, useContext, useState } from "react";

const ProvisionedValueContext = createContext();

export function ProvisionedValueProvider({ children }) {
  const [provisionedValue, setProvisionedValue] = useState(0);

  return (
    <ProvisionedValueContext.Provider value={{ provisionedValue, setProvisionedValue }}>
      {children}
    </ProvisionedValueContext.Provider>
  );
}

export function useProvisionedValue() {
  return useContext(ProvisionedValueContext);
}