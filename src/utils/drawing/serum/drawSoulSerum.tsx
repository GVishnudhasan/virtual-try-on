// drawSoulSerum.ts
import { createMask } from "./createMask";
import { applySoulSerum } from "./applySoulSerum";

export const drawSoulSerum = (
  results: { multiFaceLandmarks: any[][] },
  canvas: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D
) => {
  if (results.multiFaceLandmarks) {
    const maskCanvas = createMask(results, canvas.width, canvas.height);
    if (maskCanvas) {
      const serumCanvas = applySoulSerum(
        maskCanvas,
        canvas.width,
        canvas.height
      );
      if (serumCanvas) {
        // Use a blending mode to achieve a watery glow
        canvasCtx.globalCompositeOperation = "screen"; 
        canvasCtx.globalAlpha = 0.9; // Adjust intensity as needed
        canvasCtx.drawImage(serumCanvas, 0, 0, canvas.width, canvas.height);

        // Reset
        canvasCtx.globalCompositeOperation = "source-over";
        canvasCtx.globalAlpha = 1.0;
      }
    }
  }
};
