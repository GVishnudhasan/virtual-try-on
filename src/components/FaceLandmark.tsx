// src/components/FaceMesh.tsx
import React, { useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { getFaceMeshInstance } from "../utils/mediapipe";

interface FaceMeshProps {
  onResults?: (results: any) => void; // Optional callback for processing results
}

const FaceMesh: React.FC<FaceMeshProps> = ({ onResults }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvasCtx = canvasRef.current.getContext("2d");
    console.log("onResults")
    const faceMesh = buildFaceMeshes(onResults);
    // Initialize and start the camera
    startCamera(videoRef.current, faceMesh);
  }, [onResults]);


  const buildFaceMeshes = (onResults: ((results: any) => void) | undefined ) => {
    return  getFaceMeshInstance((results: { multiFaceLandmarks: any[][]; }, ) => {
        if (!videoRef.current || !canvasRef.current) return;
    
        const canvasCtx = canvasRef.current.getContext("2d");
        if (canvasCtx && videoRef.current && canvasRef.current) {
          canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          canvasCtx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
          // Draw the landmarks
          drawLandmarks(results, canvasRef.current, canvasCtx);
          if (onResults) onResults(results);
        }
      });
  }

  const startCamera = (videoRef: HTMLVideoElement, faceMesh: { send: (arg0: { image: HTMLVideoElement; }) => any; }) => {

    const camera = new Camera(videoRef, {
        onFrame: async () => {
            await faceMesh.send({ image: videoRef });
        },
        width: 640,
        height: 480,
      });
  
      camera.start();
      cameraRef.current = camera;

      return () => {
        camera.stop();
      };
  }



  const drawLandmarks = (results: { multiFaceLandmarks: any[][]; }, canvasRef: HTMLCanvasElement, canvasCtx: CanvasRenderingContext2D) => {
    if (results.multiFaceLandmarks) {
        results.multiFaceLandmarks.forEach((landmarks: any[]) => {
          canvasCtx.fillStyle = "red";
          landmarks.forEach((landmark) => {
            const x = landmark.x * canvasRef.width;
            const y = landmark.y * canvasRef.height;
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 2, 0, 2 * Math.PI);
            canvasCtx.fill();
          });
        });
      }
  }

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <video
        ref={videoRef}
        className="face-mesh-video"
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        autoPlay
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="face-mesh-canvas"
        style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
        width="640"
        height="480"
      />
    </div>
  );
};

export default FaceMesh;
