import { get, post, put, remove } from "../utils/request";

const API = "/api/v1/employees";

const API_ROLE = "/api/v1/roles";

export const getEmployees = async () => {
  try {
    const res = await get(API + "/non-paging");
    return res;
  } catch (error) {
        console.log(error);
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
  } catch (error) {
    if (error.response) {
        console.error("Error response from server:", error.response.data);
        return error.response.data;
    } else {
        console.error("Unexpected error:", error);
        return { status: "Fail", message: "Unexpected error occurred.", data: null };
    }
  }
};

export const updateEmployee = async (params, id) => {
  try {
    const res = await put(`${API}/${id}`, params);
    return res;
  } catch (error) {
    if (error.response) {
        console.error("Error response from server:", error.response.data);
        return error.response.data;
    } else {
        console.error("Unexpected error:", error);
        return { status: "Fail", message: "Unexpected error occurred.", data: null };
    }
  }
};

export const deleteEmployee = async (id) => {
  try {
    const res = await remove(`${API}/${id}`);
    return res;
  } catch (error) {
        if (error.response) {
            console.error("Error response from server:", error.response.data);
            return error.response.data;
        } else {
            console.error("Unexpected error:", error);
            return { status: "Fail", message: "Unexpected error occurred.", data: null };
        }
    }
};

export const restoreEmployee = async (id) => {
  try {
    const res = await post(`${API}/${id}/restore`);
    return res;
  } catch (error) {
        if (error.response) {
            console.error("Error response from server:", error.response.data);
            return error.response.data;
        } else {
            console.error("Unexpected error:", error);
            return { status: "Fail", message: "Unexpected error occurred.", data: null };
        }
    }
};
