import toast from 'react-hot-toast';

export function useToast() {
    const showSuccess = (message) => {
        toast.success(message, {
            icon: '✔️',
            duration: 3000,
        });
    };

    const showError = (message) => {
        toast.error(message, {
            icon: '❌',
            duration: 4000,
        });
    };

    const showInfo = (message) => {
        toast(message, {
            icon: '❕',
            duration: 3000,
            style: {
                background: '#3b82f6',
                color: '#fff',
            },
        });
    };

    const showWarning = (message) => {
        toast(message, {
            icon: '⚠️',
            duration: 4000,
            style: {
                background: '#f59e0b',
                color: '#fff',
            },
        });
    };

    const showPromise = (promise, messages) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading || 'Chargement...',
                success: messages.success || 'Opération réussie !',
                error: messages.error || 'Une erreur est survenue',
            },
            {
                style: {
                    borderRadius: '10px',
                },
            }
        );
    };

    return {
        success: showSuccess,
        error: showError,
        info: showInfo,
        warning: showWarning,
        promise: showPromise,
    };
}