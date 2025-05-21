import { get, post, put, remove } from "../utils/request";

const API = "/api/v1/projects";

const API_EMPLOYEE = "/api/v1/employees";

const API_TASK = "/api/v1/tasks";

export const getEmployees = async () => {
  try {
    const res = await get(API_EMPLOYEE + "/non-paging");
    return res;
  } catch (error) {
        console.log(error);
        return [];
    }
};

export const getProjectByEmployeeID = async (id, params) => {
  try {
    const res = await get(`${API}/${id}/employee`, { params: params });
    return res;
  } catch (e) {
    console.error("Lỗi khi getEmployee:", e);
  }
};

export const searchProjectByEmployeeId = async (id, params) => {
  try {

    const res = await get(API + `/search/${id}/employee`, { params: params });
    return res;
  } catch (error) {
        console.log(error);
        return [];
    }
};

export const getProjectPaging = async (params) => {
  try {

    const res = await get(API, { params: params });
    return res;
  } catch (error) {
        console.log(error);
        return [];
    }
};

export const searchProject = async (params) => {
  try {

    const res = await get(API + '/search', { params: params });
    return res;
  } catch (error) {
        console.log(error);
        return [];
    }
};


export const getProjectById = async (id) => {
  try {
    const res = await get(`${API}/${id}`);
    return res.data;
  } catch (e) {
    console.error("Lỗi khi getEmployee:", e);
  }
};

// export const getRoles = async () => {
//   try {
//     const res = await get(API_ROLE);
//     return res;
//   } catch (e) {
//     console.error("Lỗi khi getRole:", e);
//     return [];
//   }
// };

export const createProject = async (params) => {
  try {
    const res = await post(API, params);
    return res.data;
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

export const updateProject = async (params, id) => {
  try {
    const res = await put(`${API}/${id}`, params);
    return res.data;
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

export const deleteProject = async (id) => {
  try {
    const res = await remove(`${API}/${id}`);
    return res.data.data;
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

export const restoreProject = async (id) => {
  try {
    const res = await post(`${API}/${id}/restore`);
    return res.data.data;
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
