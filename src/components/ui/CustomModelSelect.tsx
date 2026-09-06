import { useEffect } from "react";
import APIClass from "@/classes/API";
import { useAppStore } from "@/store/app";

const API = new APIClass();

type CustomModelSelectProps = {
	editObject?: object | boolean;
	report?: boolean;
	nullOption?: boolean;
	multiple?: boolean;
};

export default function CustomModelSelect(_props: CustomModelSelectProps) {
	const customModelOptions = useAppStore((state) => state.customModelOptions);
	const selectedCustomModelOption = useAppStore((state) => state.selectedCustomModelOption);

	const toggleItem = (option: any) => {
		useAppStore.setState({ selectedCustomModelOption: option });
	};

	const getOptions = async () => {
		const nextOptions: any[] = [];
		const hardRuleRes = await API.getSystemModels();
		if ( hardRuleRes.success == true && Array.isArray(hardRuleRes.results) ) {
			for await ( const hardRule of hardRuleRes.results ) {
				const customModelOption: any = {};
				customModelOption["label"] = hardRule.name;
				customModelOption["value"] = hardRule.id;
				if ( !nextOptions.includes(customModelOption) ) {
					nextOptions.push(customModelOption);
				}
			}
		}
		return nextOptions;
	};

	useEffect(() => {
		const loadPage = async () => {
			if ( useAppStore.getState().authenticated == true ) {
				useAppStore.setState({ customModelOptions: await getOptions() });
			}
		};
		loadPage();
	}, []);

	if ( !customModelOptions ) {
		return null;
	}

	return (
		<select
			className="customSelect"
			value={(selectedCustomModelOption?.value as string) ?? ""}
			onChange={(event) => {
				const option = customModelOptions.find((item) => String(item.value) === event.target.value);
				if ( option ) {
					toggleItem(option);
				}
			}}
		>
			{customModelOptions.map((item) => (
				<option key={String(item.value)} value={String(item.value ?? "")}>
					{item.value != null ? (item.label as string) : "None"}
				</option>
			))}
		</select>
	);
}
