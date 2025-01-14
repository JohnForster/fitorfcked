import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

import { HomePage } from "./pages/HomePage";
import { SignupPage } from "./pages/SignupPage";
import { AppLayout } from "./layouts/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { Board } from "./pages/Board/Board";
import { ImageTest } from "./pages/ImageTest";
import { UploadImagePage } from "./pages/UploadImage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Board />} />
        </Route>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/imageTest" element={<ImageTest />} />
        <Route path="/upload" element={<UploadImagePage />} />
        <Route index element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
