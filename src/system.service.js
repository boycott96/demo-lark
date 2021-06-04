import Axios from 'axios';

/**
 * 部门
 * @param {*} params 
 * @returns 
 */
export const addDept = params => {
    return Axios.post('/v1/dept', params);
}

export const searchDept = params => {
    return Axios.get('/v1/dept', { params });
}

export const deleteDept = params => {
    return Axios.delete('v1/dept', { params });
}

export const editDept = params => {
    return Axios.put('/v1/dept', params);
}

/**
 * 用户
 * @param {*} params 
 * @returns 
 */
export const addUser = params => {
    return Axios.post('/v1/user', params);
}

export const searchUser = params => {
    return Axios.get('/v1/user', { params });
}

export const deleteUser = params => {
    return Axios.delete('/v1/user', { params });
}

export const editUser = params => {
    return Axios.put('/v1/user', params);
}