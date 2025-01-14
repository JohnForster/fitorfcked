import { useRef, useState } from "react";

import { useCamera } from "../hooks/useCamera";

import "./UploadImage.css";

// let libCameraPhoto = null;
export const UploadImagePage = () => {
  const [dataUri, setDataUri] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const [, _cameraStartError, _cameraStopError, _getDataUri] = useCamera(
    videoRef,
    "user",
    { width: 640, height: 480 },
    false
  );

  function capturePhoto() {
    const uri = _getDataUri({});
    if (uri) {
      setDataUri(uri);
    }
  }

  if (_cameraStartError) console.error(_cameraStartError);
  if (_cameraStopError) console.error(_cameraStopError);
  return (
    <>
      {_cameraStartError && (
        <p>Start Error: {JSON.stringify(_cameraStartError)}</p>
      )}
      {_cameraStopError && (
        <p>Stop Error: {JSON.stringify(_cameraStopError)}</p>
      )}
      <div className="cameraView">
        <video ref={videoRef} autoPlay={true} muted={true} playsInline></video>
        <div
          className="captureButton"
          role="button"
          onClick={capturePhoto}
        ></div>
      </div>
      <img src={dataUri}></img>
    </>
  );
};
