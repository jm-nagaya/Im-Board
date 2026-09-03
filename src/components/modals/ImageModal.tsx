import { useImageStore } from '../../stores/imageStore.ts';
import { useConfirmDialog } from '../../hooks/useConfirmDialog.ts';
import { ConfirmDialog } from '../ConfirmDialog.tsx';

import '../../styles/Modals.css';
import '../../styles/Images.css';

import { FaTrashAlt, FaHeart, FaFlag } from "react-icons/fa";

interface ImageModalProps {
    onSubmit: (src: string, message?: string) => void;
    onCancel: () => void;
}

export function ImageModal( { onCancel }: ImageModalProps ) {
    const { confirmDialogState, confirm, close, handleConfirm } = useConfirmDialog();
    const { images, selectedImageId, deleteImage, likeImage, unlikeImage, flagImage, loading } = useImageStore();
    const selectedImage = images.find((img) => img.id === selectedImageId);

    if (!selectedImage) {
        onCancel();
        return null;
    }

    const handleLike = () => {
        if (selectedImage.liked_by_user) {
            unlikeImage(selectedImage.id);
        }
        else {
            likeImage(selectedImage.id);
        }
    };

    const handleFlag = () => {
        confirm('Report image', 'Are you sure? This action cannot be undone.', () => {
            flagImage(selectedImage.id);
            close();
        });
    };

    const handleDelete = () => {
        confirm('Delete image', 'Are you sure you want to permanently delete this image? This will not reset your daily limit.', () => {
            deleteImage(selectedImage.id);
            close();
        })
    };

    return (
        <>
        <div className='overlay'
            onClick={loading ? undefined : onCancel}
        >
            <div className='modalContent'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='card'>
                    <img className='enlargedView'
                        src={selectedImage.file_path || selectedImage.external_url || undefined}
                    >
                    </img>

                    <div className='controlCenter'>

                        {/* Like button */}
                        <button className='control'
                            style={{
                                color: selectedImage.liked_by_user
                                    ? 'red'
                                    : 'var(--font)'
                            }}
                            onClick={handleLike}
                            disabled={loading}
                        >
                            <FaHeart />
                            <span>{selectedImage.likes}</span>
                        </button>

                        {/* Delete button */}
                        { selectedImage.owned_by_user &&
                        <button className='control'
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            <FaTrashAlt />
                        </button>
                        }

                        {/* Flag button */}
                        { !selectedImage.owned_by_user && !selectedImage.flagged_by_user &&
                        <button className='control'
                            onClick={handleFlag}
                            disabled={loading}
                        >
                            <FaFlag />
                        </button>
                        }
                    </div>
                </div>

                <div className='messageContainer'>
                    {selectedImage.message}
                </div>
            </div>
        </div>
    <ConfirmDialog
        isOpen={confirmDialogState.isOpen}
        title={confirmDialogState.title}
        message={confirmDialogState.message}
        onConfirm={handleConfirm}
        onCancel={close}
    />
    </>
    )
}