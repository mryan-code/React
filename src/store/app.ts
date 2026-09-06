import { create } from "zustand";
import APIClass from "@/classes/API";
import * as types from "@/types";
import * as validation from "@/validation";
import moment, { Moment } from "moment-timezone";
import { appNavigate } from "@/store/navigation";

const controller = new AbortController();

export interface AppWatch {
	stop: () => void;
}

export interface AppState {
	settings: types.KeyValue;
	globalVars: any;
	authenticated: boolean;
	wss: WebSocket | null;
	wssReadyState: number;
	wssDialogue: boolean;
	wssDialogueMessage: string;
	wssError: string;
	wssMessage: any;
	wssConnectionAttempt: number;
	wssConnectionAttemptMax: number;
	wssConnectionDelay: number;
	timezone: string;

	perPageDefault: number;
	perPageOptions: number[];

	controller: AbortController;
	signal: AbortSignal;
	collapsed: boolean;
	notificationCount: number;
	notifications: types.KeyValue[];
	notificationsSearch: string;
	panelClickEventListeners: any[];
	userRole: string;
	userAuth: number | null;
	userName: string;
	userInitials: string;
	headerMenuOpen: boolean;
	headerMenuType: string;
	theme: string;
	loginTokenKey: string;
	versionKey: string;
	API: APIClass;

	timezoneOptions: string[];
	setupComplete: boolean;

	selectedGuideRuleOptions: types.KeyValue[] | null;
	selectedHardRuleOptions: types.KeyValue[] | null;
	guideRuleOptions: types.KeyValue[];
	hardRuleOptions: types.KeyValue[];

	selectedCustomModelOption: types.KeyValue | null;
	customModelOptions: types.KeyValue[];
	avatarAudioLevel: number;
	avatarResponse: string;
	avatarIsLoading: boolean;
	prompt: string;
	avatarTTS: types.KeyValue | null;
	setupDialogue: boolean;
	avatarSettings: types.KeyValue;
	avatarVoices: types.KeyValue[];
	avatarPersonalities: types.KeyValue[];
	rules: types.KeyValue[];
	ruleKeyword: string;
	ruleDialogue: boolean;
	rule: types.KeyValue | null;
	threadKeyword: string;
	thread: types.KeyValue[];
	showLoadMore: boolean;
	totalAvailableThread: number;
	watches: AppWatch[];
	intervals: any[];
	events: any[];
	debugTimer: moment.Moment;
	dateFormat: string;
	devDateFormat: string;
	longDateFormat: string;
	timeFormat: string;
	militaryTimeFormat: string;
	backendURL: string;
	startVars: types.KeyValue | null;
	pages: types.KeyValue[];
	logoText: string[];
}

export interface AppActions {
	getAuthenticated: () => boolean;
	checkVersion: () => Promise<void>;
	parseAIResponse: () => Promise<void>;
	getUsers: (
		company_id?: string | null,
		department_id?: string | null,
		user_id?: string | null,
		search?: string | null,
	) => Promise<types.KeyValue[]>;
	sort: (array: types.KeyValue[], key?: string, type?: string) => Promise<types.KeyValue[]>;
	setupAppStore: () => Promise<boolean>;
	login: (event: Event) => Promise<void>;
	testLogin: () => Promise<void>;
	toggleTheme: (event?: Event) => Promise<void>;
	focusField: (selector: string) => Promise<boolean>;
	toggleWidth: (page?: any) => Promise<void>;
	parentToggleSubMenu: (page: any, event: Event) => Promise<void>;
	toggleSubMenu: (page: any, event: Event) => Promise<void>;
	logout: (event?: Event) => Promise<void>;
	parseSettings: (settingsTemp: types.KeyValue) => Promise<types.KeyValue>;
	toggleSetupDialogue: (open?: boolean) => Promise<void>;
	completeSetup: () => Promise<void>;
	getThread: (promptID?: number | null, limit?: number | null, more?: boolean) => Promise<types.KeyValue[] | undefined>;
	scrollThread: (upwards?: boolean) => Promise<void>;
	getAvatarVoices: () => Promise<void>;
	getUserAvatar: () => Promise<void>;
	updateUserAvatarPersona: (tempAvatarSettings: types.KeyValue) => Promise<void>;
	saveUserAvatar: (tempAvatarSettings: types.KeyValue) => Promise<void>;
	getRules: () => Promise<void>;
	toggleRuleDialog: (toggle: boolean, tempRule?: types.KeyValue | null) => Promise<void>;
	addRule: (tempRule: types.KeyValue) => Promise<void>;
	saveRule: (tempRule: types.KeyValue) => Promise<void>;
	deleteRule: (tempRule: types.KeyValue) => Promise<void>;
	copyRule: (tempRule: types.KeyValue) => Promise<void>;
	buttonFeedback: (element: HTMLElement, pending?: boolean, success?: boolean, error?: boolean) => Promise<void>;
	toggleHeaderMenu: (event: any, target: string) => Promise<void>;
	closeHeaderMenu: () => Promise<void>;
	openWSS: (user_id: number) => Promise<void>;
	closeWSSDialogue: () => Promise<void>;
	closeWSS: () => Promise<void>;
	delay: (ms?: number) => Promise<unknown>;
	parseError: (error: any) => Promise<types.KeyValue>;
	logError: (error: any) => Promise<void>;
	timer: (startTimer: moment.Moment) => number;
}

