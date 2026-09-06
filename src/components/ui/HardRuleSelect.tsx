import { useEffect } from "react";
import { X } from "lucide-react";
import APIClass from "@/classes/API";
import { useAppStore } from "@/store/app";

const API = new APIClass();

type HardRuleSelectProps = {
	editObject?: object | boolean;
	report?: boolean;
	nullOption?: boolean;
	multiple?: boolean;
	onUpdateHardRule?: (value: { hard_rule_id: any }) => void;
};

export default function HardRuleSelect({
	editObject = false,
	report = false,
	nullOption = true,
	multiple = false,
	onUpdateHardRule,
}: HardRuleSelectProps) {
	const hardRuleOptions = useAppStore((state) => state.hardRuleOptions);
	const selectedHardRuleOptions = useAppStore((state) => state.selectedHardRuleOptions);

	const toggleItem = (option: any) => {
		let nextSelected = useAppStore.getState().selectedHardRuleOptions;
		if ( nextSelected == null ) {
			nextSelected = [];
		}
		if ( multiple == false ) {
			useAppStore.setState({ selectedHardRuleOptions: [option] });
			return;
		}
		if ( option.value == null ) {
			useAppStore.setState({ selectedHardRuleOptions: [] });
			return;
		}
		if ( !nextSelected.includes(option) ) {
			useAppStore.setState({ selectedHardRuleOptions: [...nextSelected, option] });
		}
	};

	const removeItem = (option: any) => {
		const nextSelected = (useAppStore.getState().selectedHardRuleOptions || []).filter(
			(selectedOption) => selectedOption.value != option.value,
		);
		useAppStore.setState({ selectedHardRuleOptions: nextSelected.length == 0 ? null : nextSelected });
	};

	const getOptions = async () => {
		const nextOptions: any[] = [];
		if ( nullOption === true ) {
			nextOptions.push({
				label: "None",
				value: null,
			});
		}
		const hardRuleRes = await API.getRules();
		if ( hardRuleRes.success == true && Array.isArray(hardRuleRes.results) ) {
			for await ( const hardRule of hardRuleRes.results ) {
				const hardRuleOption: any = {};
				hardRuleOption["label"] = hardRule.name;
				hardRuleOption["value"] = hardRule.id;
				if ( !nextOptions.includes(hardRuleOption) ) {
					nextOptions.push(hardRuleOption);
				}
			}
		}
		return nextOptions;
	};

	useEffect(() => {
		const loadPage = async () => {
			if ( useAppStore.getState().authenticated == true ) {
				useAppStore.setState({ hardRuleOptions: await getOptions() });
			}
		};
		loadPage();
	}, []);

	useEffect(() => {
		if ( report == true ) {
			return;
		}
		if ( editObject && selectedHardRuleOptions && selectedHardRuleOptions[0] ) {
			onUpdateHardRule?.({
				hard_rule_id: selectedHardRuleOptions[0],
			});
		}
	}, [editObject, onUpdateHardRule, report, selectedHardRuleOptions]);

	if ( !hardRuleOptions ) {
		return null;
	}

	return (
		<div className="customSelect">
			{multiple && selectedHardRuleOptions
				? selectedHardRuleOptions.map((item) => (
						<span className="customOption" key={String(item.value)}>
							{item.value != null ? (
								<span>
									<span className="customOptionLabel">{item.label as string}</span>
									<X className="customOptionRemove" onClick={() => removeItem(item)} />
								</span>
							) : (
								<span>None</span>
							)}
						</span>
					))
				: null}
			<select
				value={
					multiple
						? ""
						: String(selectedHardRuleOptions?.[0]?.value ?? "")
				}
				onChange={(event) => {
					const option = hardRuleOptions.find((item) => String(item.value) === event.target.value);
					if ( option ) {
						toggleItem(option);
					}
				}}
			>
				{hardRuleOptions.map((item) =>
					item.value != null ? (
						<option key={String(item.value)} value={String(item.value)}>
							{item.label as string}
						</option>
					) : (
						<option key="none" value="">
							None
						</option>
					),
				)}
			</select>
		</div>
	);
}
