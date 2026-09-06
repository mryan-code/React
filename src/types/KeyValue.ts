import moment from "moment-timezone";
export type KeyValue = {
	[key: string]:
		| string
		| undefined
		| number
		| boolean
		| KeyValue
		| KeyValue[]
		| null
		| moment.Moment
		| NodeJS.Timeout
		| string[]
		| any[];
};
