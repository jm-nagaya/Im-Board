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
        // Get a presigned URL from the backend
        const token = await getToken();
        const presignResponse = await fetch(`${API_URL}/images/presign-upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
            body: JSON.stringify({ fileSize: file.size, fileType: file.type, })
        });
        if (!presignResponse.ok) {
            const errorText = await presignResponse.json();
            throw new Error( errorText?.error || 'Failed to get presigned URL');
        }

        const { presignedUrl } = await presignResponse.json();

        // Upload the file to S3 using the presigned URL
        const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            body: file
        });

        if (!uploadResponse.ok) {
            const errorText = await presignResponse.json();
            throw new Error( errorText?.error || 'Failed to upload image to S3');
        }

        // Notify the backend that the upload is complete
        const completeResponse = await fetch(`${API_URL}/images/complete-upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
            body: JSON.stringify({ message })
        });
        if (!completeResponse.ok) {
            const errorText = await completeResponse.json();
            throw new Error( errorText?.error || 'Failed to complete image upload');
        }

        return completeResponse;
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