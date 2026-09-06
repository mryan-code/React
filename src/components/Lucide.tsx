import { useEffect, useState } from "react";
import * as functions from "@/functions";
import { useAppStore } from "@/store/app";

type LucideProps = {
	name: string;
	size?: number | string;
	color?: string;
	strokeWidth?: number | string;
};

function toPascalCase(name: string) {
	return name
		.split(/[-_\s]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
}

// Dynamic lucide-react icon lookup. Replaces the Vue Lucide wrapper.
export default function Lucide({ name, size, color, strokeWidth }: LucideProps) {
	const globalVars = useAppStore((state) => state.globalVars);
	const [Icon, setIcon] = useState<any>(null);

	useEffect(() => {
		let cancelled = false;
		const load = async () => {
			try {
				const kebabName = await functions.lucideIcon(name);
				const pascalName = toPascalCase(kebabName);
				const mod: any = await import("lucide-react");
				const nextIcon = mod[pascalName] || mod[name] || null;
				if ( !cancelled ) {
					setIcon(() => nextIcon);
				}
			} catch ( error ) {
				if (
					globalVars.GLOBAL_DEBUG_LEVEL == "errors" ||
					globalVars.GLOBAL_DEBUG_LEVEL == "warnings" ||
					globalVars.GLOBAL_DEBUG_LEVEL == "info" ||
					globalVars.DEBUG_USER == "mryan"
				) {
					console.error(`Icon "${name}" not found`, error);
				}
				if ( !cancelled ) {
					setIcon(null);
				}
			}
		};
		if ( name ) {
			load();
		}
		return () => {
			cancelled = true;
		};
	}, [globalVars, name]);

	if ( !name || !Icon ) {
		return null;
	}

	return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
