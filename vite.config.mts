import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

// Vite replaces Vue CLI. Keep VUE_APP_* env names so existing backend/frontend config still works.
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const mergedEnv = { ...process.env, ...env };
	const defineEnv: Record<string, string> = {};
	for ( const [key, value] of Object.entries(mergedEnv) ) {
		if ( value !== undefined ) {
			defineEnv[`process.env.${key}`] = JSON.stringify(value);
		}
	}

	const server: Record<string, unknown> = {
		port: Number(mergedEnv.VUE_APP_FRONTEND_PORT || 8080),
		host: mergedEnv.VUE_APP_FRONTEND_HOST || "localhost",
		allowedHosts: true,
	};

	if ( mergedEnv.VUE_APP_FRONTEND_PROTOCOL === "https" && mergedEnv.VUE_APP_ENV ) {
		const certPath = path.resolve("certificates/" + mergedEnv.VUE_APP_ENV + "-cert.pem");
		const keyPath = path.resolve("certificates/" + mergedEnv.VUE_APP_ENV + "-key.pem");
		if ( existsSync(certPath) && existsSync(keyPath) ) {
			server.https = {
				cert: readFileSync(certPath),
				key: readFileSync(keyPath),
			};
		}
	}

	return {
		plugins: [react()],
		resolve: {
			alias: {
				"@": path.resolve(configDir, "src"),
			},
		},
		define: defineEnv,
		server,
		preview: {
			port: Number(mergedEnv.VUE_APP_FRONTEND_PORT || 8080),
			host: mergedEnv.VUE_APP_FRONTEND_HOST || "localhost",
		},
	};
});
