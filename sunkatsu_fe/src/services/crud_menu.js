import axios from "axios";
import Cookies from "js-cookie";

//gk dipake

export const getAllMenu = (callback) => { 
    axios
        .get("/api/menu")
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
}

export const getMenuById = (id, callback) => {
    axios
        .get(`/api/menu/${id}`)
        .then((response) => {
            console.log(response.data);
            callback(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
}

export const createMenu = (data, callback) => {
    const token = Cookies.get("token");

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    axios
        .post("/api/menu", data, config)
        .then((response) => {
            console.log(response.data);
            callback(response.data);
        })
        .catch((error) => {
            console.log(false, error);
        });
}

export const editMenu = (id, data, callback) => {
    const token = Cookies.get("token");

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    axios
        .put(`/api/menu/${id}`, data, config)
        .then((response) => {
            console.log(response.data);
            callback(response.data);
        })
        .catch((error) => {
            console.log(false, error);
        });
}

export const deleteMenu = (id, callback) => { 
    const token = Cookies.get("token");

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    axios
        .delete(`/api/menu/${id}`, config)
        .then((response) => {
            console.log(response.data);
            callback(response.data);
        })
        .catch((error) => {
            console.log(false, error);
        });
}