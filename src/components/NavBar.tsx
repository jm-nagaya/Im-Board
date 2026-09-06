import { useState, useEffect } from 'react';
import { AuthUser, fetchUserAttributes, UserAttributeKey } from "aws-amplify/auth";
import '../styles/NavBar.css';


interface NavBarProps {
    onSignOut?: () => void;
    user?: AuthUser;
    onUploadClick: () => void;
    onGifClick: () => void;
    onDrawClick: () => void;
}

export function NavBar({ onSignOut, user, onUploadClick, onGifClick, onDrawClick }: NavBarProps) {
    const [attributes, setAttributes] = useState<Partial<Record<UserAttributeKey, string>>>();
    useEffect(() => {
        const loadAttributes = async () => {
            try {
                const attrs = await fetchUserAttributes();
                setAttributes(attrs);
            } catch (error) {
                console.log('Failed to fetch user attributes');
            }
        };
        if (user) {
            loadAttributes();
        }
    }, [user]);

    const displayName = attributes?.nickname || user?.username || 'User';

    return (
        <nav>
            <div className='navBar'>
                <span className='greeter'>Hello, {displayName}</span>
                <div className='navBtnCont'>
                    <button className='navButton navButton--red'
                        onClick={onUploadClick}
                    >
                        Upload Image
                    </button>
                    <button className='navButton navButton--yellow'
                        onClick={onGifClick}
                    >
                        Choose GIF
                    </button>
                    <button className='navButton navButton--green'
                        onClick={onDrawClick}
                    >
                        Draw Image
                    </button>
                </div>
                {onSignOut && (
                    <button className='signOutButton'
                        onClick={onSignOut}
                    >
                        Sign Out
                    </button>
                )}
            </div>
        </nav>
    )
}