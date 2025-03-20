// Example adjustments to createMask (if needed)
// src/utils/drawing/foundation/createMask.tsx or .ts
// Assuming createMask needs to draw onto the maskCtx:

export const createMask = (
    results: { multiFaceLandmarks: any[][] },
    width: number,
    height: number,
    maskCtx: CanvasRenderingContext2D // Add maskCtx to arguments
): void => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        return;
    }

    // Draw the face mask using maskCtx.
    maskCtx.beginPath();
    results.multiFaceLandmarks[0].forEach((landmark, index) => {
        const x = landmark.x * width;
        const y = landmark.y * height;

        if (index === 0) {
            maskCtx.moveTo(x, y);
        } else {
            maskCtx.lineTo(x, y);
        }
    });
    maskCtx.closePath();

    maskCtx.fillStyle = 'white'; // Or any other appropriate color
    maskCtx.fill();
};
