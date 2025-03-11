import { getCsrfToken } from "./csrf";
import Cookies from "js-cookie";

export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const csrfToken = await getCsrfToken();

    const headers = {
        ...options.headers,
        "X-CSRF-Token": csrfToken || "",
    };

    const config: RequestInit = {
        ...options,
        credentials: "include",
        headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        // Handle CSRF token errors specifically
        if (response.status === 403) {
            // Try to refresh the token and retry the request once
            const newToken = await getCsrfToken();
            if (newToken) {
                const newHeaders = {
                    ...options.headers,
                    "X-CSRF-Token": newToken,
                };

                const newConfig: RequestInit = {
                    ...options,
                    credentials: "include",
                    headers: newHeaders,
                };

                return fetch(url, newConfig);
            }
        }

        // For other errors, throw with the response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText);
    }

    return response;
};

export async function apiRequest(url: string, options: RequestInit = {}) {
    const csrfToken = Cookies.get("XSRF-TOKEN");
    if (!csrfToken) {
        throw new Error("CSRF token not found");
    }

    const defaultOptions: RequestInit = {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
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
