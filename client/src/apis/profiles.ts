import api from './index';

export const getProfileById = async (userId: string) => {
    return await api.get(`/profiles/${userId}`);
};

export const getProfile = async () => {
    return await api.get(`/profiles`);
};

export const serchProfiles = async (query: any = {}) => {
    return await api.post(`/profiles/search`, query);
};

export const deleteOneProfile = async (userId: string) => {
    return await api.get(`profiles/delete/${userId}`);
};

export const deleteManyProfiles = async (ids: any = {}) => {
    return await api.post(`profiles/delete`, ids);
};

export const insertOneProfile = async (param: any = {}) => {
    return await api.post(`profiles/insertOne`, param);
};

export const insertManyProfiles = async (params: any[] = []) => {
    return await api.post(`profiles/insertMany`, params);
};

export const updateOneProfile = async (userId: string, param: any = {}) => {
    console.log(param, 'param------')
    return await api.post(`profiles/edit/${userId}`, param);
};




