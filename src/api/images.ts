import { apiRequest, getToken, API_URL } from "./client.ts";


export interface ApiImage {
    id: string;
    file_path: string | null;
    external_url: string | null;
    message: string;
    likes: number;
    createdAt: string;
    liked_by_user: boolean;
    owned_by_user: boolean;
    flagged_by_user: boolean;
}

export const imageApi = {
    getImages: () => 
        apiRequest<{ images: ApiImage[] }>('images'),

    uploadImage: async (file: File, message?: string) => {
        const formData = new FormData();
        formData.append('image', file);
        if (message) {
            formData.append('message', message);
        }

        const token = await getToken();

        return fetch(`${API_URL}/images/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });
    },

    addGif: async (src: string, message?: string) => {
        const formData = new FormData();
        formData.append('external_url', src);
        if (message) {
            formData.append('message', message);
        }

        const token = await getToken();

        return fetch(`${API_URL}/images/upload/gif`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
    },

    deleteImage: (id: string) =>
        apiRequest<{ success: boolean }>(`images/${id}`, {
            method: 'DELETE'
        }),
    
    likeImage: (id: string) =>
        apiRequest<{ success: boolean; likes: number }>(`images/${id}/like`, {
            method: 'POST'
        }),
    
    unlikeImage: (id: string) =>
        apiRequest<{ success: boolean; likes: number }>(`images/${id}/like`, {
            method: 'DELETE'
        }),
    
    flagImage: (id: string) =>
        apiRequest<{ success: boolean }>(`images/${id}/flag`, {
            method: 'POST'
        })
};