import { AuthUser } from "aws-amplify/auth";
//@ts-ignore
import '../styles/NavBar.css';

import { useImageStore } from "../stores/imageStore.ts";

interface NavBarProps {
    onSignOut?: () => void;
    user?: AuthUser;
    onUploadClick: () => void;
    onGifClick: () => void;
    onDrawClick: () => void;
}

export function NavBar({ onSignOut, user, onUploadClick, onGifClick, onDrawClick }: NavBarProps) {

    const { fetchImages } = useImageStore();

    return (
        <nav>
            <div className='navBar'>
                <span className='greeter'>Hello {user?.username}</span>
                <div>
                    <button className='uploadButtons'
                        onClick={onUploadClick}
                    >
                        Upload Image
                    </button>
                    <button className='uploadButtons'
                        onClick={onGifClick}
                    >
                        Choose GIF
                    </button>
                    <button className='uploadButtons'
                        onClick={onDrawClick}
                    >
                        Draw Image
                    </button>
                </div>
                <button className='control'
                    onClick={fetchImages}
                >
                    Refresh
                </button>
                {onSignOut && (
                    <button className='navButton'
                        onClick={onSignOut}
                    >
                        Sign Out
                    </button>
                )}
            </div>
        </nav>
    )
}