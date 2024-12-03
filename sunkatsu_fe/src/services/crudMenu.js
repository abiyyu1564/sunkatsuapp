import axios from "axios";
import Cookies from "js-cookie";

export const getAllMenu = (callback) => {
  axios
    .get("https://sunkatsu-sunkatsu.azuremicroservices.io/api/menus")
    .then((res) => {
      callback(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getMenuById = async (id, callback) => {
  axios
    .get(`https://sunkatsu-sunkatsu.azuremicroservices.io/api/menus/${id}`)
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
    .post(
      "https://sunkatsu-sunkatsu.azuremicroservices.io/api/menus",
      data,
      config
    )
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
    .put(
      `https://sunkatsu-sunkatsu.azuremicroservices.io/api/menus/${id}`,
      data,
      config
    )
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
    .delete(
      `https://sunkatsu-sunkatsu.azuremicroservices.io/api/menus/${id}`,
      config
    )
    .then((res) => {
      callback(res.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
