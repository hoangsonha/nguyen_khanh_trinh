import { get, post, put, remove } from "../utils/request";

const API = "/api/v1/employees";

const API_ROLE = "/api/v1/roles";

export const getEmployees = async () => {
  try {
    const res = await get(API);
    return res;
  } catch (e) {
    console.error("Lỗi khi getEmployees:", e);
    return [];
  }
};

export const getEmployeeById = async (id) => {
  try {
    const res = await get(`${API}/${id}`);
    return res;
  } catch (e) {
    console.error("Lỗi khi getEmployee:", e);
  }
};

export const getRoles = async () => {
  try {
    const res = await get(API_ROLE);
    return res;
  } catch (e) {
    console.error("Lỗi khi getRole:", e);
    return [];
  }
};

export const createEmployee = async (params) => {
  try {
    const res = await post(API, params);
    return res;
  } catch (e) {
    console.error("Lỗi khi createEmployee:", e);
  }
};

export const updateEmployee = async (params, id) => {
  try {
    const res = await put(`${API}/${id}`, params);
    return res;
  } catch (e) {
    console.error("Lỗi khi updateEmployee:", e);
  }
};

export const deleteEmployee = async (id) => {
  try {
    const res = await remove(`${API}/${id}`);
    return res;
  } catch (e) {
    console.error("Lỗi khi deleteEmployee:", e);
  }
};

export const restoreEmployee = async (id) => {
  try {
    const res = await post(`${API}/restore/${id}`);
    return res;
  } catch (e) {
    console.error("Lỗi khi deleteEmployee:", e);
  }
};
