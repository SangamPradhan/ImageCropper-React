import React, { useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import ReactCrop, { centerCrop, makeAspectCrop, convertToPercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import setCanvasPreview from '../setCanvasPreview';

const MIN_DIMENSION = 150;
const ASPECT_RATIO = 1;

export default function CropImage() {
    const { csrfToken } = usePage().props; // Get CSRF token from Inertia
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState(null);
    const [error, setError] = useState("");

    // Handle file selection
    const onSelectFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || "";
            imageElement.src = imageUrl;

            imageElement.addEventListener("load", (e) => {
                const { naturalWidth, naturalHeight } = e.currentTarget;

                if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                    setError("Image must be at least 150 x 150 pixels.");
                    return setImgSrc("");
                }

                setError("");
                setImgSrc(imageUrl);
            });
        });
        reader.readAsDataURL(file);
    };

    // Set up initial crop on image load
    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

        const crop = makeAspectCrop(
            {
                unit: "%", 
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height
        );

        setCrop(centerCrop(crop, width, height));
    };

    // Save cropped image
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
                            'X-CSRF-TOKEN': csrfToken, // CSRF token from Inertia
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
        <div>
            <label>
                {error && <p className="error">{error}</p>}
                <h1 className="title">Choose Photo</h1>
                <input type="file" accept="image/*" onChange={onSelectFile} />
            </label>

            <div className="crop-container">
                <div className="crop-section">
                    {imgSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={(pixelCrop, percentCrop) => setCrop(pixelCrop)}
                            aspect={ASPECT_RATIO}
                            circularCrop
                            keepSelection
                            minWidth={MIN_DIMENSION}
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
                            onClick={() => {
                                setCanvasPreview(
                                    imgRef.current,
                                    previewCanvasRef.current,
                                    convertToPercentCrop(
                                        crop,
                                        imgRef.current.width,
                                        imgRef.current.height
                                    )
                                );
                            }}
                        >
                            Crop Image
                        </button>
                    )}
                </div>

                <div className="preview-section">
                    {crop && (
                        <canvas
                            ref={previewCanvasRef}
                            style={{
                                border: "1px solid black",
                                objectFit: "contain",
                                width: 150,
                                height: 150,
                            }}
                        />
                    )}

                    {crop && (
                        <button className="primary-btn mt-2" onClick={handleSaveImage}>
                            Crop & Save Image
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
