import { defineConfig } from "cypress";
export default defineConfig({
	projectId: "sgfmv1",
	e2e: {
		supportFile: false,
		defaultCommandTimeout: 10000,
		// CI overrides this via CYPRESS_baseUrl → http://localhost:8080
		baseUrl: "http://localhost:8080",
	},
});
