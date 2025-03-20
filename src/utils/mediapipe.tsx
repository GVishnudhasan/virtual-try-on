  import { FaceMesh } from '@mediapipe/face_mesh';
  import * as mpFaceMesh from '@mediapipe/face_mesh';


let faceMeshInstance: FaceMesh | null = null;

export const getFaceMeshInstance = (onResults: (results: any) => void): FaceMesh => {
  if (!faceMeshInstance) {
    faceMeshInstance = new FaceMesh({
      locateFile: (file) => `https://mediapipe-spotkwik.s3.ap-south-1.amazonaws.com/mesh/${file}`,
    });

    faceMeshInstance.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }

  // Update the results callback dynamically
  faceMeshInstance.onResults(onResults);

  return faceMeshInstance;
};
