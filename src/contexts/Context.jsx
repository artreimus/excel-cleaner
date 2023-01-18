import { useState, useContext, createContext } from 'react';

const Context = createContext({});

function useProvideContext() {
  return useContext(Context);
}

function ContextProvider({ children }) {
  const [ioAssignmentGrps, setIOAssignmentGrps] = useState({});
  const [aoAssignmentGrps, setAOAssignmentGrps] = useState({});

  const value = {
    ioAssignmentGrps,
    setIOAssignmentGrps,
    aoAssignmentGrps,
    setAOAssignmentGrps,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export { ContextProvider, useProvideContext };
