import { Component, ReactNode } from "react";
import { useAppStore } from "@/store/app";

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

// Replaces Vue onErrorCaptured so store.logError still receives runtime errors.
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = {
		hasError: false,
	};

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error) {
		useAppStore.getState().logError(error);
	}

	render() {
		if ( this.state.hasError ) {
			return null;
		}
		return this.props.children;
	}
}
