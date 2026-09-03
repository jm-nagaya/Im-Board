import { useState, useEffect } from 'react';
import { GifPicker } from 'gif-picker-react';
import { Klipy } from 'gif-picker-react/providers/klipy';
import { useConfirmDialog } from '../../hooks/useConfirmDialog.ts';
import { ConfirmDialog } from '../ConfirmDialog.tsx';

import '../../styles/Modals.css';

interface GifModalProps {
    onSubmit: (src: string, message?: string) => void;
    onCancel: () => void;
}


export function GifModal({ onSubmit, onCancel }: GifModalProps) {

    const { confirmDialogState, confirm, close, handleConfirm } = useConfirmDialog();
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(true);

    useEffect(() => {
        setOpen(true);
    }, [])

    const handleSubmit = (url: string) => {
        setOpen(false);
        if (message) {
            onSubmit(url, message);
        }
        else {
            confirm('Upload GIF?', 'Upload without a message?', () => {
                onSubmit(url, message);
                close();
            });
        }
    }

    const KLIPY_API_KEY = process.env.REACT_APP_KLIPY_API_KEY || '';

    return (
        <>
        {open &&
        <div className='overlay'
            onClick={onCancel}
        >
            <div className='modalContent'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='chooser'>
                    <h1>Choose GIF</h1>
                    <GifPicker 
                        provider={Klipy(KLIPY_API_KEY)}
                        width='80%'
                        height='70%'
                        onGifClick={(Gif) => handleSubmit(Gif.imageUrl)}
                    />
                </div>
                <div className='uploadSection'>
                    <div className='messageContainer'>
                        <textarea className='messageInput'
                            placeholder="Attach a message"
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
        }
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