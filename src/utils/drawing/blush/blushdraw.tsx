import React from 'react';

const left_blush = [227, 137, 147, 207, 206, 203, 36, 101,  227]  //[36, 203, 206, 207, 147, 137, 116, 117, 118, 101, 36] //
const right_blush = [346, 347, 330, 266, 423, 391, 322, 436, 427, 411, 323, 352, 346]

// Add a state variable for the current blush color
let currentBlushColor = "#FFB6C1"; // default pink color

// Add a function to update the blush color
export const setBlushColor = (color: string) => {
    currentBlushColor = color;
}

const defineBlush = (ctx: CanvasRenderingContext2D, cordinates: any[]) => {
    ctx.beginPath();
    let e = ctx.canvas
    ctx.moveTo(cordinates[0].x * e.width, cordinates[0].y * e.height);
    for(var i=0; i<cordinates.length;i++){
    ctx.lineTo(cordinates[i].x * e.width, cordinates[i].y * e.height);
    }
    ctx.closePath();
}

export const drawBlush = (results: { multiFaceLandmarks: any[][]; }, canvasRef: HTMLCanvasElement, canvasCtx: CanvasRenderingContext2D) => {
    if (results.multiFaceLandmarks) {
        results.multiFaceLandmarks.forEach((landmarks: any[]) => {
            const leftBlush = left_blush.map((index) => landmarks[index]);
            const rightBlush = right_blush.map((index) => landmarks[index]);

            // Set the fill style before drawing
            canvasCtx.fillStyle = currentBlushColor;
            canvasCtx.strokeStyle = currentBlushColor;
            canvasCtx.globalAlpha = 0.3; // Add transparency

            defineBlush(canvasCtx, leftBlush)
            canvasCtx.stroke();
            canvasCtx.fill();

            defineBlush(canvasCtx, rightBlush)
            canvasCtx.stroke();
            canvasCtx.fill();

            canvasCtx.globalAlpha = 1;
        });
    }
}