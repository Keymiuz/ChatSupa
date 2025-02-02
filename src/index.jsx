import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");
const reactRoot = ReactDOM.createRoot(root);

try {
  reactRoot.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error("Error rendering app:", error);
  root.innerHTML = "Error loading application. Check console for details.";
}
