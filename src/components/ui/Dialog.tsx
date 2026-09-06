import { ReactNode, useEffect } from "react";

type DialogProps = {
	modelValue: boolean;
	onClose?: () => void;
	className?: string;
	persistent?: boolean;
	children: ReactNode;
};

// Lightweight replacement for Vuetify v-dialog. Keeps existing dialogue class names.
export default function Dialog({
	modelValue,
	onClose,
	className = "",
	persistent = false,
	children,
}: DialogProps) {
	useEffect(() => {
		if ( !modelValue || persistent ) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if ( event.key === "Escape" ) {
				onClose?.();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [modelValue, onClose, persistent]);

	if ( !modelValue ) {
		return null;
	}

	return (
		<div
			className={className}
			onClick={(event) => {
				if ( persistent ) {
					return;
				}
				if ( event.target === event.currentTarget ) {
					onClose?.();
				}
			}}
		>
			{children}
		</div>
	);
}
