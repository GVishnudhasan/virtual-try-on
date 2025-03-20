import React from 'react';
import {createMask} from "./createMask";
import {applyFoundation} from "./applyFoundation"

export const drawFoundation = (results: { multiFaceLandmarks: any[][]; }, canvasRef: HTMLCanvasElement, canvasCtx: CanvasRenderingContext2D, color?: string) => {
    if (results.multiFaceLandmarks) {
        const maskCanvas = createMask(results, canvasCtx.canvas.width, canvasCtx.canvas.height);
        if(maskCanvas){
            const foundationCtx =  applyFoundation(maskCanvas, canvasCtx.canvas.width, canvasCtx.canvas.height, color || "#e1bc9d");
            if (foundationCtx){
                canvasCtx.globalCompositeOperation = "hard-light";
                canvasCtx.globalAlpha = 0.4;
                canvasCtx.drawImage(foundationCtx, 0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
                canvasCtx.globalCompositeOperation = "source-over";
                canvasCtx.globalAlpha = 1.0;
            }
        }
    }
}