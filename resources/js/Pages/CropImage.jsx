import React, { useRef, useState } from 'react';
import ReactCrop, { centerCrop, convertToPercentCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import setCanvasPreview from "../setCanvasPreview";

const MIN_DIMENSION = 150;
const ASPECT_RATIO = 1;

export default function CropImage() {
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState();
    const [error, setError] = useState("");

    const handleSaveImage = () => {
        const canvas = previewCanvasRef.current;
        canvas.toBlob(async (blob) => {
            if (blob) {
                const formData = new FormData();
                formData.append('image', blob, 'cropped-image.png');

                try {
                    const response = await fetch('/api/images', {
                        method: 'POST',
                        body: formData,
                    });

                    const result = await response.json();
                    if (result.success) {
                        console.log('Image saved successfully:', result.path);
                    } else {
                        console.error('Error saving image');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    };

    const onSelectFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || "";
            imageElement.src = imageUrl;

            imageElement.addEventListener("load", (e) => {
                if (error) setError("");
                const { naturalWidth, naturalHeight } = e.currentTarget;

                if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                    setError("Image must be at least 150 x 150 pixels.");
                    return setImgSrc("");
                }
            });

            setImgSrc(imageUrl);
        });
        reader.readAsDataURL(file);
    };

    const handleForm = async (e) => {
        e.preventDefault();
    };

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
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    };

    return (
        <>
            <label>
                {error && <p className="error">{error}</p>}
                <span><h1 className="title">Choose Photo</h1></span> <br /><br />
                <input type="file" accept="image/*" onChange={onSelectFile} />
            </label>

            {/* Container to hold cropper and preview side by side */}
            <div className="crop-container">
                {/* Cropper Section */}
                <div className="crop-section">
                    {imgSrc && (
                        <ReactCrop
                            onChange={(pixelCrop, percentCrop) => setCrop(pixelCrop)}
                            crop={crop}
                            circularCrop
                            keepSelection
                            aspect={ASPECT_RATIO}
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
                    <button
                        className="primary-btn mt-2"
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
                </div>

                {/* Preview Section */}
                <div className="preview-section">
                    {crop && (
                        <canvas
                            ref={previewCanvasRef}
                            className="mt-4"
                            style={{
                                border: "1px solid black",
                                objectFit: "contain",
                                width: 150,
                                height: 150,
                            }}
                        />
                    )}
                    <button className="primary-btn mt-2" onClick={handleSaveImage}>
                        Crop & Save Image
                    </button>
                </div>
            </div>
        </>
    );
}
