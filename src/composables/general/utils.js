export const useUtils = () => {
	const wait = async (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

	const runWithMinDelay = async (callback, duration) => {
		const start = performance.now();
		const data = await callback();
		const elapsed = performance.now() - start;
		const diff = duration - elapsed;

		if (diff > 0) {
			await wait(diff);
		}

		return data;
	};

	return {
		wait,
		runWithMinDelay,
	};
};
