import { describe, expect, it } from "vitest";
import { displayDuration } from "@/functions/displayDuration";

describe("displayDuration", () => {
	it("formats seconds as mm:ss", () => {
		expect(displayDuration(125)).toBe("02:05");
	});

	it("keeps leading zeros for short durations", () => {
		expect(displayDuration(5)).toBe("00:05");
	});
});
