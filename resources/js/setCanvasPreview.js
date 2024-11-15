const setCanvasPreview = (
    image, // HTMLImageElement
    canvas, // HTMLCanvasElement
    crop // PixelCrop
) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("No 2D context");
    }

    // devicePixelRatio improves sharpness on high-DPI screens
    const pixelRatio = window.devicePixelRatio || 1;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calculate the canvas width and height based on the crop area and pixel ratio
    canvas.width = crop.width * scaleX * pixelRatio;
    canvas.height = crop.height * scaleY * pixelRatio;

    // Clear the canvas for a fresh draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale for high-DPI displays
    ctx.scale(pixelRatio, pixelRatio);

    // Log the values for debugging
    console.log("Crop:", crop);
    console.log("Image natural dimensions:", image.naturalWidth, image.naturalHeight);
    console.log("Canvas dimensions:", canvas.width, canvas.height);
    console.log("Scale factors:", scaleX, scaleY);

    // Draw the cropped area of the image on the canvas
    ctx.drawImage(
        image,
        crop.x * scaleX, // Crop start X
        crop.y * scaleY, // Crop start Y
        crop.width * scaleX, // Crop width
        crop.height * scaleY, // Crop height
        0, // Place at X = 0 on canvas
        0, // Place at Y = 0 on canvas
        crop.width, // Draw width (unscaled here)
        crop.height // Draw height (unscaled here)
    );

    // Reset the scaling to avoid affecting other drawings
    ctx.setTransform(1, 0, 0, 1, 0, 0);
};

export default setCanvasPreview;
