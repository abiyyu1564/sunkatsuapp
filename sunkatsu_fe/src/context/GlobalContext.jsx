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

  const formatRupiah = (angka, prefix) => {
    let number_string = angka.toString().replace(/[^,\d]/g, "");
    let split = number_string.split(",");
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      let separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;

    return prefix == null ? rupiah : rupiah ? "Rp " + rupiah : "";
  };

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
