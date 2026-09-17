import { useEffect, useState } from 'react';
import { View, Text } from '@aws-amplify/ui-react';

const ALLOWED_ERRORS: Record<string, string> = {
    access_denied: 'Sign-in was cancelled or permission was denied.',
    invalid_request: 'Something went wrong with the sign-in request.',
    unauthorized_client: 'This application is not authorized to sign in.',
    server_error: 'The authentication provider is temporarily unavailable.',
    temporarily_unavailable: 'The authentication provider is temporarily unavailable.',
};

export function AuthError() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const errorCode = params.get('error');

        if (errorCode && ALLOWED_ERRORS[errorCode]) {
            setErrorMessage(ALLOWED_ERRORS[errorCode]);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    if (!errorMessage) return null;

    return (
        <View backgroundColor="var(--amplify-colors-red-10)" padding="0.75rem" borderRadius="6px" marginBottom="1rem">
            <Text color="var(--amplify-colors-red-80)" fontSize="0.875rem">
                {errorMessage}
            </Text>
        </View>
    );
}