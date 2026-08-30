import { useState, useCallback } from 'react';

export const useConfirmDialog = () => {
    const [state, setState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });

    const confirm = useCallback((title: string, message: string, onConfirm: () => void) => {
        setState({ isOpen: true, title, message, onConfirm });
    }, []);

    const close = useCallback(() => {
        setState((prev) => ({ ...prev, isOpen: false }));
    }, []);

    const handleConfirm = useCallback(() => {
        state.onConfirm();
        close();
    }, [state, close]);

    return {
        confirmDialogState: state,
        confirm,
        close,
        handleConfirm,
    };
};