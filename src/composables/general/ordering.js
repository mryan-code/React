// Deprecated Vue composable. Unused after the React conversion.
// import { computed, reactive } from "vue";
const reactive = (value) => value;
const computed = (fn) => ({ get value() { return fn(); } });

export const useOrdering = () => {
	const ordering = reactive({
		field: null,
		direction: 1,
	});

	const field = computed(() => ordering.field);
	const direction = computed(() => ordering.direction);

	const is = (field) => ordering.field === field;

	const directionFor = (field) => {
		return is(field) ? ordering.direction : null;
	};

	const toggle = (field) => {
		if (ordering.field !== field) {
			ordering.field = field;
			ordering.direction = 1;
		} else {
			ordering.direction = -ordering.direction;
		}
	};

	const reset = () => {
		ordering.field = null;
		ordering.direction = 1;
	};

	const apply = (list) => {
		return list.toSorted((a, b) => {
			return a[ordering.field] > b[ordering.field] ? ordering.direction : -ordering.direction;
		});
	};

	return {
		field,
		direction,
		is,
		directionFor,
		reset,
		toggle,
		apply,
	};
};
