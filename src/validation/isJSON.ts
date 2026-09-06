import * as types from "../types";

function isJSON(text: any): any {
	try {
		JSON.parse(text);
		return true;
	} catch (error) {
		return false;
	}
}

export { isJSON };
