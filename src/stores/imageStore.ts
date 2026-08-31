import { create } from 'zustand';
import { imageApi, ApiImage } from '../api/images.ts';
import { API_URL } from '../api/client.ts';
interface ImageItem extends ApiImage {
    x: number;
    y: number;
    zIndex: number;
};

interface ImageState {
    images: ImageItem[];
    selectedImageId: string | null;
    moveImage: (id: string, x: number, y: number) => void;
    bringToFront: (id: string) => void;
    selectImage: (id: string | null) => void;

    loading: boolean;
    error: string | null;
    deleteImage: (id: string) => void;
    fetchImages: () => Promise<void>;
    addBackendImage: (imageData: ApiImage) => void;
    likeImage: (id: string) => void;
    unlikeImage: (id: string) => void;
    flagImage: (id: string) => void;
}

export const useImageStore = create<ImageState>((set) => ({
    images: [],
    selectedImageId: null,
    moveImage: (id, x, y) =>
        set((state) => ({
            images: state.images.map((img) =>
                img.id === id ? { ...img, x, y } : img
            )
        })),
    bringToFront: (id) =>
        set((state) => {
            const maxZ = state.images.reduce((max, img) => Math.max(max, img.zIndex), 0);
            return {
            images: state.images.map((img) =>
            img.id === id ? { ...img, zIndex: maxZ + 1 } : img)
            };
        }),
    selectImage: (id) =>
        set(() => ({
            selectedImageId: id
        })),

    loading: false,
    error: null,
    fetchImages: async () => {
        set({ loading: true, error: null });
        try{
            const data = await imageApi.getImages();

            const boardImages: ImageItem[] = data.images.map((img, index) => ({
                ...img,
                file_path: img.file_path
                    ? `${API_URL}/uploads/${img.file_path}`
                    : null,
                x: Math.random() * (window.innerWidth),
                y: Math.random() * (window.innerHeight),
                zIndex: index
            }));

            set({ images: boardImages, loading: false });
        } catch (error) {
            const message = (error as Error).message || 'Failed to fetch images';
            set({ error: message, loading: false});
        }
    },
    
    addBackendImage: (imageData) => {
        set((state) => {
            const maxZ = state.images.reduce((max, img) => Math.max(max, img.zIndex), 0);
            const count = state.images.length;

            const fp = imageData.file_path
            ? `${API_URL}/uploads/${imageData.file_path}`
            : null;

            const url = imageData.external_url
            ? imageData.external_url
            : null;

            const boardImage = {
                ...imageData,
                file_path: fp,
                external_url: url,
                x: 100 + (count % 5) * 30,
                y: 100 + Math.floor(count / 5) * 30,
                zIndex: maxZ + 1,
                likes: imageData.likes || 0,
                owned_by_user: true
            };

            return {
                images: [boardImage, ...state.images]
            }
        })
    },

    deleteImage: async (id) => {
        set({ error: null })
        try{
            await imageApi.deleteImage(id);
        
            set((state) => ({
                images: state.images.filter((img) => img.id !== id),
                selectedImageId: null
            }));
        } catch (error) {
            console.error(error);
            set({ error: (error as Error).message || 'Failed to delete image'});
        }
    },

    likeImage: async (id) => {
        set({ error: null });
        try {
            const result = await imageApi.likeImage(id);
            if (result.success) {

                set((state) => ({
                    images: state.images.map((img) => 
                        img.id === id ? { ...img, likes: img.likes + 1, liked_by_user: true } : img
                    )
                }));
            }
        } catch (error) {
            console.error('Like error:', error);
            set({ error: (error as Error).message || 'Failed to like image' });
        }
    },

    unlikeImage: async (id) => {
        set({ error: null });
        try {
            const result = await imageApi.unlikeImage(id);
            if (result.success) {
                set((state) => ({
                        images: state.images.map((img) => 
                            img.id === id ? { ...img, likes: img.likes - 1, liked_by_user: false } : img
                        )
                }));
            }
        } catch (error) {
            console.error('Unlike error:', error);
            set({ error: (error as Error).message || 'Failed to unlike image' });
        }
    },

    flagImage: async (id) => {
        set({ error: null });
        try{
            const result = await imageApi.flagImage(id);
            if (result.success) {
                set((state) => ({
                    images: state.images.map((img) => 
                        img.id === id ? { ...img, flagged_by_user: true } : img
                    )
                }));
            }
        } catch (error) {
            console.error('Error flagging:', error);
            set({ error: (error as Error).message || 'Failed to flag image' });
        }
    }
})
);