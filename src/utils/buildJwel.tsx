import { getFaceMeshInstance } from "../utils/mediapipe";

interface FaceMeshResult {
    multiFaceLandmarks: any[][]; 
}

export const buildJwelFaceMeshes = (
    canvasRef: HTMLCanvasElement,
    videoRef: HTMLVideoElement,
    onResults: ((results: any) => void) | undefined, 
    jewelryImage: HTMLImageElement
) => {
    return  getFaceMeshInstance((results: { multiFaceLandmarks: any[][]; }, ) => {
        
        if (!videoRef || !canvasRef) return;
        const canvasCtx = canvasRef.getContext("2d");
        if (canvasCtx && videoRef && canvasRef) {
            canvasCtx.clearRect(0, 0, canvasRef.width, canvasRef.height);
            
            // Check if landmarks exist before accessing them
            if (results.multiFaceLandmarks && results.multiFaceLandmarks[0]) {
                const landmarks = results.multiFaceLandmarks[0];

                const cheekLeft = landmarks[234];
                const cheekRight = landmarks[454];
                const chin = landmarks[152];

                const width = ((cheekRight.x - cheekLeft.x) * canvasRef.width) + 35;
                const h_ratio = (jewelryImage.height / jewelryImage.width) * width;

                const aspectRatio = jewelryImage.naturalWidth / jewelryImage.naturalHeight;
                console.log(jewelryImage.naturalHeight, jewelryImage.naturalWidth, aspectRatio)
                      
                const centerX = (cheekLeft.x + cheekRight.x) / 2 * canvasRef.width;

                const centerY = aspectRatio > 1 ? ((chin.y * canvasRef.height) - h_ratio / 2) - 35 : ((chin.y * canvasRef.height) - h_ratio / 2) + 5;

                canvasCtx.drawImage(jewelryImage, centerX - width / 2, centerY + 95, width, h_ratio);
            }

            if (onResults) onResults(results);
        }
    });
}


// const width = ((cheekRight.x - cheekLeft.x) * canvasElement.width);
// const h_ratio = (imageObj.height / imageObj.width) * width;

// const aspectRatio = imageObj.naturalWidth / imageObj.naturalHeight;
// console.log(imageObj.naturalHeight, imageObj.naturalWidth, aspectRatio)

// const centerX = (cheekLeft.x + cheekRight.x) / 2 * canvasElement.width;
// console.log(aspectRatio)
// const centerY = aspectRatio > 1 ? ((chin.y * canvasElement.height) - h_ratio / 2)+ 110 : ((chin.y * canvasElement.height) - h_ratio / 2) +160;