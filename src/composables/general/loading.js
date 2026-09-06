// Deprecated Vue composable. Unused after the React conversion.
// import { ref } from "vue";
const ref = (value) => ({ value });

export const useLoading = (initialLoading = false) => {
	const loading = ref(initialLoading);

	const startLoading = () => {
		loading.value = true;
	};

	const stopLoading = () => {
		loading.value = false;
	};

	return {
		loading,
		startLoading,
		stopLoading,
	};
};
