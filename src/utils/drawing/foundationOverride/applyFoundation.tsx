import * as StackBlur from 'stackblur-canvas';


export const applyFoundation = (maskCanvas: HTMLCanvasElement, width: number, 
    height: number, founcatioColor: string
) => {

    const foundationCanvas = document.createElement('canvas');
    
    foundationCanvas.width = width;
    foundationCanvas.height = height;
    const foundationCtx = foundationCanvas.getContext('2d');
    if(!foundationCtx)return;

    foundationCtx.fillStyle = founcatioColor;
    foundationCtx.filter = "blur(25px)";
    foundationCtx.fillRect(0, 0, width, height); 

    // Apply blur to foundation
    const foundationData = foundationCtx.getImageData(0, 0, width, height);
    StackBlur.imageDataRGBA(foundationData, 0, 0, width, height, 40);
    foundationCtx.putImageData(foundationData, 0, 0);

    foundationCtx.globalCompositeOperation = "destination-in";
    foundationCtx.drawImage(maskCanvas, 0, 0, width, height);
    // Apply the mask to the foundation layer
    
    return foundationCanvas;
}