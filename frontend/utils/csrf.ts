import Cookies from "js-cookie";

export async function fetchCsrfToken(): Promise<string | null> {
    try {
        const response = await fetch(
            "http://localhost:9500/deliveryboy/csrf-token",
            {
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        Cookies.set("XSRF-TOKEN", data.csrfToken);
        return data.csrfToken;
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
        return null;
    }
}

export const getCsrfToken = async () => {
    let token = Cookies.get("XSRF-TOKEN");
    if (!token) {
        token = await fetchCsrfToken();
    }
    return token;
};
