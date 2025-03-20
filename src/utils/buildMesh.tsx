

import { getFaceMeshInstance } from "../utils/mediapipe";


interface FaceMeshResult {
    multiFaceLandmarks: any[][]; 
  }


export const buildFaceMeshes = (
    canvasRef: HTMLCanvasElement,
    videoRef: HTMLVideoElement,
    onResults: ((results: any) => void) | undefined, 
    drawFunction: (results: FaceMeshResult, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, color?: string) => void,
    color?: string
  ) => {
      return  getFaceMeshInstance((results: { multiFaceLandmarks: any[][]; }, ) => {
          if (!videoRef || !canvasRef) return;
      
          const canvasCtx = canvasRef.getContext("2d");
          if (canvasCtx && videoRef && canvasRef) {
            canvasCtx.clearRect(0, 0, canvasRef.width, canvasRef.height);
            canvasCtx.drawImage(videoRef, 0, 0, canvasRef.width, canvasRef.height);

            canvasCtx.fillStyle = "#8d1810";
            canvasCtx.strokeStyle = "#ffffff08";
            // ctx.globalCompositeOperation = "lighter";
            // canvasCtx.globalAlpha = 0.4;

            console.log(color)

            drawFunction(results, canvasRef, canvasCtx, color); 
            if (onResults) onResults(results);
          }
        });
  }