import React, { useState } from "react";
export const Context = React.createContext({});

//Context para realizar la vista de servicio
export default function ContextProvider({ children }) {
  let data = {
    loginState: true,
    name: null,
    temporalUser: null,
    dataUser: null,
  };
  const [appState, setAppState] = useState(data);
  return (
    <Context.Provider value={{ appState, setAppState }}>
      {children}
    </Context.Provider>
  );
}