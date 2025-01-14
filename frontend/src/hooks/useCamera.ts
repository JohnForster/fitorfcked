import { useState, useEffect, RefObject } from "react";
import LibCameraPhoto, { CaptureConfigOption } from "jslib-html5-camera-photo";

let libCameraPhoto: LibCameraPhoto | null = null;
let needToClean = false;

type Resolution = {
  width: number;
  height: number;
};
type FacingMode = "user" | "environment";

export function useCamera(
  videoRef: RefObject<HTMLVideoElement>,
  idealFacingMode: FacingMode,
  idealResolution: Resolution,
  isMaxResolution: boolean
): [
  MediaStream | null,
  unknown,
  unknown,
  (c: CaptureConfigOption) => string | undefined
] {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraStartError, setCameraStartError] = useState<unknown>(null);
  const [cameraStopError, setCameraStopError] = useState<unknown>(null);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      libCameraPhoto = new LibCameraPhoto(videoRef.current);
    }
  }, [videoRef]);

  useEffect(() => {
    async function enableStream() {
      needToClean = true;
      try {
        let _mediaStream = null;
        if (isMaxResolution) {
          _mediaStream = await libCameraPhoto?.startCameraMaxResolution(
            idealFacingMode
          );
        } else {
          _mediaStream = await libCameraPhoto?.startCamera(
            idealFacingMode,
            idealResolution
          );
        }
        if (videoRef && videoRef.current && _mediaStream) {
          setMediaStream(_mediaStream);
          setCameraStartError(null);
        } else {
          await libCameraPhoto?.stopCamera();
        }
      } catch (cameraStartError) {
        if (videoRef && videoRef.current) {
          setCameraStartError(cameraStartError);
        }
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      async function cleanup() {
        try {
          if (needToClean) {
            needToClean = false;
            await libCameraPhoto?.stopCamera();
          }

          // protect setState from component umonted error
          // when the component is umonted videoRef.current == null
          if (videoRef && videoRef.current) {
            setMediaStream(null);
            setCameraStopError(null);
          }
        } catch (cameraStopError) {
          setCameraStopError(cameraStopError);
        }
      }
      return () => {
        cleanup();
      };
    }
  }, [
    videoRef,
    mediaStream,
    idealFacingMode,
    idealResolution,
    isMaxResolution,
  ]);

  function getDataUri(configDataUri: CaptureConfigOption) {
    return libCameraPhoto?.getDataUri(configDataUri);
  }

  return [mediaStream, cameraStartError, cameraStopError, getDataUri];
}
