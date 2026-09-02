import { fetchAuthSession } from "aws-amplify/auth";

export const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';
export const BUCKET_URL = process.env.REACT_APP_BACKEND_URL;

export const getToken = async (): Promise<string | null> => {
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        return token || null;
    } catch (error) {
        console.error('Failed to get token');
        return null;
    }
};

export const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    const token = await getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const mergedHeaders = {
        ...headers,
        ...(options.headers as Record<string, string> || {})
    };

    const response = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers: mergedHeaders
        // credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
};