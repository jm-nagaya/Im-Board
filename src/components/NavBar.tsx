import { AuthUser } from "aws-amplify/auth";
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

    return (
        <nav>
            <div className='navBar'>
                <span className='greeter'>Hello {user?.username}</span>
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