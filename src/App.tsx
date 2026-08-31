import './App.css';
import '@aws-amplify/ui-react/styles.css';

import { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';

import { Board } from './components/Board.tsx';
import { NavBar } from './components/NavBar.tsx';
import { ModalManager } from './components/modals/ModalManager.tsx';
import { ModalType } from './types/modal.ts';
import { Toaster } from 'react-hot-toast';
import { RefreshButton } from './components/RefreshButton.tsx';

import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports.ts';
Amplify.configure(awsExports);


function App() {
    const [modalType, setModalType] = useState<ModalType>(null);

    return (
        <Authenticator signUpAttributes={['email']}>
            {({ signOut, user }) => (
            <>
                <Toaster position='top-right'
                    containerStyle={{ zIndex: 99999 }}
                />
                <NavBar onSignOut={signOut} user={user}
                    onUploadClick={() => setModalType('upload')}
                    onGifClick={() => setModalType('gif')}
                    onDrawClick={() => setModalType('draw')}
                />
                <Board onImageClick={() => setModalType('image')}/>
                <ModalManager modalType={modalType} onClose={() => setModalType(null)}/>
                <RefreshButton />
            </>
            )}
        </Authenticator>
	);
}

export default App;
