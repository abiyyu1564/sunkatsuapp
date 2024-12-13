import axios from "axios";
import Cookies from "js-cookie";

export const getAllMenu = (callback) => {
  axios
    .get("http://localhost:8080/api/menus", {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
    .then((res) => {
      callback(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getMenuById = async (id, callback) => {
  axios
    .get(`http://localhost:8080/api/menus/${id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createMenu = async (data, callback) => {
  const token = Cookies.get("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .post("http://localhost:8080/api/menus", data, config)
    .then((res) => {
      callback(res.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateMenu = async (id, data, callback) => {
  const token = Cookies.get("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .put(`http://localhost:8080/api/menus/${id}`, data, config)
    .then((res) => {
      callback(res.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteMenu = async (id, callback) => {
  const token = Cookies.get("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .delete(`http://localhost:8080/api/menus/${id}`, config)
    .then((res) => {
      callback(res.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
