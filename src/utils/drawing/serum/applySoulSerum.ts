// applySoulSerum.ts
import * as StackBlur from 'stackblur-canvas';

export const applySoulSerum = (
  maskCanvas: HTMLCanvasElement,
  width: number,
  height: number
) => {
  const serumCanvas = document.createElement("canvas");
  serumCanvas.width = width;
  serumCanvas.height = height;
  const serumCtx = serumCanvas.getContext("2d");
  if (!serumCtx) return;

  // Center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;

  // 1) Draw a soft radial gradient to simulate watery glow
  const radialGradient = serumCtx.createRadialGradient(
    centerX,
    centerY,
    width * 0.1,
    centerX,
    centerY,
    Math.max(width, height) / 1.2
  );
  // A subtle, cool, semi-transparent color
  radialGradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
  radialGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  serumCtx.fillStyle = radialGradient;
  serumCtx.fillRect(0, 0, width, height);

  // 2) Light blur + slight brightness & saturation for a “dewy” effect
  //    We’ll do a stack blur for smoothness, plus a canvas filter
  serumCtx.filter = "brightness(1.08) saturate(1.15) blur(5px)";
  const imageData = serumCtx.getImageData(0, 0, width, height);
  StackBlur.imageDataRGBA(imageData, 0, 0, width, height, 5);
  serumCtx.putImageData(imageData, 0, 0);

  // Reset filter
  serumCtx.filter = "none";

  // 3) Constrain the effect to the face using the mask
  //    “destination-in” keeps only the intersection with the existing image
  serumCtx.globalCompositeOperation = "destination-in";
  serumCtx.drawImage(maskCanvas, 0, 0, width, height);

  // Return the completed effect
  return serumCanvas;
};
