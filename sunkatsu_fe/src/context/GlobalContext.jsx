import { createContext, useEffect, useState } from "react";
import { getAllMenu } from "../services/crudMenu";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(true);
  const [input, setInput] = useState({
    name: "",
    desc: "",
    price: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    if (fetchStatus) {
      getAllMenu((data) => {
        setMenu(data);
      });
      setFetchStatus(false);
    }
  }, [fetchStatus, setFetchStatus]);

  return (
    <GlobalContext.Provider
      value={{
        menu,
        setMenu,
        input,
        setInput,
        fetchStatus,
        setFetchStatus,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
