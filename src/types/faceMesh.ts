import { NormalizedLandmarkList, Results } from "@mediapipe/face_mesh";

export interface FaceMeshResult extends Partial<Results> {
  multiFaceLandmarks?: NormalizedLandmarkList[];
} 