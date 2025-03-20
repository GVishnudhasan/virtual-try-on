import { Camera } from "@mediapipe/camera_utils";
import React from "react";

export const startCamera = (videoRef: HTMLVideoElement, 
  faceMesh: { send: (arg0: { image: HTMLVideoElement; }) => any; },
  cameraRef: React.MutableRefObject<Camera | null>
) => {

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