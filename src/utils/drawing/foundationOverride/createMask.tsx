import * as StackBlur from 'stackblur-canvas';

export const createMask = (
  results: { multiFaceLandmarks: any[][] },
  width: number,
  height: number
) => {
  if (results.multiFaceLandmarks) {
    const landmarks = results.multiFaceLandmarks[0];
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;

    try {
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return;

      // Draw the overall face mask
      maskCtx.beginPath();
      landmarks.forEach((point, index) => {
        index === 0 
          ? maskCtx.moveTo(point.x * width, point.y * height) 
          : maskCtx.lineTo(point.x * width, point.y * height);
      });
      maskCtx.closePath();
      maskCtx.fillStyle = "white";
      maskCtx.fill();

      // Function to subtract an eye region using both polygon and an expanded bounding box
      const subtractEyeRegion = (indices: number[], extraMargin: number) => {
        // Subtract the polygon
        maskCtx.globalCompositeOperation = "destination-out";
        maskCtx.beginPath();
        indices.forEach((i, idx) => {
          const pt = landmarks[i];
          if (idx === 0) {
            maskCtx.moveTo(pt.x * width, pt.y * height);
          } else {
            maskCtx.lineTo(pt.x * width, pt.y * height);
          }
        });
        maskCtx.closePath();
        maskCtx.fill();

        // Compute bounding box of the eye region
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        indices.forEach(i => {
          const pt = landmarks[i];
          const x = pt.x * width;
          const y = pt.y * height;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        });
        // Expand bounding box by extraMargin
        maskCtx.clearRect(minX - extraMargin, minY - extraMargin, (maxX - minX) + extraMargin * 2, (maxY - minY) + extraMargin * 2);
      };

      // Example landmark indices for the eyes (adjust as needed for your face mesh)
      const rightEyeIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133];
      const leftEyeIndices = [263, 249, 390, 373, 374, 380, 381, 382, 362];

      // Subtract eye regions with an extra margin (e.g., 8 pixels)
      subtractEyeRegion(rightEyeIndices, 8);
      subtractEyeRegion(leftEyeIndices, 8);

      // Reset composite operation
      maskCtx.globalCompositeOperation = "source-over";

      // Apply blur to smooth edges
      const imageData = maskCtx.getImageData(0, 0, width, height);
      StackBlur.imageDataRGBA(imageData, 0, 0, width, height, 60);
      maskCtx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.log(error);
    }
    return maskCanvas;
  }
};
