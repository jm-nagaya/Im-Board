import { useRef, useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { dataURLtoFile } from '../../utils/imageUtils.ts';
import '../../styles/Modals.css'

interface DrawingModalProps {
    onSubmit: (src: File, message?: string) => void;
    onCancel: () => void;
}

export function DrawingModal({ onSubmit, onCancel }: DrawingModalProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);


    const [isDrawing, setIsDrawing] = useState(false);
    const [message, setMessage] = useState('');
    const [brushSize, setBrushSize] = useState(4);
    const [brushColor, setBrushColor] = useState('#000000');
    const [canvasSize, setCanvasSize] = useState({ width: 500, height: 350 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                const padding = 20; // TODO: Test this with different values
                const newWidth = Math.max(width - padding, 100);
                const newHeight = Math.max(height - padding, 100);
                setCanvasSize((prev) => {
                    if (prev.width === newWidth && prev.height === newHeight) return prev;
                    return { width: newWidth, height: newHeight };
                });
            }
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, [canvasSize]); //Canvas clears and resizes when window resizes

    const updateBrushSettings = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
    };

    useEffect(() => {
        updateBrushSettings();
    }, [brushColor, brushSize]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        //If something goes wrong, you probably need to update the brush settings here

        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dataUrl = canvas.toDataURL('image/png');
        const img = dataURLtoFile(dataUrl);

        onSubmit(img, message);
    };

    return (
        <div className='overlay'>
            <div className='modalContent'>
                <div className='brushSettings'>
                    <label>Size:</label>
                    <input
                        type='range'
                        min='1'
                        max='20'
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                    />
                    <p>{brushSize}</p>
                    <label>Color:</label>
                    <ChromePicker
                        styles={{
                            default: {
                                picker: {
                                    width: '100%'
                                }
                            }
                        }}
                        color={brushColor}
                        onChange={(color) => setBrushColor(color.hex)}
                        disableAlpha
                    />
                </div>
                <div ref={containerRef}
                    style={{
                        height: '90%',
                        width: '100%',
                        flex: 1
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    ></canvas>
                </div>
                <div className='uploadSection'>
                    <div className='messageContainer'>
                        <textarea className='messageInput'
                            placeholder='Attach a message'
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                    </div>
                    <button className='control'
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
                <button className='control closeButton'
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}