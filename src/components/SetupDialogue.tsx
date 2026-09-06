import { X } from "lucide-react";
import { useAppStore } from "@/store/app";
import Dialog from "@/components/ui/Dialog";

export default function SetupDialogue() {
	const setupDialogue = useAppStore((state) => state.setupDialogue);
	const avatarSettings = useAppStore((state) => state.avatarSettings);
	const avatarVoices = useAppStore((state) => state.avatarVoices);
	const avatarPersonalities = useAppStore((state) => state.avatarPersonalities);

	const updateSetting = (key: string, value: string | number) => {
		useAppStore.setState({
			avatarSettings: {
				...useAppStore.getState().avatarSettings,
				[key]: value,
			},
		});
	};

	const save = async () => {
		await useAppStore.getState().saveUserAvatar(useAppStore.getState().avatarSettings);
	};

	return (
		<Dialog
			modelValue={setupDialogue}
			onClose={async () => await useAppStore.getState().toggleSetupDialogue()}
			className="setupDialogueWrapper dialogueWrapper"
		>
			<div className="setupDialogue dialogue">
				<div className="dialogueHeader">
					<div className="dialogueTitle">
						<h3>Setup</h3>
					</div>
					<div className="dialogueClose">
						<a href="javascript:void(0)" onClick={async () => await useAppStore.getState().toggleSetupDialogue()}>
							<X />
						</a>
					</div>
				</div>
				<div className="dialogueContent">
					<div className="styledForm">
						<div className="formRow">
							<span className="label">User's Name</span>
							<input
								type="text"
								value={(avatarSettings.user_name as string) || ""}
								onChange={(event) => updateSetting("user_name", event.target.value)}
								onKeyUp={async () => await save()}
							/>
						</div>
						<div className="formRow">
							<span className="label">Avatar Name</span>
							<input
								type="text"
								value={(avatarSettings.avatar_name as string) || ""}
								onChange={(event) => updateSetting("avatar_name", event.target.value)}
								onKeyUp={async () => await save()}
							/>
						</div>
						<div className="formRow">
							<span className="label">Voice</span>
							<select
								value={(avatarSettings.avatar_voice as string) || ""}
								onChange={async (event) => {
									updateSetting("avatar_voice", event.target.value);
									await save();
								}}
							>
								{avatarVoices.map((voice) => (
									<option key={voice.voice_id as string} value={voice.option as string}>
										{voice.label as string}
									</option>
								))}
							</select>
						</div>
						<div className="formRow">
							<span className="label">Personality</span>
							{avatarPersonalities.map((personality) => (
								<div className="sliderRow" key={personality.key as string}>
									<span className="label">{personality.startLabel as string}</span>
									<div className="slider-container">
										<input
											type="range"
											value={Number(avatarSettings[personality.key as string] ?? 10)}
											min={10}
											max={100}
											step={1}
											className="custom-slider"
											onChange={async (event) => {
												updateSetting(personality.key as string, Number(event.target.value));
												await save();
											}}
										/>
									</div>
									<span className="label">{personality.endLabel as string}</span>
								</div>
							))}
						</div>
						<div className="formRow">
							<span className="label">NSFW</span>
							<div className="radioGroup">
								<div className="radio">
									<label htmlFor="nsfwYes" className="label">
										Keep it clean
									</label>
									<input
										id="nsfwYes"
										type="radio"
										value={1}
										checked={avatarSettings.avatar_nsfw === 1}
										onChange={async () => {
											updateSetting("avatar_nsfw", 1);
											await save();
										}}
									/>
								</div>
								<div className="radio">
									<label htmlFor="nsfwNo" className="label">
										No fucking filters
									</label>
									<input
										id="nsfwNo"
										type="radio"
										value={0}
										checked={avatarSettings.avatar_nsfw === 0}
										onChange={async () => {
											updateSetting("avatar_nsfw", 0);
											await save();
										}}
									/>
								</div>
							</div>
						</div>
						<div className="formRow">
							<span className="label">User's Pronouns</span>
							<div className="radioGroup">
								<div className="radio">
									<label htmlFor="heHim" className="label">
										He/Him
									</label>
									<input
										id="heHim"
										type="radio"
										value="He/Him"
										checked={avatarSettings.user_pronouns === "He/Him"}
										onChange={async () => {
											updateSetting("user_pronouns", "He/Him");
											await save();
										}}
									/>
								</div>
								<div className="radio">
									<label htmlFor="sheHer" className="label">
										She/Her
									</label>
									<input
										id="sheHer"
										type="radio"
										value="She/Her"
										checked={avatarSettings.user_pronouns === "She/Her"}
										onChange={async () => {
											updateSetting("user_pronouns", "She/Her");
											await save();
										}}
									/>
								</div>
								<div className="radio">
									<label htmlFor="theyThem" className="label">
										They/Them
									</label>
									<input
										id="theyThem"
										type="radio"
										value="They/Them"
										checked={avatarSettings.user_pronouns === "They/Them"}
										onChange={async () => {
											updateSetting("user_pronouns", "They/Them");
											await save();
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Dialog>
	);
}