export type AppStore = AppState & AppActions;

const initialState: AppState = {
	settings: {},
	globalVars: {},
	startVars: null,
	authenticated: false,
	wss: null,
	wssReadyState: 0,
	wssDialogue: true,
	wssDialogueMessage: "Connecting to WSS...",
	wssError: "",
	wssMessage: null,
	wssConnectionAttempt: 0,
	wssConnectionAttemptMax: parseInt(process.env.ENV_WSS_CONNECTION_ATTEMPT_MAX || "100"),
	wssConnectionDelay: parseInt(process.env.ENV_WSS_CONNECTION_DELAY || "5000"),

	timezone: "",

	perPageOptions: [10, 25, 100, 500, 1000],
	perPageDefault: 100,

	controller: controller,
	signal: controller.signal,

	collapsed: false,
	notificationCount: 0,
	notifications: [],
	notificationsSearch: "",
	panelClickEventListeners: [],
	userRole: "",
	userAuth: null,
	userName: "",
	userInitials: "",
	headerMenuOpen: false,
	headerMenuType: "",
	theme: "dark",
	loginTokenKey: process.env.VUE_APP_ENV + "_sz_login_token",
	versionKey: process.env.VUE_APP_ENV + "_sz_version",
	API: null as unknown as APIClass,

	timezoneOptions: [],
	setupComplete: false,
	selectedGuideRuleOptions: null,
	guideRuleOptions: [],
	selectedHardRuleOptions: null,
	hardRuleOptions: [],

	selectedCustomModelOption: null,
	customModelOptions: [],
	avatarTTS: null,
	setupDialogue: false,
	avatarSettings: {},
	avatarVoices: [],
	avatarPersonalities: [],
	rules: [],
	ruleKeyword: "",
	ruleDialogue: false,
	rule: null,
	watches: [],
	intervals: [],
	events: [],
	avatarAudioLevel: 0,
	avatarResponse: "",
	avatarIsLoading: false,
	prompt: "",
	debugTimer: moment(),
	threadKeyword: "",
	thread: [],
	showLoadMore: true,
	totalAvailableThread: 0,
	dateFormat: "MM/DD/YYYY",
	devDateFormat: "YYYY-MM-DD",
	longDateFormat: "MMMM Do, YYYY",
	timeFormat: "h:mm A",
	militaryTimeFormat: "HH:mm",
	backendURL:
		process.env.VUE_APP_BACKEND_PROTOCOL +
		"://" +
		process.env.VUE_APP_BACKEND_HOST +
		":" +
		process.env.VUE_APP_BACKEND_PORT,
	pages: [],
	logoText: [],
};

