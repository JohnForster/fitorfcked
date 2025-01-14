import { useEffect, useRef, useState } from "react";
import Camera from "jslib-html5-camera-photo";
import { removeBackground } from "@imgly/background-removal";

import "./UploadImage.css";
import smartcrop from "smartcrop";

// let libCameraPhoto = null;
export const UploadImagePage = () => {
  const [dataUri, setDataUri] = useState("");
  const [blob, setBlob] = useState(new Blob());
  const [title, setTitle] = useState("");
  const [camera, setCamera] = useState<Camera | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (videoRef.current) {
      const camera = new Camera(videoRef.current);
      camera.startCamera("user").catch((err) => setError(typeof err));
      setCamera(camera);
    }
  }, [videoRef]);

  function capturePhoto() {
    console.log("capturing...");
    const uri = camera?.getDataUri({});
    console.log("uri:", uri);
    if (uri) {
      setDataUri(uri);
    }
  }
  // HTMLOrSVGImageElement |
  //   HTMLVideoElement |
  //   HTMLCanvasElement |
  //   ImageBitmap |
  //   OffscreenCanvas |
  //   VideoFrame;
  async function processImage(url: string) {
    const imgEl = document.createElement("img");
    imgEl.setAttribute("src", url);
    const minDimension = Math.min(imgEl.height, imgEl.width);
    const cropResult = await smartcrop.crop(imgEl, {
      height: minDimension,
      width: minDimension,
    });
    const uncroppedBlob = await (await fetch(url)).blob();
    const bitmap = await createImageBitmap(uncroppedBlob);
    const { x, y, width, height } = cropResult.topCrop;
    const croppedImage = await cropImageBitmap(bitmap, x, y, width, height);

    const croppedBlob = await removeBackground(croppedImage);

    setBlob(croppedBlob);
    const uri = URL.createObjectURL(croppedBlob);
    setDataUri(uri);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const imageFile = new File([blob], "upload.png");
    const formData = new FormData();
    formData.set("title", title);
    formData.set("file", imageFile);
    const token = localStorage.getItem("authToken");
    fetch("/api/activity/new", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return (
    <>
      {error && <p>Error: {error}</p>}
      <div className="cameraView">
        {dataUri && (
          <>
            <img src={dataUri}></img>
            <div>
              <button onClick={() => setDataUri("")}>Retake</button>
              <button onClick={() => processImage(dataUri)}>Process</button>
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                onChange={(e) => setTitle(e.target.value)}
              />
              <input type="submit" value="Upload" />
            </form>
          </>
        )}
      </div>
      <div
        className="cameraView"
        style={{ display: dataUri ? "none" : "flex" }}
      >
        <video ref={videoRef} autoPlay={true} muted={true} playsInline></video>
        <div
          className="captureButton"
          role="button"
          onClick={capturePhoto}
        ></div>
      </div>
    </>
  );
};

async function cropImageBitmap(
  imageBitmap: ImageBitmap,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<Blob> {
  // Create a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Set canvas size to desired crop dimensions
  canvas.width = width;
  canvas.height = height;

  // Draw the portion we want to crop
  ctx.drawImage(imageBitmap, x, y, width, height, 0, 0, width, height);

  // Create new ImageBitmap from the cropped area
  return new Promise((res) => canvas.toBlob((x) => res(x!)));
}
