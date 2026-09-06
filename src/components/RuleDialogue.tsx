import { useAppStore } from "@/store/app";
import * as types from "@/types";
import Dialog from "@/components/ui/Dialog";

export default function RuleDialogue() {
	const ruleDialogue = useAppStore((state) => state.ruleDialogue);
	const rule = useAppStore((state) => state.rule);

	const updateRule = (key: string, value: string | number) => {
		const currentRule = useAppStore.getState().rule;
		if ( !currentRule ) {
			return;
		}
		useAppStore.setState({
			rule: {
				...currentRule,
				[key]: value,
			},
		});
	};

	return (
		<Dialog
			modelValue={ruleDialogue}
			onClose={async () => await useAppStore.getState().toggleRuleDialog(false)}
			className="dialogueWrapper"
		>
			<div className="dialogue">
				<div className="dialogueHeader">
					<div className="dialogueTitle">
						<h3>{rule && rule.global_rule_id !== null ? "Edit" : "Add"} Rule</h3>
					</div>
				</div>
				<div className="dialogueContent">
					<div className="styledForm">
						<div className="formRow">
							<span className="label">Summary</span>
							<input
								type="text"
								value={(rule?.summary as string) ?? ""}
								onChange={(event) => updateRule("summary", event.target.value)}
							/>
						</div>
						<div className="formRow">
							<span className="label">Rule</span>
							<textarea
								value={(rule?.rule as string) ?? ""}
								onChange={(event) => updateRule("rule", event.target.value)}
							></textarea>
						</div>
						<div className="formRow">
							<span className="label">Type</span>
							<div className="radioGroup">
								<div className="radio">
									<label htmlFor="hardRule" className="label">
										Hard Rule
									</label>
									<input
										id="hardRule"
										type="radio"
										value={1}
										checked={((rule?.strict as number) ?? 1) === 1}
										onChange={() => updateRule("strict", 1)}
									/>
								</div>
								<div className="radio">
									<label htmlFor="guideline" className="label">
										Guideline
									</label>
									<input
										id="guideline"
										type="radio"
										value={0}
										checked={((rule?.strict as number) ?? 1) === 0}
										onChange={() => updateRule("strict", 0)}
									/>
								</div>
							</div>
						</div>
						<div className="formRow">
							<span className="label">Deleted</span>
							<div className="radioGroup">
								<div className="radio">
									<label htmlFor="deletedYes" className="label">
										Yes
									</label>
									<input
										id="deletedYes"
										type="radio"
										value={1}
										checked={((rule?.deleted as number) ?? 0) === 1}
										onChange={() => updateRule("deleted", 1)}
									/>
								</div>
								<div className="radio">
									<label htmlFor="deletedNo" className="label">
										No
									</label>
									<input
										id="deletedNo"
										type="radio"
										value={0}
										checked={((rule?.deleted as number) ?? 0) === 0}
										onChange={() => updateRule("deleted", 0)}
									/>
								</div>
							</div>
						</div>

						<div className="formRow">
							<button
								className="button primary"
								onClick={async () => {
									const currentRule = useAppStore.getState().rule;
									if ( currentRule && (currentRule?.global_rule_id as string | null) === null ) {
										await useAppStore.getState().addRule(currentRule as types.KeyValue);
									} else {
										await useAppStore.getState().saveRule(currentRule as types.KeyValue);
									}
								}}
								disabled={!(rule?.summary as string) || !(rule?.rule as string)}
							>
								{rule && (rule?.global_rule_id as string | null) !== null ? "Update" : "Add"} Rule
							</button>
						</div>
					</div>
				</div>
			</div>
		</Dialog>
	);
}
