// src/utils/drawing/foundation/draw.tsx
import React from 'react';
import {createMask} from "./createMask";
import {applyFoundation} from "./applyFoundation"

export const drawFoundation = (
  results: { multiFaceLandmarks: any[][]; },
  canvasRef: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  foundationColor: string
) => {
  if (results.multiFaceLandmarks) {
    // Create a temporary canvas for the mask.
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvasRef.width;
    maskCanvas.height = canvasRef.height;
    const maskCtx = maskCanvas.getContext('2d');

    if (maskCtx) { // Check if maskCtx is not null
      // Clear the mask canvas to avoid any white background.
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

      // Create the mask on the temporary canvas.
      createMask(results, maskCanvas.width, maskCanvas.height, maskCtx);

      // Apply the foundation effect to the mask canvas.
      const foundationCtx = applyFoundation(
        maskCanvas,
        canvasRef.width,
        canvasRef.height,
        foundationColor
      );

      if (foundationCtx) {
        // Draw the foundation effect on top of the video feed.
        canvasCtx.drawImage(foundationCtx, 0, 0, canvasRef.width, canvasRef.height);
      }
    }
  }
};
