import { useCallback } from 'react';
import { ModalType } from '../../types/modal.ts';
import { UploadModal } from './UploadModal.tsx';
import { GifModal } from './GifModal.tsx';
import { ImageModal } from './ImageModal.tsx';
import { useImageStore } from "../../stores/imageStore.ts";
import { DrawingModal } from './DrawingModal.tsx';
import '../../styles/Modals.css';
import { imageApi } from '../../api/images.ts';
import { toast } from 'react-hot-toast';

interface ModalManagerProps {
    modalType: ModalType;
    onClose: () => void;
}

export function ModalManager ({ modalType, onClose }: ModalManagerProps) {

    const { addBackendImage } = useImageStore();

    const handleSubmit = useCallback(
        async (src: File | string, message?: string) => {
            try {
                let imageData;

                if (src instanceof File) {
                    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
                    if (!allowedTypes.includes(src.type)) {
                        throw new Error('Not a valid file type');
                    }
                    if (src.size > 5 * 1024 * 1024) {
                        throw new Error('File size too large');
                    }
                    const response = await imageApi.uploadImage(src, message);
                    const data = await response.json();
                    if (!data.success) throw new Error(data.error || 'Upload Failed');
                    imageData = data.image;
                }

                else if (typeof src === 'string' && src.startsWith('https://static.klipy.com')) {
                    const response = await imageApi.addGif(src, message);
                    const data = await response.json();
                    if (!data.success) throw new Error(data.error || 'Failed to add GIF');
                    imageData = data.image;
                }

                else {
                    throw new Error('Invalid source type');
                }

                addBackendImage(imageData);
                toast.success('Post created', { toasterId: 'loading' });
                onClose();
            } catch (error) {
                toast.dismissAll('errors');
                toast.error((error as Error).message, { toasterId: 'errors' });
            }
        },
        [onClose, addBackendImage]
    );

    const modalProps = {
        onSubmit: handleSubmit,
        onCancel: onClose
    };

    const renderModal = () => {
        switch (modalType) {
            case 'upload':
                return <UploadModal {...modalProps}/>;
            case 'gif':
                return <GifModal {...modalProps} />;
            case 'draw':
                return <DrawingModal {...modalProps} />;
            case 'image':
                return <ImageModal {...modalProps} />
            default:
                return null;
        }
    }

    if (!modalType) return null;

    return (
        <>
            {renderModal()}
        </>
    )
}