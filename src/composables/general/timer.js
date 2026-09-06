// Deprecated Vue composable. Unused after the React conversion.
// import { computed, ref } from "vue";
const ref = (value) => ({ value });
const computed = (fn) => ({ get value() { return fn(); } });

export const useTimer = () => {
	const time = ref(null);
	const interval = ref(null);

	const timerTime = computed(() => {
		if (!time.value) return "N/A";

		const format = (num) => (num >= 10 ? num : `0${num}`);

		const hours = format(time.value.getHours());
		const minutes = format(time.value.getMinutes());
		const seconds = format(time.value.getSeconds());

		return `${hours}:${minutes}:${seconds}`;
	});

	const updateTimer = () => {
		time.value = new Date();
	};

	const startTimer = (callback, delay) => {
		interval.value = setInterval(callback, delay);
	};

	const stopTimer = () => {
		if (!interval.value) return;

		clearInterval(interval.value);
		interval.value = null;
	};

	return {
		timerTime,
		updateTimer,
		startTimer,
		stopTimer,
	};
};
