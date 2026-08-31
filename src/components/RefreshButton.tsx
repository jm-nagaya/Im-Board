import '../styles/RefreshButton.css';
import { useState } from 'react';
import { IoMdRefresh } from "react-icons/io";
import { useImageStore } from '../stores/imageStore.ts';


export function RefreshButton() {
    const [spinning, setSpinning] = useState(false);
    const { fetchImages } = useImageStore();

    const handleClick = () =>  {
        setSpinning(true);
        fetchImages();
    }
    const handleAnimationEnd = () => setSpinning(false);

    return (
        <button className='refreshButton'
            onClick={handleClick}
            onAnimationEnd={handleAnimationEnd}
            style={{
                animation: spinning ? 'spin 0.3s ease-out' : 'none'
            }}
        >
            <IoMdRefresh />
        </button>
    );
}