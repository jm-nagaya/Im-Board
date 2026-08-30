import { useDraggable } from '@dnd-kit/react';
import { RestrictToWindow } from '@dnd-kit/dom/modifiers';
import { useImageStore } from '../stores/imageStore.ts';

type DraggableImageProps = {
    id: string;
    src: string | undefined;
    x: number;
    y: number;
    zIndex: number;
    onImageClick: () => void;
};

export function DraggableImage({ id, src, x, y, zIndex, onImageClick}: DraggableImageProps) {
    const { selectImage } = useImageStore();
    const { ref, isDragging } = useDraggable ({
        id,
        modifiers: [RestrictToWindow]
    });

    const handleClick = () => {
        selectImage(id);
        onImageClick();
    };

    return (
        <div
            className='draggableImage' // Used to exclude from panning
            style={{
                position: 'absolute',
                left: x,
                top: y,
                borderRadius: '8px',
                zIndex: zIndex,
                pointerEvents: 'auto'
            }}
        >
            <img className='preview'
                ref={ref}
                src={src}
                alt={`Image ${id}`} 
                style={{
                    transition: isDragging ? 'none' : 'transform 0.1s ease, box-shadow 0.2s ease',
                    pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                onClick={handleClick}
            />
        </div>
    );
}