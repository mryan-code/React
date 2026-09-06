import * as types from "../types";
import { convertToCamelCase } from "./convertToCamelCase";

function slugify(text: string) {
	// const returnValue = ref(text);
	// console.log("returnValue: " + returnValue.value);
	// try {
	// 	returnValue.value = returnValue.value.toString().toLocaleLowerCase();
	// 	console.log("returnValue2: " + returnValue.value);
	// 	returnValue.value = returnValue.value.replaceAll(/\_/g, " ");
	// 	console.log("returnValue3: " + returnValue.value);
	// 	returnValue.value = returnValue.value.replaceAll(/[^\w ]+/g, " ");
	// 	console.log("returnValue4: " + returnValue.value);
	// 	//returnValue.value = returnValue.value.replace(/ +/g, "-");
	// 	//returnValue.value = convertToCamelCase(returnValue.value);
	// 	//console.log("returnValue5: " + returnValue.value);
	// } catch (error) {
	//  console.error("slugify error: ", error);
	// 	returnValue.value = text;
	// } finally {
	// 	return returnValue.value;
	// }
}

async function fieldSlug(text: string) {
	let returnValue = text;
	try {
		returnValue = returnValue.toString().toLowerCase();
		returnValue = returnValue.replace(/(?:[\w]+[.])?/, "");
		returnValue = returnValue.replaceAll("_", " ");
		returnValue = returnValue.replace("id", "ID");
		return returnValue;
	} catch (error) {
		console.error("fieldSlug error: ", error);
		return text;
	}
}

async function lucideIcon(text: string) {
	let returnValue = text;
	try {
		// on each occurrence of an uppercase letter (except the first), insert a dash before it
		returnValue = returnValue.replace(/([A-Z])/g, "-$1").replace(/^-/, "");
		returnValue = returnValue.toString().toLowerCase();
		return returnValue;
	} catch (error) {
		console.error("lucideIcon error: ", error);
		return text;
	}
}
export { slugify, fieldSlug, lucideIcon };
