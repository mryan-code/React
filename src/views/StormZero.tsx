import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { SquarePen, Trash, Copy, Mic, MicOff, Cog, Loader } from "lucide-react";
import APIClass from "@/classes/API";
import { useAppStore } from "@/store/app";
import * as types from "@/types";
import Avatar from "@/components/Avatar";
import SetupDialogue from "@/components/SetupDialogue";
import RuleDialogue from "@/components/RuleDialogue";
import Tooltip from "@/components/ui/Tooltip";
import {
	ExpansionPanel,
	ExpansionPanels,
	Tab,
	Tabs,
	TabsWindow,
	TabsWindowItem,
} from "@/components/ui/ExpansionPanels";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type UserGuideline = types.KeyValue & {
	user_guideline_id?: string | number;
	guideline?: string;
};
type UserConversationContent = types.KeyValue & {
	id?: string | number;
};
type UserConversation = types.KeyValue & {
	user_conversation_subject_id?: string | number;
	subject?: string;
	UserConversationContent?: UserConversationContent[];
};

const API = new APIClass();

export default function StormZero() {
	const settings = useAppStore((state) => state.settings);
	const globalVars = useAppStore((state) => state.globalVars);
	const rules = useAppStore((state) => state.rules);
	const ruleKeyword = useAppStore((state) => state.ruleKeyword);
	const thread = useAppStore((state) => state.thread);
	const showLoadMore = useAppStore((state) => state.showLoadMore);
	const prompt = useAppStore((state) => state.prompt);
	const avatarIsLoading = useAppStore((state) => state.avatarIsLoading);

	const [userConversationKeyword, setUserConversationKeyword] = useState("");
	const [userGuidelineKeyword, setUserGuidelineKeyword] = useState("");
	const [loadMoreAmount] = useState(20);
	const [conversationPanel, setConversationPanel] = useState<string | null>("conversation");
	const [userGuideline, setUserGuideline] = useState<UserGuideline[]>([]);
	const [userConversation, setUserConversation] = useState<UserConversation[]>([]);
	const [userRulesTab, setUserRulesTab] = useState("guidelines");
	const [trainTab, setTrainTab] = useState("system");
	const [activePanel, setActivePanel] = useState<string | null>("training");
	const [promptListen, setPromptListen] = useState(false);
	const [power] = useState(false);
	const [tts, setTts] = useState(true);

	const speech = useSpeechRecognition({
		lang: "en-US",
		continuous: true,
		interimResults: true,
	});

	const getResponseRows = <T extends types.KeyValue>(response: types.KeyValue): T[] => {
		return response.success === true && Array.isArray(response.results) ? (response.results as T[]) : [];
	};
	const getOptionalString = (value: types.KeyValue[keyof types.KeyValue]): string | undefined => {
		return typeof value === "string" ? value : undefined;
	};
	const isTrainer = useMemo(() => {
		const role = settings.role;
		return (
			typeof role === "object" &&
			role !== null &&
			!Array.isArray(role) &&
			"name" in role &&
			((role as types.KeyValue).name === "Administrator" || (role as types.KeyValue).name === "Trainer")
		);
	}, [settings.role]);

	const chatRequest = async () => {
		try {
			const llmResponse = await API.chat(useAppStore.getState().prompt, power, tts);
			if ( globalVars.GLOBAL_DEBUG_LEVEL == "debug" || globalVars.DEBUG_USER == "mryan" ) {
				console.log("chat response", JSON.parse(JSON.stringify(llmResponse)));
			}
			if (
				llmResponse.success == true &&
				llmResponse.results &&
				Array.isArray(llmResponse.results) &&
				llmResponse.results.length > 0
			) {
				if ( llmResponse.results[0].response || llmResponse.results[0].media || llmResponse.results[0].prompt_id ) {
					if ( llmResponse.results[0].tts?.base64 ) {
						useAppStore.setState({ avatarTTS: JSON.parse(JSON.stringify(llmResponse.results[0].tts)) });
					} else {
						useAppStore.setState({ avatarTTS: null });
					}
					useAppStore.setState({
						avatarResponse: llmResponse.results[0].response || "",
						prompt: "",
						avatarIsLoading: false,
					});
					await getUserConversation();
					await getUserGuideline();
					if ( llmResponse.results[0].prompt_id ) {
						await useAppStore
							.getState()
							.getThread(llmResponse.results[0].prompt_id, null, true)
							.then(async (nextThread) => {
								useAppStore.setState({
									thread: [...useAppStore.getState().thread, ...(nextThread || [])],
								});
							})
							.then(async () => {
								await useAppStore.getState().scrollThread();
							});
					}
				} else {
					useAppStore.setState({
						avatarResponse: "",
						avatarTTS: null,
					});
				}
			}
		} catch ( error ) {
			console.error("chatRequest failed:", error);
		}
	};

	const chatKeydown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if ( event.key === "Enter" && !event.shiftKey ) {
			event.preventDefault();
			useAppStore.setState({ avatarIsLoading: true });
			await chatRequest().finally(() => {
				useAppStore.setState({ avatarIsLoading: false });
			});
		}
	};

	const chatSubmit = async () => {
		useAppStore.setState({ avatarIsLoading: true });
		await chatRequest().finally(() => {
			useAppStore.setState({ avatarIsLoading: false });
		});
	};

	const getUserGuideline = async () => {
		setUserGuideline([]);
		const response = await API.getUserGuideline(
			userGuidelineKeyword,
			false,
			getOptionalString(useAppStore.getState().settings.user_id),
		);
		if ( globalVars.GLOBAL_DEBUG_LEVEL == "debug" || globalVars.DEBUG_USER == "foobar" ) {
			console.log("getUserGuideline response", response);
		}
		setUserGuideline(getResponseRows<UserGuideline>(response));
	};

	const getUserConversation = async () => {
		setUserConversation([]);
		const response = await API.getUserConversation(
			userConversationKeyword,
			false,
			getOptionalString(useAppStore.getState().settings.user_id),
		);
		if ( globalVars.GLOBAL_DEBUG_LEVEL == "debug" || globalVars.DEBUG_USER == "foobar" ) {
			console.log("getUserConversation response", response);
		}
		setUserConversation(getResponseRows<UserConversation>(response));
	};

	const deleteUserConversationSubject = async (userConversationSubject: types.KeyValue) => {
		if ( globalVars.GLOBAL_DEBUG_LEVEL == "debug" || globalVars.DEBUG_USER == "foobar" ) {
			console.log("deleteUserConversationSubject userConversationSubject", userConversationSubject);
		}
		const response = await API.deleteUserConversationSubject(userConversationSubject);
		if ( globalVars.GLOBAL_DEBUG_LEVEL == "debug" || globalVars.DEBUG_USER == "foobar" ) {
			console.log("deleteUserConversationSubject response", response);
		}
		if ( response.success === true ) {
			await getUserConversation();
		} else {
			console.error("Failed to delete userConversationSubject:", response);
		}
	};

	const togglePromptListen = async () => {
		const nextPromptListen = !promptListen;
		setPromptListen(nextPromptListen);
		if ( nextPromptListen ) {
			await speech.start();
		} else {
			await speech.stop();
		}
	};

	const loadMoreThread = async () => {
		await useAppStore
			.getState()
			.getThread(null, loadMoreAmount, true)
			.then(async (nextThread) => {
				useAppStore.setState({
					thread: [...(nextThread || []), ...useAppStore.getState().thread],
					showLoadMore: useAppStore.getState().totalAvailableThread > useAppStore.getState().thread.length,
				});
			})
			.then(async () => {
				await useAppStore.getState().scrollThread(true);
			});
	};

	const loadUserRulesTab = async (tab = userRulesTab) => {
		switch ( tab ) {
			case "conversations":
				await getUserConversation();
				break;
			case "guidelines":
				await getUserGuideline();
				break;
		}
	};

	useEffect(() => {
		const lastWord = useAppStore.getState().prompt.split(" ").pop()?.trim();
		if ( speech.result && lastWord !== speech.result.trim() ) {
			useAppStore.setState({ prompt: useAppStore.getState().prompt + speech.result });
		}
	}, [speech.result]);

	useEffect(() => {
		if ( trainTab === "system" ) {
			useAppStore.getState().getRules();
		} else if ( trainTab === "user" ) {
			loadUserRulesTab();
		}
	}, [trainTab]);

	useEffect(() => {
		loadUserRulesTab(userRulesTab);
	}, [userRulesTab]);

	return (
		<>
			<div id="avatarControls">
				{isTrainer ? (
					<ExpansionPanels id="trainingControls" modelValue={activePanel} onUpdate={(value) => setActivePanel(value as string | null)}>
						<ExpansionPanel value="training" title={<span>Training Controls</span>}>
							<Tabs modelValue={trainTab} onUpdate={setTrainTab}>
								<Tab value="system">System</Tab>
								<Tab value="user">User</Tab>
							</Tabs>
							<TabsWindow modelValue={trainTab}>
								<TabsWindowItem value="system">
									<p>
										There are two types of global rules: hard rules, and guidelines. The hard rules are
										strict and must be followed, while guidelines are more flexible and can be overridden by
										user guidelines. Use of the AI will determine which rules are applicable based on the
										context of the conversation and the user's preferences.
									</p>
									<button
										className="button primary compact"
										onClick={async () => await useAppStore.getState().toggleRuleDialog(true)}
									>
										Create System Rule
									</button>
									<div className="styledFilters">
										<div className="styledFilter">
											<span className="label">Search</span>
											<input
												type="text"
												value={ruleKeyword}
												onChange={(event) => useAppStore.setState({ ruleKeyword: event.target.value })}
												onKeyUp={async () => await useAppStore.getState().getRules()}
											/>
										</div>
									</div>
									<div className="styledTable">
										<table>
											<thead>
												<tr>
													<th>Summary</th>
													<th>Type</th>
													<th>Deleted</th>
													<th>Actions</th>
												</tr>
											</thead>
											{rules.length > 0 ? (
												<tbody>
													{rules.map((rule) => (
														<tr key={rule.id as string | number | undefined} className="highlight">
															<td>
																<Tooltip text={<p>{rule.rule as string}</p>}>
																	<span>{rule.summary as string}</span>
																</Tooltip>
															</td>
															<td>{rule.strict == 1 ? "Hard Rule" : "Guideline"}</td>
															<td>{rule.deleted == 1 ? "Yes" : "No"}</td>
															<td className="actions">
																<button
																	className="edit"
																	onClick={async () => await useAppStore.getState().toggleRuleDialog(true, rule)}
																>
																	<SquarePen />
																</button>
																<button
																	className="delete"
																	onClick={async () => await useAppStore.getState().deleteRule(rule)}
																>
																	<Trash />
																</button>
																<button
																	className="copy"
																	onClick={async () => await useAppStore.getState().copyRule(rule)}
																>
																	<Copy />
																</button>
															</td>
														</tr>
													))}
												</tbody>
											) : (
												<tbody>
													<tr>
														<td colSpan={4}>No results found.</td>
													</tr>
												</tbody>
											)}
										</table>
									</div>
								</TabsWindowItem>
								<TabsWindowItem value="user">
									<p>
										User rules are divided into four categories: P2, Conversations, Guidelines, and Avatar.
										P2 are pieces of information about the user, Conversations are interactions, Guidelines
										can override System Guidelines, and the Avatar rules are like P2 for the Avatar. User
										rules will automatically be created based on the user's interactions with the AI.
									</p>
									<Tabs modelValue={userRulesTab} onUpdate={setUserRulesTab}>
										<Tab value="conversations">Conversations</Tab>
										<Tab value="guidelines">Guidelines</Tab>
									</Tabs>
									<TabsWindow modelValue={userRulesTab}>
										<TabsWindowItem value="conversations">
											<p>
												Conversations rules are interactions with the user. EG: messages, responses,
												feedback.
											</p>
											<div className="styledFilters">
												<div className="styledFilter">
													<span className="label">Search</span>
													<input
														type="text"
														value={userConversationKeyword}
														onChange={(event) => setUserConversationKeyword(event.target.value)}
														onKeyUp={async () => await getUserConversation()}
													/>
												</div>
											</div>
											<div className="styledTable">
												<table>
													<thead>
														<tr>
															<th>Subject</th>
															<th>Conversations</th>
															<th>Actions</th>
														</tr>
													</thead>
													{userConversation.length > 0 ? (
														<tbody>
															{userConversation.map((data) => (
																<tr key={data.user_conversation_subject_id} className="highlight">
																	<td>{data.subject as string}</td>
																	<td>
																		<ol>
																			{data.UserConversationContent?.map((conversation) => (
																				<li key={conversation.id}>
																					<pre>{JSON.stringify(conversation, null, 2)}</pre>
																				</li>
																			))}
																		</ol>
																	</td>
																	<td className="actions">
																		<button
																			className="delete"
																			onClick={async () => await deleteUserConversationSubject(data)}
																		>
																			<Trash />
																		</button>
																	</td>
																</tr>
															))}
														</tbody>
													) : (
														<tbody>
															<tr>
																<td colSpan={3}>No results found.</td>
															</tr>
														</tbody>
													)}
												</table>
											</div>
										</TabsWindowItem>
										<TabsWindowItem value="guidelines">
											<p>
												Guidelines are rules that can override system rules. EG: user preferences,
												custom settings.
											</p>
											<div className="styledFilters">
												<div className="styledFilter">
													<span className="label">Search</span>
													<input
														type="text"
														value={userGuidelineKeyword}
														onChange={(event) => setUserGuidelineKeyword(event.target.value)}
														onKeyUp={async () => await getUserGuideline()}
													/>
												</div>
											</div>
											<div className="styledTable">
												<table>
													<thead>
														<tr>
															<th>Guideline</th>
															<th>Actions</th>
														</tr>
													</thead>
													{userGuideline.length > 0 ? (
														<tbody>
															{userGuideline.map((data) => (
																<tr key={data.user_guideline_id} className="highlight">
																	<td>{data.guideline as string}</td>
																	<td className="actions"></td>
																</tr>
															))}
														</tbody>
													) : (
														<tbody>
															<tr>
																<td colSpan={2}>No results found.</td>
															</tr>
														</tbody>
													)}
												</table>
											</div>
										</TabsWindowItem>
									</TabsWindow>
								</TabsWindowItem>
							</TabsWindow>
						</ExpansionPanel>
					</ExpansionPanels>
				) : null}
				{thread.length > 0 ? (
					<ExpansionPanels
						id="conversationPanel"
						modelValue={conversationPanel}
						onUpdate={(value) => setConversationPanel(value as string | null)}
					>
						<ExpansionPanel value="conversation" title={<span>Conversation History</span>}>
							<div className="threadWrapper">
								<div className="thread">
									{showLoadMore ? (
										<button className="button primary loadMoreButton" onClick={async () => await loadMoreThread()}>
											Load More
										</button>
									) : null}
									{thread.map((threadItem) => (
										<div className="threadItem" key={threadItem.prompt_id as string | number | undefined}>
											<div className="threadItemContentWrapper">
												<div className="threadItemPrompt">
													<span className="threadItemText">{threadItem.prompt as string}</span>
												</div>
												<div className="threadItemResponse">
													{threadItem.response ? (
														<span className="threadItemText">{threadItem.response as string}</span>
													) : null}
													{threadItem.file ? (
														<span
															className="threadItemText"
															dangerouslySetInnerHTML={{ __html: threadItem.file as string }}
														></span>
													) : null}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</ExpansionPanel>
					</ExpansionPanels>
				) : null}
			</div>
			<div className="styledInlineForm">
				<div className="formGroup">
					<button
						className="button primary icon"
						onClick={async () => {
							await togglePromptListen();
						}}
					>
						{promptListen ? <Mic /> : <MicOff />}
					</button>
				</div>
				<div className="formGroup">
					<span className="label">Power</span>
					<div className="radioGroup">
						<div className="radio">
							<label htmlFor="powerYes" className="label">
								Yes
							</label>
							<input id="powerYes" type="radio" value={1} checked={power === true} disabled />
						</div>
						<div className="radio">
							<label htmlFor="powerNo" className="label">
								No
							</label>
							<input id="powerNo" type="radio" value={0} checked={power === false} disabled />
						</div>
					</div>
				</div>
				<div className="formGroup">
					<span className="label">TTS</span>
					<div className="radioGroup">
						<div className="radio">
							<label htmlFor="ttsYes" className="label">
								Yes
							</label>
							<input
								id="ttsYes"
								type="radio"
								value={1}
								checked={tts === true}
								onChange={() => setTts(true)}
							/>
						</div>
						<div className="radio">
							<label htmlFor="ttsNo" className="label">
								No
							</label>
							<input
								id="ttsNo"
								type="radio"
								value={0}
								checked={tts === false}
								onChange={() => setTts(false)}
							/>
						</div>
					</div>
				</div>
				<div className="formGroup">
					<button className="button primary icon" onClick={async () => await useAppStore.getState().toggleSetupDialogue(true)}>
						<Cog />
					</button>
				</div>
			</div>
			<textarea
				value={prompt}
				id="promptInput"
				onChange={(event) => useAppStore.setState({ prompt: event.target.value })}
				onKeyDown={async (event) => await chatKeydown(event)}
				placeholder="Prompt..."
			></textarea>
			<div className="submitWrapper">
				<button className="button primary" onClick={async () => chatSubmit()} disabled={!prompt}>
					Query
				</button>
				{avatarIsLoading ? (
					<div className="avatarLoader">
						<Loader className="spin" />
					</div>
				) : null}
			</div>
			<Avatar />
			<RuleDialogue />
			<SetupDialogue />
		</>
	);
}
