// Create the face mask for the foundation effect
import * as StackBlur from 'stackblur-canvas';

export const createMask = (results: { multiFaceLandmarks: any[][]; }, width: number, height: number) =>{
    if (results.multiFaceLandmarks) {
        const landmarks = results.multiFaceLandmarks[0];

        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width;
        maskCanvas.height = height;

        try {    
            const maskCtx = maskCanvas.getContext('2d');
            if (!maskCtx )return;
            maskCtx.beginPath();
            landmarks.forEach((point, index) => {
                index == 0 ? maskCtx.moveTo(point.x * width, point.y * height) : maskCtx.lineTo(point.x * width, point.y * height)
            });
            maskCtx.closePath();
            maskCtx.fillStyle = "white";
            maskCtx.fill();

            const imageData = maskCtx.getImageData(0, 0, width, height);
            StackBlur.imageDataRGBA(imageData, 0, 0, width, height, 60);
            maskCtx.putImageData(imageData, 0, 0);
        } catch (error) {
            console.log(error);
        }
        return maskCanvas;
    }
}