// src/api/init.ts

import { BASE_URL, TIMEOUT } from "@/constants/api";

// 全局请求拦截器
const requestInterceptor = (config: RequestInit): RequestInit => {
    // console.log('我是请求拦截器');
    return config;
};

// 全局响应拦截器
async function responseInterceptor<T>(response: Response | Error, jsonFlag = true): Promise<T> {
    // console.log('我是响应拦截器');

    // 如果是错误对象（如超时错误）
    if (response instanceof Error) {
        return Promise.reject({
            type: 'NETWORK_ERROR',
            message: response.message,
        });
    }
    // 检查响应状态码
    if (!response.ok) {
        const errorData = await response.json().catch((err) => console.log(err)); // 尝试解析错误信息
        return Promise.reject({
            type: 'HTTP_ERROR',
            status: response.status,
            message: `HTTP error! status: ${response.status}`,
            data: errorData,
        });
    }
    return jsonFlag ? (response.json() as Promise<T>) : (response as unknown as Promise<T>);
}

// 函数重载声明
export async function customFetch(url: string, config?: RequestInit, jsonFlag?: false,controller?:AbortController): Promise<Response>;
export async function customFetch<T>(url: string, config?: RequestInit, jsonFlag?: true,controller?:AbortController): Promise<T>;
export async function customFetch(url: string, config: RequestInit = {}, jsonFlag = true,controller = new AbortController()): Promise<Response> {
    // 拼接 baseURL
    const separator = url.includes('?') ? '&' : '?';
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}${separator}time=${new Date().getTime()}`;

    // 创建 AbortController 用于超时控制
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
        // 应用全局请求拦截器
        const modifiedConfig = requestInterceptor({
            ...config,
            signal: controller.signal, // 将 AbortSignal 添加到配置中
        });

        // 发起请求
        const response = await fetch(fullUrl, modifiedConfig);

        // 清除超时定时器
        clearTimeout(timeoutId);

        // 应用全局响应拦截器
        return responseInterceptor(response, jsonFlag);
    } catch (error: any) {
        // 清除超时定时器
        clearTimeout(timeoutId);

        // 将错误传递给响应拦截器
        return responseInterceptor(error, jsonFlag);
    }
}