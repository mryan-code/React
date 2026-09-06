import { ReactNode } from "react";

type TooltipProps = {
	text: ReactNode;
	children: ReactNode;
	location?: string;
};

// Simple hover tooltip so Lucide menu labels still work without Vuetify.
export default function Tooltip({ text, children }: TooltipProps) {
	return (
		<span className="reactTooltip" title={typeof text === "string" ? text : undefined}>
			{children}
			<span className="reactTooltipText">{text}</span>
		</span>
	);
}
