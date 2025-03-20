import { FaceMeshResult } from "../../../types/faceMesh";
import { FACEMESH_FACE_OVAL } from "@mediapipe/face_mesh";

let selectedColor = "#E8BE93"; // Default foundation color

export const setFoundationColor = (color: string) => {
  selectedColor = color;
};

export const drawFoundation = (
  results: FaceMeshResult,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => {
  const width = canvas.width;
  const height = canvas.height;

  ctx.save();

  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      // Draw face foundation
      ctx.beginPath();
      ctx.fillStyle = selectedColor;
      ctx.globalAlpha = 0.3; // Adjust opacity for natural look

      // Draw using face oval landmarks
      ctx.moveTo(
        landmarks[FACEMESH_FACE_OVAL[0][0]].x * width,
        landmarks[FACEMESH_FACE_OVAL[0][0]].y * height
      );

      for (const [index] of FACEMESH_FACE_OVAL) {
        ctx.lineTo(
          landmarks[index].x * width,
          landmarks[index].y * height
        );
      }

      ctx.closePath();
      ctx.fill();

      // Add some contouring/shading
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width / 3
      );
      gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.1)');

      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  ctx.restore();
}; 