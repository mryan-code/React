import pagesJson from "./pages.json";
import * as types from "@/types";
import APIClass from "@/classes/API";
import { useAppStore } from "@/store/app";

export interface PageRouteDefinition {
	path: string;
	name: string;
	meta: Record<string, unknown>;
	component: string;
	props?: boolean;
}

export const pages = pagesJson as PageRouteDefinition[];

// Optional API-backed page list. The live router still uses pages.json, matching the Vue app.
export async function loadPagesFromAPI() {
	const API = new APIClass();
	const appStore = useAppStore.getState();
	try {
		const response: types.KeyValue = await API.getPages();
		if ( appStore.globalVars?.GLOBAL_DEBUG_LEVEL == "debug" || appStore.globalVars?.DEBUG_USER == "foobar" ) {
			console.log("pages.ts response: ", JSON.parse(JSON.stringify(response)));
		}
		return response.results;
	} catch ( error ) {
		console.log("error", error);
		return [];
	}
}
