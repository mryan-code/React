import * as types from "../types";

function isEmail(email: any): any {
	try {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (emailRegex.test(email)) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.error("isEmail error: ", error);
		return false;
	}
}

export { isEmail };
