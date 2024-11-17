import React, { useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import ReactCrop, { centerCrop, convertToPercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const MIN_DIMENSION = 150; // Minimum crop size

export default function CropImage() {
    const { csrfToken } = usePage().props;
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [error, setError] = useState("");
    const [cropCoordinates, setCropCoordinates] = useState(null); // Store crop coordinates

    const onSelectFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || "";
            imageElement.src = imageUrl;

            imageElement.onload = (e) => {
                const { naturalWidth, naturalHeight } = e.currentTarget;

                if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                    setError("Image must be at least 150 x 150 pixels.");
                    return setImgSrc("");
                }

                setError("");
                setImgSrc(imageUrl);
            };
        };
        reader.readAsDataURL(file);
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        setCrop(centerCrop({ unit: "%", width: 30, aspect: null }, width, height));
    };

    const handleCropImage = () => {
        if (imgRef.current && crop && previewCanvasRef.current) {
            setCanvasPreview(imgRef.current, previewCanvasRef.current, crop);

            const canvas = previewCanvasRef.current;
            const croppedBase64 = canvas.toDataURL('image/png');
            setCroppedImage(croppedBase64);

            // Log and save crop coordinates
            const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
            const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
            const coordinates = {
                x: Math.round(crop.x * scaleX),
                y: Math.round(crop.y * scaleY),
                width: Math.round(crop.width * scaleX),
                height: Math.round(crop.height * scaleY),
            };

            setCropCoordinates(coordinates); // Save for UI display
            console.log('Crop coordinates:', coordinates);
        }
    };

    const handleSaveImage = async () => {
        const canvas = previewCanvasRef.current;

        canvas.toBlob(async (blob) => {
            if (blob) {
                const formData = new FormData();
                formData.append('image', blob, 'cropped-image.png');

                try {
                    const response = await fetch('/images/upload', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'X-CSRF-TOKEN': csrfToken,
                        },
                        body: formData,
                    });

                    const result = await response.json();
                    if (result.success) {
                        console.log('Image saved successfully:', result.path);
                        alert('Image uploaded successfully!');
                    } else {
                        console.error('Error saving image');
                        alert('Failed to upload image.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while uploading the image.');
                }
            }
        });
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <label>
                {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
                <h1 className="title" style={{ marginBottom: '10px' }}>Choose Photo</h1>
                <input type="file" accept="image/*" onChange={onSelectFile} />
            </label>

            <div className="crop-container" style={{ display: 'flex', marginTop: '20px' }}>
                <div className="crop-section" style={{ marginRight: '20px' }}>
                    {imgSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={(pixelCrop) => setCrop(pixelCrop)}
                            keepSelection
                        >
                            <img
                                ref={imgRef}
                                src={imgSrc}
                                alt="Upload"
                                style={{ maxHeight: "70vh" }}
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>
                    )}

                    {imgSrc && crop && (
                        <button
                            className="primary-btn"
                            style={{
                                backgroundColor: '#007BFF',
                                color: '#FFF',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '10px',
                            }}
                            onClick={handleCropImage}
                        >
                            Crop Image
                        </button>
                    )}
                </div>

                <div className="preview-section">
                    <h3>Preview</h3>
                    {crop && (
                        <canvas
                            ref={previewCanvasRef}
                            style={{
                                border: "1px solid black",
                                objectFit: "contain",
                                width: '150px',
                                height: '150px',
                            }}
                        />
                    )}

                    {croppedImage && (
                        <>
                            <button
                                className="primary-btn mt-2"
                                style={{
                                    backgroundColor: '#28A745',
                                    color: '#FFF',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginTop: '10px',
                                }}
                                onClick={handleSaveImage}
                            >
                                Crop & Save Image
                            </button>
                        </>
                    )}

                    {cropCoordinates && (
                        <div style={{ marginTop: '20px' }}>
                            <h4>Crop Coordinates:</h4>
                            <p>X: {cropCoordinates.x}, Y: {cropCoordinates.y}</p>
                            <p>Width: {cropCoordinates.width}, Height: {cropCoordinates.height}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const setCanvasPreview = (image, canvas, crop) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !crop) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelCrop = {
        x: crop.x * scaleX,
        y: crop.y * scaleY,
        width: crop.width * scaleX,
        height: crop.height * scaleY,
    };

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
    );
};
