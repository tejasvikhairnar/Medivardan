import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://bmetrics.in/APIDemo",
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;

        // Clean empty params: remove keys with undefined, null or empty string values
        if (config.params && typeof config.params === 'object') {
            Object.keys(config.params).forEach((key) => {
                const val = config.params[key];
                if (val === undefined || val === null) {
                    delete config.params[key];
                } else if (typeof val === 'string' && val.trim() === '') {
                    delete config.params[key];
                }
            });
            // If no params remain, delete the params object entirely
            if (Object.keys(config.params).length === 0) delete config.params;
        }

        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
            const fullUrl = `${config.baseURL}${config.url}`;
            console.log('[Axios Request]', {
                method: config.method?.toUpperCase(),
                url: fullUrl,
                params: config.params,
                data: config.data,
            });
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Enhanced error logging - log the entire error object first
        console.error('[Axios Error - Full Details]', error);

        if (error.response) {
            // Server responded with error status
            const errorDetails = {
                status: error.response.status || 'unknown',
                statusText: error.response.statusText || 'unknown',
                url: error.config?.url || 'unknown',
                fullUrl: (error.config?.baseURL || '') + (error.config?.url || ''),
                method: error.config?.method?.toUpperCase() || 'unknown',
                responseData: error.response.data || 'no data',
                headers: error.response.headers || 'no headers',
            };
            console.error('[Axios Error Response]', errorDetails);

            // Handle specific HTTP status codes
            switch (error.response.status) {
                case 401:
                    // Token expired or unauthorized
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("userID");
                    // Redirect to login page
                    if (typeof window !== 'undefined') {
                        window.location.href = '/';
                    }
                    break;
                case 403:
                    // Forbidden
                    console.error("Access forbidden");
                    break;
                case 404:
                    // Not found - likely endpoint doesn't exist
                    console.error("❌ 404 Endpoint not found. Check your API URL and endpoint path.");
                    console.error("Full URL attempted:", errorDetails.fullUrl);
                    break;
                case 500:
                    // Server error
                    console.error("Server error occurred");
                    console.error("Full URL attempted:", errorDetails.fullUrl);
                    break;
                default:
                    break;
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('[Axios Network Error]', {
                message: 'No response received from server',
                url: error.config?.url,
                fullUrl: error.config?.baseURL + error.config?.url,
                request: error.request,
            });
        } else {
            console.error('[Axios Error]', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;