// Zustand replacement for the previous Pinia store. Actions use get/set instead of `this`.
export const useAppStore = create<AppStore>()((set, get) => ({
	...initialState,

	getAuthenticated: () => get().authenticated,

	async checkVersion() {
		const version = process.env.VUE_APP_VERSION ?? "1.0.1";
		const localStorageVersion = localStorage.getItem(get().versionKey);
		if ( !localStorageVersion ) {
			localStorage.setItem(get().versionKey, version.toString());
		}
		if ( localStorageVersion != version.toString() ) {
			localStorage.setItem(get().versionKey, version.toString());
			window.location.reload();
		}
	},
	async parseAIResponse() {},
	async getUsers(
		company_id: string | null = null,
		department_id: string | null = null,
		user_id: string | null = null,
		search: string | null = null,
	) {
		const usersRes = (await get().API.getUsers(
			company_id,
			department_id,
			user_id,
			search,
		)) as unknown as types.KeyValue;
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "info" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("getUsers - usersRes: ", JSON.parse(JSON.stringify(usersRes)));
		}
		if ( usersRes.success == true ) {
			return usersRes.results as types.KeyValue[];
		}
		return [] as types.KeyValue[];
	},
	async sort(array: types.KeyValue[], key = "name", type = "string") {
		return array.sort((a: types.KeyValue, b: types.KeyValue): number => {
			if ( type == "string" ) {
				if ( a[key] && b[key] && a[key] > b[key] ) {
					return 1;
				} else if ( a[key] && b[key] && a[key] < b[key] ) {
					return -1;
				}
				return 0;
			} else {
				if ( a[key] && b[key] ) {
					return Number(b[key]) - Number(a[key]);
				}
				return 0;
			}
		});
	},
	async setupAppStore() {
		if ( !get().setupComplete ) {
			if ( localStorage.getItem(get().loginTokenKey) ) {
				let user_id = null;
				let localStorageToken: any = localStorage.getItem(get().loginTokenKey);
				if ( validation.isJSON(localStorageToken) ) {
					localStorageToken = JSON.parse(localStorageToken);
					if ( localStorageToken.user_id ) {
						user_id = localStorageToken.user_id;
					}
				}
				if ( user_id ) {
					const startAppRes = await get().API.startApp(user_id as string);
					if ( startAppRes.success == true ) {
						const startVars = (startAppRes.results as types.KeyValue[])[0] as types.KeyValue | null;
						set({ startVars });
						if ( startVars ) {
							if ( startVars.env ) {
								const globalVars = { ...get().globalVars };
								for await ( const [key, value] of Object.entries(startVars.env) ) {
									globalVars[key] = value;
								}
								set({ globalVars });
							}
							if (
								get().globalVars.GLOBAL_DEBUG_LEVEL == "info" ||
								get().globalVars.DEBUG_USER == "foobar"
							) {
								console.log("globalVars: ", JSON.parse(JSON.stringify(get().globalVars)));
							}
							if ( startVars.settings ) {
								const settings = await get().parseSettings(startVars.settings as types.KeyValue);
								set({ settings });
							}
							if (
								get().globalVars.GLOBAL_DEBUG_LEVEL == "info" ||
								get().globalVars.DEBUG_USER == "foobar"
							) {
								console.log("settings: ", JSON.parse(JSON.stringify(get().settings)));
							}
							await get().getRules();
							await get().getAvatarVoices();
							await get().getUserAvatar();
							await get().getThread(null, 20, false);
							await get().scrollThread();
							if ( get().settings && get().settings.setup_complete == 0 ) {
								set({ setupDialogue: true });
							}
						}
					}
				}
			}

			set({ setupComplete: true });

			const wssMessageUnsub = useAppStore.subscribe((state, prev) => {
				if ( state.wssMessage === prev.wssMessage ) {
					return;
				}
				if ( state.authenticated == true ) {
					if ( state.wssMessage ) {
						switch ( state.wssMessage.type ) {
							case "department":
								break;
							default:
								break;
						}
					}
				}
			});
			const authenticatedUnsub = useAppStore.subscribe((state, prev) => {
				if ( state.authenticated === prev.authenticated ) {
					return;
				}
			});
			set({
				watches: [
					...get().watches,
					{ stop: wssMessageUnsub },
					{ stop: authenticatedUnsub },
				],
			});
		}
		return get().setupComplete;
	},
	async login(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		appNavigate("/login");
	},
	async testLogin() {
		await get().API.testAuth().then(async (testAuthRes: any) => {
			if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "mryan" ) {
				console.log("testLogin - testAuthRes: ", JSON.parse(JSON.stringify(testAuthRes)));
			}
			if ( testAuthRes.success ) {
				if ( Object.hasOwn(testAuthRes, "authenticated") && testAuthRes.authenticated == true ) {
					set({ authenticated: testAuthRes.authenticated });
				}
			}
		});
	},
	async toggleTheme() {
		if ( get().theme == "light" ) {
			set({ theme: "dark" });
		} else {
			set({ theme: "light" });
		}
	},
	async focusField(selector: string) {
		const element: HTMLElement | null = document.querySelector(selector) as HTMLElement | null;
		if ( !element ) {
			return false;
		}
		if ( element ) {
			await get().delay(0);
			let focusTarget: HTMLElement | null = null;
			if ( typeof (element as HTMLElement).focus === "function" ) {
				focusTarget = element;
			} else {
				focusTarget = element.querySelector(
					"input,textarea,[contenteditable='true'],[tabindex]",
				) as HTMLElement;
			}
			if ( !focusTarget || typeof (focusTarget as HTMLElement).focus !== "function" ) {
				return false;
			}
			(focusTarget as HTMLElement).focus();
			return true;
		}
		return false;
	},
	async toggleWidth(page: any) {
		const collapsedWidth = "var(--collapsed-menu-width)";
		const expandedWidth = "var(--menu-width)";
		const sideBar: HTMLElement = document.querySelector("#sideBar") as HTMLElement;
		const menuMeta: HTMLElement = document.querySelector("#menuMeta") as HTMLElement;
		const menuMetaItems: NodeListOf<HTMLElement> = menuMeta.querySelectorAll(
			".metaMenuItem",
		) as NodeListOf<HTMLElement>;
		const headerNavLeft: HTMLElement = document.querySelector("#header #headerNavLeft") as HTMLElement;
		const main: HTMLElement = document.querySelector("#main") as HTMLElement;
		const tabWrapper: HTMLElement = document.querySelector("#tabWrapper") as HTMLElement;
		const tabContentWrapper: HTMLElement = tabWrapper.querySelector(".tabContentWrapper") as HTMLElement;
		const twilioCall: HTMLElement = tabContentWrapper.querySelector(".twilioCall") as HTMLElement;
		const menuItems: NodeListOf<HTMLElement> = document.querySelectorAll(
			".menuItem:not(.subMenuItem)",
		) as NodeListOf<HTMLElement>;
		const subMenus: NodeListOf<HTMLElement> = document.querySelectorAll(".subMenu") as NodeListOf<HTMLElement>;

		if ( sideBar.style.width == collapsedWidth ) {
			if ( menuItems.length > 0 ) {
				for await ( const item of menuItems ) {
					if ( item as HTMLElement ) {
						(item as HTMLElement).style.width = "calc(" + expandedWidth + " - (var(--padding) * 2))";
					}
					const menuItemText: HTMLElement = item.querySelector(".menuItemText") as HTMLElement;
					if ( menuItemText as HTMLElement ) {
						(menuItemText as HTMLElement).style.opacity = "1";
						(menuItemText as HTMLElement).style.width = "100%";
						(menuItemText as HTMLElement).style.fontSize = "0.9em";
					}
				}
			}
			if ( subMenus.length > 0 ) {
				for await ( const subMenu of subMenus ) {
					if ( subMenu as HTMLElement ) {
						(subMenu as HTMLElement).style.width = "calc(" + expandedWidth + " - (var(--padding) * 2))";
						const subMenuChildren: NodeListOf<HTMLElement> = subMenu.querySelectorAll(
							".subMenuChildren .menuItem",
						) as NodeListOf<HTMLElement>;
						if ( subMenuChildren.length > 0 ) {
							for await ( const child of subMenuChildren ) {
								if ( child as HTMLElement ) {
									(child as HTMLElement).style.width = "100%";
									const menuItemText: HTMLElement = child.querySelector(
										".menuItemText",
									) as HTMLElement;
									if ( menuItemText as HTMLElement ) {
										(menuItemText as HTMLElement).style.opacity = "1";
										(menuItemText as HTMLElement).style.width = "100%";
										(menuItemText as HTMLElement).style.fontSize = "0.9em";
									}
								}
							}
						}
					}
				}
			}
			if ( sideBar as HTMLElement ) {
				(sideBar as HTMLElement).style.width = expandedWidth;
			}
			if ( main as HTMLElement ) {
				(main as HTMLElement).style.left = "calc(" + expandedWidth + " )";
				(main as HTMLElement).style.width = "calc(100vw - " + expandedWidth + " )";
			}
			if ( menuMeta as HTMLElement ) {
				(menuMeta as HTMLElement).style.width = "calc(" + expandedWidth + " - var(--padding) * 2)";
				if ( menuMetaItems.length > 0 ) {
					for await ( const item of menuMetaItems ) {
						if ( item as HTMLElement ) {
							const metaMenuItemText: HTMLElement = item.querySelector(
								".metaMenuItemText",
							) as HTMLElement;
							if ( metaMenuItemText as HTMLElement ) {
								(metaMenuItemText as HTMLElement).style.opacity = "1";
								(metaMenuItemText as HTMLElement).style.fontSize = "0.8em";
							}
						}
					}
				}
			}
			if ( tabWrapper as HTMLElement ) {
				(tabWrapper as HTMLElement).style.left = expandedWidth;
				if ( tabContentWrapper as HTMLElement ) {
					const tabWrapperWidth = tabWrapper.clientWidth;
					const sideBarWidth = sideBar.clientWidth;
					(tabContentWrapper as HTMLElement).style.left =
						"calc(1px + " + tabWrapperWidth + "px + var(--menu-width))";
					if ( tabContentWrapper.clientWidth > 0 ) {
						(tabContentWrapper as HTMLElement).style.width = "100%";
						(tabContentWrapper as HTMLElement).style.overflow = "auto";
						(twilioCall as HTMLElement).style.maxWidth = "calc(100vw - (var(--menu-width) ))";
						(main as HTMLElement).style.overflow = "hidden";
					}
				}
			}
			set({ collapsed: false });
		} else {
			if ( menuItems.length > 0 ) {
				for await ( const item of menuItems ) {
					if ( item as HTMLElement ) {
						(item as HTMLElement).style.width = "calc(" + collapsedWidth + " - (var(--padding) * 2))";
					}
					const menuItemText: HTMLElement = item.querySelector(".menuItemText") as HTMLElement;
					if ( menuItemText as HTMLElement ) {
						(menuItemText as HTMLElement).style.opacity = "0";
						(menuItemText as HTMLElement).style.width = "0px";
						(menuItemText as HTMLElement).style.fontSize = "0em";
					}
				}
			}
			if ( subMenus.length > 0 ) {
				for await ( const subMenu of subMenus ) {
					if ( subMenu as HTMLElement ) {
						(subMenu as HTMLElement).style.width =
							"calc(" + collapsedWidth + " - (var(--padding) * 2))";
						const subMenuChildren: NodeListOf<HTMLElement> = subMenu.querySelectorAll(
							".subMenuChildren .menuItem",
						) as NodeListOf<HTMLElement>;
						if ( subMenuChildren.length > 0 ) {
							for await ( const child of subMenuChildren ) {
								if ( child as HTMLElement ) {
									(child as HTMLElement).style.width = "100%";
									const menuItemText: HTMLElement = child.querySelector(
										".menuItemText",
									) as HTMLElement;
									if ( menuItemText as HTMLElement ) {
										(menuItemText as HTMLElement).style.opacity = "0";
										(menuItemText as HTMLElement).style.width = "0px";
										(menuItemText as HTMLElement).style.fontSize = "0em";
									}
								}
							}
						}
					}
				}
			}
			if ( sideBar as HTMLElement ) {
				(sideBar as HTMLElement).style.width = collapsedWidth;
			}
			if ( main as HTMLElement ) {
				(main as HTMLElement).style.left = "calc(" + collapsedWidth + " )";
				(main as HTMLElement).style.width = "calc(100vw - " + collapsedWidth + " )";
			}
			if ( menuMeta as HTMLElement ) {
				(menuMeta as HTMLElement).style.width = "calc(" + collapsedWidth + " - var(--padding) * 2)";
				if ( menuMetaItems.length > 0 ) {
					for await ( const item of menuMetaItems ) {
						if ( item as HTMLElement ) {
							const metaMenuItemText: HTMLElement = item.querySelector(
								".metaMenuItemText",
							) as HTMLElement;
							if ( metaMenuItemText as HTMLElement ) {
								(metaMenuItemText as HTMLElement).style.opacity = "0";
								(metaMenuItemText as HTMLElement).style.fontSize = "0em";
							}
						}
					}
				}
			}

			if ( tabWrapper as HTMLElement ) {
				(tabWrapper as HTMLElement).style.left = collapsedWidth;
				if ( tabContentWrapper as HTMLElement ) {
					const tabWrapperWidth = tabWrapper.clientWidth;
					const sideBarWidth = sideBar.clientWidth;
					(tabContentWrapper as HTMLElement).style.left =
						"calc(1px + " + tabWrapperWidth + "px + var(--collapsed-menu-width))";
					if ( tabContentWrapper.clientWidth > 0 ) {
						(tabContentWrapper as HTMLElement).style.width = "100%";
						(tabContentWrapper as HTMLElement).style.overflow = "auto";
						(twilioCall as HTMLElement).style.maxWidth = "calc(100vw - (var(--collapsed-menu-width) ))";
						(tabContentWrapper as HTMLElement).style.overflow = "auto";
						(main as HTMLElement).style.overflow = "hidden";
					}
				}
			}
			set({ collapsed: true });
		}
	},
	async parentToggleSubMenu(page: any, event: Event) {
		if ( get().collapsed == true && page.meta.subMenuOpen == 0 ) {
			await get().toggleSubMenu(page, event);
		}
	},
	async toggleSubMenu(page: any, event: Event) {
		if ( get().collapsed == false ) {
			event.preventDefault();
			event.stopPropagation();
		}
		const subMenu: HTMLElement = document.querySelector(
			`.subMenuChildren[data-section_id="${page.meta.section_id}"]`,
		) as HTMLElement;
		if ( subMenu ) {
			let newHeight = "0px";
			switch ( page.meta.subMenuOpen ) {
				case 1:
					page.meta.subMenuOpen = 0;
					newHeight = "0px";
					break;
				case 0:
					page.meta.subMenuOpen = 1;
					newHeight = subMenu.scrollHeight + "px";
					break;
			}

			const pages = get().pages.map((pageTemp) => {
				if (
					(pageTemp.meta as types.KeyValue).page_id?.toString() ==
					(page.meta?.page_id?.toString() as string)
				) {
					return {
						...pageTemp,
						meta: {
							...(pageTemp.meta as types.KeyValue),
							subMenuOpen: page.meta.subMenuOpen,
						},
					};
				}
				return pageTemp;
			});
			set({ pages });
			(subMenu as HTMLElement).setAttribute("style", `max-height: ${newHeight} !important`);
		}
	},
	async logout() {
		if ( get().authenticated ) {
			const logoutRes: types.KeyValue = await get().API.logout();
			if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
				console.log("logout - logoutRes: ", JSON.parse(JSON.stringify(logoutRes)));
			}
			if ( logoutRes.success ) {
				set({
					authenticated: false,
					headerMenuOpen: false,
					headerMenuType: "",
				});
				appNavigate("/login");
			}
		}
	},
	async parseSettings(settingsTemp: types.KeyValue) {
		const settings = settingsTemp;
		const firstName = settings.first_name ? (settings.first_name as string) : "";
		let userName = "";
		let userInitials = "";
		if ( firstName ) {
			userName += firstName;
			userInitials += firstName[0];
		}
		const lastName = settings.last_name ? (settings.last_name as string) : "";
		if ( firstName && lastName ) {
			userName += " ";
			userInitials += " ";
		}
		if ( lastName ) {
			userName += lastName;
			userInitials += lastName[0];
		}

		const momentTimeZone = moment.tz.guess(true);
		let timezone = momentTimeZone;
		const timezoneOptions = [...get().timezoneOptions];
		if ( !timezoneOptions.includes(momentTimeZone) ) {
			timezoneOptions.push(momentTimeZone);
		}
		if ( settings.timezone && settings.timezone !== momentTimeZone ) {
			settings.timezone = momentTimeZone;
		}

		let userRole = get().userRole;
		let userAuth = get().userAuth;
		if ( settings.Role ) {
			if ( Array.isArray(settings.Role) && settings.Role.length > 0 ) {
				settings.role = JSON.parse(JSON.stringify((settings.Role as types.KeyValue[])[0]));
				userRole = (settings.Role as types.KeyValue[])[0].name as string;
				userAuth = (settings.Role as types.KeyValue[])[0].auth_level as number;
				delete settings.Role;
			}
		}

		set({ userName, userInitials, timezone, timezoneOptions, userRole, userAuth });
		return settings;
	},

	async toggleSetupDialogue(open: boolean = false) {
		if ( open == true ) {
			set({ setupDialogue: true });
		} else {
			await get().completeSetup();
			set({ setupDialogue: false });
		}
	},
	async completeSetup() {
		const response = await get().API.updateUser({ user_id: get().settings.user_id as number, setup_complete: 1 });
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("completeSetup response", response);
		}
		if ( response.success === false ) {
			console.error("Failed to complete setup:", response);
		}
	},
	async getThread(promptID: number | null = null, limit: number | null = null, more: boolean = false) {
		if ( more == false ) {
			set({ thread: [] });
		}
		const response = await get().API.getThread(
			get().threadKeyword,
			promptID,
			false,
			get().settings.user_id?.toString() ?? "",
			limit,
		);
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("getThread response", JSON.parse(JSON.stringify(response)));
		}
		if ( response.success === true && Array.isArray(response.results) ) {
			const newThread: types.KeyValue[] = [];
			for ( const result of response.results ) {
				const item = JSON.parse(JSON.stringify(result));
				item.time = moment(item.created).format(get().timeFormat);
				item.date = moment(item.created).format(get().longDateFormat);
				if ( item.mime_type ) {
					switch ( item.mime_type ) {
						case "image/png":
						case "image/jpeg":
							item.file = '<img src="data:' + item.mime_type + ";base64," + item.base64 + '">';
							break;
					}
				}
				newThread.push(item);
			}
			set({ totalAvailableThread: response.total_rows as number });
			if ( more == false ) {
				set({ thread: newThread as types.KeyValue[] });
			}
			return newThread as types.KeyValue[];
		}
	},
	async scrollThread(upwards: boolean = false) {
		const communicationThreadWrapper: any = document.querySelector(".threadWrapper");
		if ( communicationThreadWrapper ) {
			const communicationThread: any = communicationThreadWrapper.querySelector(".thread");
			if ( communicationThread ) {
				let scrollTop = 0;
				if ( communicationThread.clientHeight > communicationThreadWrapper.clientHeight ) {
					if ( upwards ) {
						scrollTop = 0;
					} else {
						scrollTop = communicationThread.clientHeight;
					}
				}
				communicationThreadWrapper.scrollTo({
					top: scrollTop,
					behavior: "smooth",
				});
			}
		}
	},
	async getAvatarVoices() {
		set({ avatarVoices: [] });
		const response = await get().API.getAvatarVoices();
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("getAvatarVoices response", JSON.parse(JSON.stringify(response)));
		}
		if ( response.success === true && Array.isArray(response.results) ) {
			set({ avatarVoices: response.results as types.KeyValue[] });
		}
	},
	async getUserAvatar() {
		set({ avatarSettings: {}, avatarPersonalities: [] });
		const response = await get().API.getUserAvatar(get().settings.user_id?.toString() ?? "");
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("getUserAvatar response", JSON.parse(JSON.stringify(response)));
		}
		if ( response.success == true && Array.isArray(response.results) ) {
			const avatarRows = response.results as types.KeyValue[];
			if ( avatarRows.length > 0 ) {
				await get().updateUserAvatarPersona(avatarRows[0] as types.KeyValue);
			}
		}
	},
	async updateUserAvatarPersona(tempAvatarSettings: types.KeyValue) {
		const avatarPersonalities: types.KeyValue[] = [];
		const avatarSettings: types.KeyValue = {};
		for ( const [key, value] of Object.entries(tempAvatarSettings) ) {
			if ( key.startsWith("persona_") ) {
				const personalityOption = key.replace("persona_", "").toLowerCase().split("_");
				avatarPersonalities.push({
					key: key,
					startLabel: personalityOption[0] ?? "",
					endLabel: personalityOption[1] ?? "",
					value: value as types.KeyValue[string],
				});
			}
			avatarSettings[key] = value as types.KeyValue[string];
		}
		set({ avatarPersonalities, avatarSettings });
	},
	async saveUserAvatar(tempAvatarSettings: types.KeyValue) {
		await get().updateUserAvatarPersona(tempAvatarSettings);
		const response = await get().API.saveUserAvatar(tempAvatarSettings);
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("saveUserAvatar response", JSON.parse(JSON.stringify(response)));
		}
		if ( response.success === true ) {
			await get().completeSetup();
		}
	},
	async getRules() {
		set({ rules: [] });
		const response = await get().API.getRules(get().ruleKeyword);
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("getRules response", response);
		}
		set({ rules: response.results as types.KeyValue[] });
	},
	async toggleRuleDialog(toggle: boolean, tempRule: types.KeyValue | null = null) {
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("toggleRuleDialog toggle", toggle);
			console.log("toggleRuleDialog tempRule", tempRule);
		}
		if ( toggle ) {
			if ( tempRule !== null ) {
				set({ rule: { ...tempRule } });
			} else {
				set({
					rule: {
						global_rule_id: null,
						summary: "",
						rule: "",
						strict: 1,
						deleted: 0,
					},
				});
			}
		} else {
			set({ rule: null });
		}
		set({ ruleDialogue: toggle });
	},
	async addRule(tempRule: types.KeyValue) {
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("editRule tempRule", tempRule);
		}
		const response = await get().API.addRule(tempRule);
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("addRule response", response);
		}
		if ( response.success === true ) {
			if ( get().ruleDialogue === true ) {
				await get().toggleRuleDialog(false);
			}
			await get().getRules();
		} else {
			console.error("Failed to add rule:", response);
		}
	},
	async saveRule(tempRule: types.KeyValue) {
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("saveRule tempRule", tempRule);
		}
		const response = await get().API.saveRule(tempRule);
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("saveRule response", response);
		}
		if ( response.success === true ) {
			await get().getRules();
			if ( get().ruleDialogue === true ) {
				await get().toggleRuleDialog(false);
			}
		} else {
			console.error("Failed to save rule:", response);
		}
	},
	async deleteRule(tempRule: types.KeyValue) {
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("deleteRule tempRule", tempRule);
		}
		const response = await get().API.deleteRule(tempRule);
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("deleteRule response", response);
		}
		if ( response.success === true ) {
			await get().getRules();
			if ( get().ruleDialogue === true ) {
				await get().toggleRuleDialog(false);
			}
		} else {
			console.error("Failed to delete rule:", response);
		}
	},
	async copyRule(tempRule: types.KeyValue) {
		await get().addRule(tempRule);
	},
	async buttonFeedback(element: HTMLElement, pending = false, success = false, error = false) {
		if ( element ) {
			const buttonFeedback: HTMLElement | null = element.querySelector(
				"span.buttonFeedback",
			) as HTMLElement | null;

			if ( buttonFeedback ) {
				const buttonFeedbackDisplay = async () => {
					const buttonInitial: HTMLElement | null = element.querySelector(
						".buttonInitial",
					) as HTMLElement | null;
					if ( buttonInitial !== null ) {
						if ( pending == true || success == true || error == true ) {
							if ( (getComputedStyle(buttonInitial as HTMLElement).opacity as string) != "0" ) {
								(buttonInitial as HTMLElement).style.opacity = "0";
							}
						} else {
							if ( (getComputedStyle(buttonInitial as HTMLElement).opacity as string) != "1" ) {
								(buttonInitial as HTMLElement).style.opacity = "1";
							}
						}
					}
				};

				if ( success || error || pending ) {
					(buttonFeedback as HTMLElement).style.display = "inline-block";
					await buttonFeedbackDisplay().then(async () => {
						const buttonFeedbackSuccess: HTMLElement | null = buttonFeedback.querySelector(
							".buttonFeedbackSuccess",
						) as HTMLElement | null;
						if ( buttonFeedbackSuccess !== null ) {
							if ( success === true ) {
								(buttonFeedbackSuccess as HTMLElement).style.display = "inline-block";
							} else {
								(buttonFeedbackSuccess as HTMLElement).style.display = "none";
							}
						}

						const buttonFeedbackError: HTMLElement | null = buttonFeedback.querySelector(
							".buttonFeedbackError",
						) as HTMLElement | null;
						if ( buttonFeedbackError !== null ) {
							if ( error === true ) {
								(buttonFeedbackError as HTMLElement).style.display = "inline-block";
							} else {
								(buttonFeedbackError as HTMLElement).style.display = "none";
							}
						}

						const buttonFeedbackPending: HTMLElement | null = buttonFeedback.querySelector(
							".buttonFeedbackPending",
						) as HTMLElement | null;
						if ( buttonFeedbackPending !== null ) {
							if ( pending === true ) {
								(buttonFeedbackPending as HTMLElement).style.display = "inline-block";
							} else {
								(buttonFeedbackPending as HTMLElement).style.display = "none";
							}
						}
					});
				} else {
					(buttonFeedback as HTMLElement).style.display = "none";
				}
			}
		}
	},

	async toggleHeaderMenu(event: any, target: string) {
		if ( target ) {
			set({ headerMenuType: target });
		}
		if ( get().headerMenuOpen == false ) {
			set({ headerMenuOpen: true });
		} else {
			set({ headerMenuOpen: false });
		}
		const headerNavItemHeaderLink = event.target.closest(".headerNavItemHeaderLink") as HTMLElement;
		await get().delay(100).then(async () => {
			if ( headerNavItemHeaderLink ) {
				const dialogueTarget = "." + get().headerMenuType + "DialogueWrapper";
				const dialogueWrapper = document.querySelector(dialogueTarget) as HTMLElement | null;
				if ( dialogueWrapper ) {
					const dialogue = dialogueWrapper.querySelector(".dialogue") as HTMLElement;
					if ( dialogue ) {
						const headerNavWidth = headerNavItemHeaderLink.clientWidth;
						const windowWidth = window.innerWidth;
						const dialogueRight =
							windowWidth - headerNavItemHeaderLink.offsetLeft - headerNavWidth - 10;
						let arrowRight = headerNavWidth / 2;
						const arowRightMin = 15;
						if ( arrowRight < arowRightMin ) {
							arrowRight = arowRightMin;
						}

						const headerNavItemArrow = dialogue.querySelector(".headerNavItemArrow") as HTMLElement;
						if ( headerNavItemArrow ) {
							dialogue.style.right = dialogueRight + "px";
							headerNavItemArrow.style.right = arrowRight + "px";
							dialogue.style.opacity = "1";
						}
						switch ( get().headerMenuType ) {
							case "notifications":
								break;
						}
					}
				}
			}
		});
	},
	async closeHeaderMenu() {
		set({ headerMenuOpen: false, headerMenuType: "" });
	},

	async openWSS(user_id: number) {
		try {
			if ( get().authenticated ) {
				if ( get().wssReadyState === 1 && get().wss ) {
					await get().closeWSS();
				}

				let wssURL = "";
				wssURL += get().globalVars.WSS_PROTOCOL;
				wssURL += "://" + get().globalVars.WSS_HOST;
				wssURL += ":" + get().globalVars.WSS_PORT;
				wssURL += "?userID=" + user_id.toString();
				wssURL += "&userTimezone=" + get().timezone;
				if ( localStorage.getItem(get().loginTokenKey) ) {
					let localStorageToken: any = localStorage.getItem(get().loginTokenKey);
					if ( validation.isJSON(localStorageToken) ) {
						localStorageToken = JSON.parse(localStorageToken);
						if ( localStorageToken.login_token ) {
							wssURL += "&loginToken=" + localStorageToken.login_token;
						}
					}
				}
				if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" || get().globalVars.DEBUG_USER == "foobar" ) {
					console.error("openWSS wssURL: ", wssURL);
				}

				const wss = new WebSocket(wssURL);
				set({ wss });
				wss.onopen = async (event: Event) => {
					if ( get().wss !== wss ) {
						return;
					}
					if ( event.type == "open" && wss.readyState === WebSocket.OPEN ) {
						wss.send(
							JSON.stringify({
								type: "init",
								user_id: get().settings.user_id,
								user_timezone: get().timezone,
							}),
						);
						set({
							wssReadyState: 1,
							wssDialogue: false,
							wssConnectionAttempt: 0,
						});
					}
				};
				wss.onmessage = async (event) => {
					if ( get().wss !== wss ) {
						return;
					}
					let wssMessage: any = false;
					if ( validation.isJSON(event.data) ) {
						wssMessage = JSON.parse(event.data);
						if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "info" ) {
							console.log("wssMessage: ", JSON.parse(JSON.stringify(wssMessage)));
						}

						switch ( wssMessage.type ) {
							case "ping":
								if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "info" ) {
									console.log("wssMessage ping: ", JSON.parse(JSON.stringify(wssMessage)));
								}
								if ( wss.readyState === WebSocket.OPEN ) {
									// High-risk operation: sends data over websocket; requires human review.
									wss.send(
										JSON.stringify({
											type: "pong",
											user_id: get().settings.user_id,
											user_timezone: get().timezone,
										}),
									);
								}
								break;
							case "offline":
								if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "info" ) {
									console.log("wssMessage status: ", JSON.parse(JSON.stringify(wssMessage)));
								}
								await get().closeWSS();
								break;
							default:
								set({ wssMessage });
								break;
						}
					}
				};
				wss.onerror = async (event: Event) => {
					if (
						get().globalVars.GLOBAL_DEBUG_LEVEL == "errors" ||
						get().globalVars.GLOBAL_DEBUG_LEVEL == "warnings" ||
						get().globalVars.GLOBAL_DEBUG_LEVEL == "info"
					) {
						console.error("wss.onerror error: ", event);
					}
					if ( get().wss !== wss ) {
						return;
					}
					set({
						wssError: (event as ErrorEvent).message as string,
						wssReadyState: 2,
						wssDialogue: true,
					});
				};
				wss.onclose = async (event: CloseEvent) => {
					if ( get().wss !== wss ) {
						return;
					}
					set({
						wssReadyState: 0,
						wssDialogue: true,
					});
				};
			}
		} catch ( error: any ) {
			if (
				get().globalVars.GLOBAL_DEBUG_LEVEL == "errors" ||
				get().globalVars.GLOBAL_DEBUG_LEVEL == "warnings" ||
				get().globalVars.GLOBAL_DEBUG_LEVEL == "debug" ||
				get().globalVars.GLOBAL_DEBUG_LEVEL == "info"
			) {
				console.error("openWSS error: ", error);
			}
			await get().logError(error);
		}
	},
	async closeWSSDialogue() {
		set({ wssDialogue: false });
	},
	async closeWSS() {
		if ( get().authenticated && get().wss ) {
			get().wss?.close();
		}
	},
	async delay(ms = 3000) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	},

	async parseError(error: any) {
		const IP: string | null = await get().API.getIP();
		const currentUrl: string | null = window.location.href;
		const message: string | null = error.message;
		let userAgent: string | null = null;
		if ( navigator.userAgent ) {
			userAgent = navigator.userAgent;
			userAgent = userAgent.split(") ").join("</li><li>");
			userAgent = "<ul><li>" + userAgent + "</li></ul>";
		}
		let stack: string | null = null;
		let lineNumber: number | null = null;
		let fileName: string | null = null;
		if ( error.lineNumber ) {
			lineNumber = error.lineNumber;
			fileName = error.fileName;
		} else {
			const stackLines = error.stack.split("\n");
			if ( stackLines.length > 1 ) {
				const firstStackLine = stackLines[1];
				const match = firstStackLine.match(/([a-zA-Z0-9._]+):(\d+):(\d+)/);
				if ( match ) {
					lineNumber = match[2];
					fileName = match[1];
				}
			}
		}
		if ( error.stack && stack !== null ) {
			stack = error.stack;
			if ( stack !== null ) {
				stack = stack.replace(/\n/g, "</li><li>");
				stack = "<ul><li>" + stack + "</li></ul>";
			}
		}
		const errorTemp: types.KeyValue = {};
		if ( message ) {
			errorTemp.message = message.toString();
		}
		if ( lineNumber ) {
			errorTemp.line = lineNumber;
		}
		if ( fileName ) {
			errorTemp.file = fileName;
		}
		if ( userAgent ) {
			errorTemp.user_agent = userAgent;
		}
		if ( IP ) {
			errorTemp.user_ip = IP;
		}
		if ( currentUrl ) {
			errorTemp.url = currentUrl;
		}
		if ( stack && stack !== null ) {
			errorTemp.stack = stack;
		}
		return errorTemp;
	},
	async logError(error: any) {
		const errorTemp: types.KeyValue = await get().parseError(error);
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "info" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("logError: errorTemp: ", JSON.parse(JSON.stringify(errorTemp)));
		}
		const addErrorRequest: types.KeyValue = await get().API.addError(errorTemp);
		if ( get().globalVars.GLOBAL_DEBUG_LEVEL == "info" || get().globalVars.DEBUG_USER == "foobar" ) {
			console.log("logError: addErrorRequest: ", JSON.parse(JSON.stringify(addErrorRequest)));
		}
	},

	timer: (startTimer: moment.Moment) => {
		const endTimer = moment();
		const duration = endTimer.diff(startTimer, "milliseconds");
		return duration;
	},
}));

// Create the API after the store exists so the circular store/API import does not run during create().
useAppStore.setState({ API: new APIClass() });
