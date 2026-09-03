import { useState, useEffect, useRef } from 'react';
import '../../styles/Modals.css';

interface UploadModalProps {
    onSubmit: (src: File, message?: string) => void;
    onCancel: () => void;
}

export function UploadModal({ onSubmit, onCancel }: UploadModalProps) {

    const [message, setMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

        if (!allowedTypes.includes(selectedFile.type)) {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async () => {
        if (!file || !preview) return;

        setLoading(true);
        try {
            await onSubmit(file, message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (!loading) {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            onCancel();
        }
    };

    return (
        <div className='overlay'
            onClick={handleCancel}
        >
            <div className='modalContent'
                onClick={(e) => e.stopPropagation()}
            >
                {preview &&
                        <div className='card'>
                            <img className='enlargedView'
                                src={preview}
                                alt="preview"
                            />
                        </div>
                }
                <div className='chooser'>
                    <h1>Upload Image</h1>
                    <label className='fileSelector'
                        htmlFor='fileUpload'
                    >
                        Choose...
                    </label>
                    <input
                        ref={fileInputRef}
                        id='fileUpload'
                        type='file'
                        onChange={handleFileChange}
                    />
                </div>
                <div className='uploadSection'>
                    <div className='messageContainer'>
                        <textarea className='messageInput'
                            placeholder="Attach a message"
                            onChange={(e) => setMessage(e.target.value)}
                        >
                        </textarea>
                    </div>
                    <div className='controlCenter'>
                        <button className='control'
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            { !loading && 'Upload' }
                            { loading && 'Uploading...' }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}