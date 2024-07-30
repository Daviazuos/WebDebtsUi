import React, { createContext, useContext, useState, useEffect } from 'react';

// Criar o contexto
const GlobalContext = createContext();

// Criar o provider para o contexto
export const GlobalProvider = ({ children }) => {
  const [sharedValue, setSharedValue] = useState(() => {
    try {
      const item = window.localStorage.getItem('sharedKey');
      return item ? JSON.parse(item) : '';
    } catch (error) {
      console.error(error);
      return '';
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('sharedKey', JSON.stringify(sharedValue));
    } catch (error) {
      console.error(error);
    }
  }, [sharedValue]);

  return (
    <GlobalContext.Provider value={{ sharedValue, setSharedValue }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Criar um hook para usar o contexto mais facilmente
export const useGlobalContext = () => useContext(GlobalContext);
