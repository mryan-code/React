// Deprecated Vue composable. Unused after the React conversion.
// import { computed, ref } from "vue";
const ref = (value) => ({ value });
const computed = (fn) => ({ get value() { return fn(); } });

export const useFilters = () => {
	const filters = ref({});

	const apply = (list) => {
		const fields = Object.keys(filters.value);
		if (!fields.length) return list;

		return list.filter((agent) => {
			return fields.every((field) => agent[field] === filters.value[field]);
		});
	};

	const toggle = (field, value) => {
		const previous = { ...filters.value };

		if (value === null) {
			delete previous[field];
		} else {
			previous[field] = value;
		}

		filters.value = previous;
	};

	const reset = () => {
		filters.value = {};
	};

	const list = computed(() => filters.value);

	return {
		list,
		toggle,
		reset,
		apply,
	};
};
