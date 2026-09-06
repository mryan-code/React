export const useFile = () => {
	const download = (name, content, contentType) => {
		const blob = new Blob([content], { type: contentType });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");

		link.href = url;
		link.setAttribute("download", name);

		document.body.appendChild(link);

		link.click();
		link.remove();
	};

	return {
		download,
	};
};
