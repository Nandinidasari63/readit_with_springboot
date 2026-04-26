import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth } from "./components/Auth.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth />
  </StrictMode>,
);
