import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import "./assets/styles/index.scss";

// React entry. Vue's createApp/pinia/vuetify bootstrap is replaced by React Router + Zustand.
createRoot(document.getElementById("app") as HTMLElement).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>,
);
