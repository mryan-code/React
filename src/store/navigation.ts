// Holds React Router's navigate so Zustand actions can redirect without importing router hooks.
type AppNavigate = (path: string, options?: { replace?: boolean }) => void;

let navigateFn: AppNavigate | null = null;

export function bindNavigate(fn: AppNavigate) {
	navigateFn = fn;
}

export function appNavigate(path: string, options?: { replace?: boolean }) {
	if ( navigateFn ) {
		navigateFn(path, options);
		return;
	}
	if ( options?.replace ) {
		window.location.replace(path);
		return;
	}
	window.location.assign(path);
}
