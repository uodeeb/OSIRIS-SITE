import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/cinematic.css";
import "./styles/enhanced-cinematic-music.css";
import "./styles/osiris-complete-experience.css";
import "./styles/osiris-complete-novel.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
