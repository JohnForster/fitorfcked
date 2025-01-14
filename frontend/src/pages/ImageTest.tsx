import { useEffect, useState } from "react";

import { removeBackground } from "@imgly/background-removal";

export const ImageTest = () => {
  const [blob, setBlob] = useState<Blob | null>(null);

  // Add Component Logic Here
  const IMAGE_URL =
    "https://storage.googleapis.com/get-fit-images/0133f794-82ba-41ed-acad-e87ed4455615.jpg";
  useEffect(() => {
    processImage(IMAGE_URL).then((blob) => setBlob(blob));
  });

  const url = blob ? URL.createObjectURL(blob) : IMAGE_URL;
  return (
    <>
      <img src={url}></img>
    </>
  );
};

async function processImage(url: string) {
  const imgBlob = await removeBackground(url);
  return imgBlob;
}
