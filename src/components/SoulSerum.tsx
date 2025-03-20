import React, { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { startCamera } from "../utils/cam";
import { buildFaceMeshes } from "../utils/buildMesh";
import { drawSoulSerum } from "../utils/drawing/serum/drawSoulSerum";

interface FaceMeshProps {
  onResults?: (results: any) => void;
}

const SoulSerumAR: React.FC<FaceMeshProps> = ({ onResults }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // For optional before/after slider, see your existing approach
  // or omit if you just want a single full-face effect.

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const updateCanvasDimensions = () => {
      if (videoRef.current && canvasRef.current) {
        const videoWidth = videoRef.current.videoWidth || 640;
        const videoHeight = videoRef.current.videoHeight || 480;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
      }
    };

    const handleVideoMetadata = () => {
      updateCanvasDimensions();
      setIsLoading(false);
    };

    const processResults = (results: { multiFaceLandmarks: any[][] }) => {
      // call your drawing function
      if (!canvasRef.current || !videoRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw the live video first
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Then apply the watery glow effect
      drawSoulSerum(results, canvas, ctx);

      // If needed, pass results up to parent
      if (onResults) onResults(results);
    };

    // Build your Face Mesh detection pipeline
    const faceMesh = buildFaceMeshes(
      canvasRef.current,
      videoRef.current,
      processResults,
      drawSoulSerum,
      "" // no color param needed
    );

    // Start the camera
    startCamera(videoRef.current, faceMesh, cameraRef);

    // Listen for video loaded
    videoRef.current.addEventListener("loadedmetadata", handleVideoMetadata);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", handleVideoMetadata);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] max-w-6xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-4">
        Soul Serum Watery Glow Try-On
      </h1>
      <div className="relative w-full h-full rounded overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <video
          ref={videoRef}
          className="hidden"
          autoPlay
          muted
          playsInline
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoulSerumAR;
