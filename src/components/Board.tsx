import { useState, useEffect } from 'react';
import { useImageStore } from '../stores/imageStore.ts';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { DraggableImage } from './DraggableImage.tsx';
import { TransformWrapper, TransformComponent, useTransformContext } from 'react-zoom-pan-pinch';
import { toast } from 'react-hot-toast';

interface BoardProps {
    onImageClick: () => void;
}

interface BoardContentProps {
    setIsDragging: (isDragging: boolean) => void;
}

function BoardContent({ onImageClick, setIsDragging }: BoardProps & BoardContentProps) {
    const { images, moveImage, bringToFront, error, loading } = useImageStore();
    const { state } = useTransformContext();

    useEffect(() => {
        if (error) {
            toast.dismissAll('loading');
            toast.error(error, { toasterId: 'errors' });
        } else if (loading) {
            toast.dismissAll('errors');
            toast.loading('Loading...', { toasterId: 'loading' });
        } else {
            toast.dismissAll('loading');
        }
    }, [error, loading]);

    const handleDragEnd = (event: DragEndEvent) => {
        const sourceId = event.operation.source?.id as string;
        const transform = event.operation.transform;
        const image = images.find((img) => img.id === sourceId);
        if (image) {
            const currentScale = state.scale;
            const deltaX = transform.x / currentScale;
            const deltaY = transform.y / currentScale;
            moveImage(sourceId, image.x + deltaX, image.y + deltaY);
            bringToFront(sourceId);
        }
        setIsDragging(false);
    };

    return (
        <DragDropProvider
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    minWidth: window.innerWidth * 1.5,
                    minHeight: window.innerHeight * 1.5,
                    backgroundImage: `url('${process.env.PUBLIC_URL}/background.jpg')`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '0 0',
                    pointerEvents: 'none'
                }}
            >
                {images.map((img) => (
                    <DraggableImage
                        key={img.id}
                        id={img.id}
                        src={img.file_path || img.external_url || undefined}
                        x={img.x}
                        y={img.y}
                        zIndex={img.zIndex}
                        onImageClick={onImageClick}
                    />
                ))}
            </div>
        </DragDropProvider>
    )
}

export function Board( { onImageClick }: BoardProps) {

    const [isDragging, setIsDragging] = useState(false);
    const { fetchImages } = useImageStore();

    return (
        <TransformWrapper
            // initialScale={1}
            minScale={1}
            maxScale={5}
            centerOnInit={true}
            wheel={{ step: 0.001 }}
            panning={{
                excluded: ['draggableImage']
            }}
            disabled={isDragging}
            onInit={fetchImages}
        >
            {/* TODO: Add buttons (maybe)*/}
            {({ zoomIn, zoomOut, resetTransform }) => (
                <TransformComponent
                    wrapperStyle={{
                        width: '100vw',
                        height: '100vh',
                        overflow: 'hidden'
                    }}
                >
                    <BoardContent
                        onImageClick={onImageClick}
                        setIsDragging={setIsDragging}
                    />
                </TransformComponent>
            )}
        </TransformWrapper>
    );
}