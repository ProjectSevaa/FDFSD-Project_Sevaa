import Cookies from "js-cookie";

export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const config: RequestInit = {
        ...options,
        credentials: "include",
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText);
    }

    return response;
};

export async function apiRequest(url: string, options: RequestInit = {}) {
    const defaultOptions: RequestInit = {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    };

    return fetch(url, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        },
    });
}
