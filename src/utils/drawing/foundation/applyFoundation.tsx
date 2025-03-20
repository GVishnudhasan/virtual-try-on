

export const applyFoundation = (maskCanvas: HTMLCanvasElement, width: number, 
    height: number, founcatioColor: string
) => {

    const foundationCanvas = document.createElement('canvas');
    
    foundationCanvas.width = width;
    foundationCanvas.height = height;
    const foundationCtx = foundationCanvas.getContext('2d');
    if(!foundationCtx)return;

    foundationCtx.fillStyle = founcatioColor;
    // foundationCtx.filter = "blur(90px)";
    foundationCtx.fillRect(0, 0, width, height); 

    foundationCtx.globalCompositeOperation = "destination-in";
    foundationCtx.drawImage(maskCanvas, 0, 0, width, height);
    // Apply the mask to the foundation layer
    
    return foundationCanvas;
}