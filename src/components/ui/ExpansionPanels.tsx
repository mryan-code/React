import { ReactNode, createContext, useContext } from "react";

type ExpansionPanelsContextValue = {
	value: string | string[] | null;
	onChange: (value: string) => void;
};

const ExpansionPanelsContext = createContext<ExpansionPanelsContextValue>({
	value: null,
	onChange: () => {},
});

type ExpansionPanelsProps = {
	modelValue?: string | string[] | null;
	onUpdate?: (value: string | string[] | null) => void;
	id?: string;
	children: ReactNode;
};

export function ExpansionPanels({ modelValue = null, onUpdate, id, children }: ExpansionPanelsProps) {
	const onChange = (nextValue: string) => {
		if ( Array.isArray(modelValue) ) {
			if ( modelValue.includes(nextValue) ) {
				onUpdate?.(modelValue.filter((item) => item !== nextValue));
				return;
			}
			onUpdate?.([...modelValue, nextValue]);
			return;
		}
		onUpdate?.(modelValue === nextValue ? null : nextValue);
	};

	return (
		<div id={id} className="v-expansion-panels">
			<ExpansionPanelsContext.Provider value={{ value: modelValue, onChange }}>
				{children}
			</ExpansionPanelsContext.Provider>
		</div>
	);
}

type ExpansionPanelProps = {
	value?: string;
	title?: ReactNode;
	children: ReactNode;
};

export function ExpansionPanel({ value = "", title, children }: ExpansionPanelProps) {
	const context = useContext(ExpansionPanelsContext);
	const isOpen = Array.isArray(context.value) ? context.value.includes(value) : context.value === value;

	return (
		<div className={`v-expansion-panel${isOpen ? " v-expansion-panel--active" : ""}`}>
			<button
				type="button"
				className="v-expansion-panel-title"
				onClick={() => context.onChange(value)}
			>
				{title}
			</button>
			{isOpen ? <div className="v-expansion-panel-text">{children}</div> : null}
		</div>
	);
}

type TabsProps = {
	modelValue: string;
	onUpdate: (value: string) => void;
	children: ReactNode;
};

export function Tabs({ modelValue, onUpdate, children }: TabsProps) {
	return (
		<div className="v-tabs">
			<TabsContext.Provider value={{ value: modelValue, onChange: onUpdate }}>
				{children}
			</TabsContext.Provider>
		</div>
	);
}

const TabsContext = createContext<{ value: string; onChange: (value: string) => void }>({
	value: "",
	onChange: () => {},
});

type TabProps = {
	value: string;
	children: ReactNode;
};

export function Tab({ value, children }: TabProps) {
	const context = useContext(TabsContext);
	return (
		<button
			type="button"
			className={`v-tab${context.value === value ? " v-tab--selected" : ""}`}
			onClick={() => context.onChange(value)}
		>
			{children}
		</button>
	);
}

type TabsWindowProps = {
	modelValue: string;
	children: ReactNode;
};

const TabsWindowContext = createContext<string>("");

export function TabsWindow({ modelValue, children }: TabsWindowProps) {
	return (
		<div className="v-tabs-window">
			<TabsWindowContext.Provider value={modelValue}>{children}</TabsWindowContext.Provider>
		</div>
	);
}

type TabsWindowItemProps = {
	value: string;
	children: ReactNode;
};

export function TabsWindowItem({ value, children }: TabsWindowItemProps) {
	const active = useContext(TabsWindowContext);
	if ( active !== value ) {
		return null;
	}
	return <div className="v-tabs-window-item">{children}</div>;
}
