import api from './index';

// 提取公共方法，数据处理，错误处理等
export const login = async (email: string, password: string) => {
    return await api.post('/users/login', { email, password })
};

export const register = async (name: string, email: string, password: string) => {
    return await api.post('/users/register', { name, email, password })
};