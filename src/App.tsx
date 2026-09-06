import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, LogOut, LogIn } from "lucide-react";
import allPages from "@/router/pages.json";
import { AppRoutes, useCurrentPage } from "@/router";
import { useAppStore } from "@/store/app";
import { bindNavigate } from "@/store/navigation";
import Lucide from "@/components/Lucide";
import Dialog from "@/components/ui/Dialog";
import Tooltip from "@/components/ui/Tooltip";
import { ExpansionPanel, ExpansionPanels } from "@/components/ui/ExpansionPanels";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const currentPage = useCurrentPage();
	const loadPageRanForAuth = useRef(false);

	const theme = useAppStore((state) => state.theme);
	const authenticated = useAppStore((state) => state.authenticated);
	const headerMenuOpen = useAppStore((state) => state.headerMenuOpen);
	const headerMenuType = useAppStore((state) => state.headerMenuType);
	const pages = useAppStore((state) => state.pages);
	const collapsed = useAppStore((state) => state.collapsed);
	const settings = useAppStore((state) => state.settings);
	const globalVars = useAppStore((state) => state.globalVars);
	const wssReadyState = useAppStore((state) => state.wssReadyState);

	useEffect(() => {
		bindNavigate((path, options) => {
			navigate(path, { replace: options?.replace });
		});
	}, [navigate]);

	const loadPage = async () => {
		useAppStore.setState({
			logoText: process.env.VUE_APP_NAME?.split(" ") || [],
			pages: JSON.parse(JSON.stringify(allPages)),
		});
		if ( useAppStore.getState().authenticated == true ) {
			await useAppStore.getState().setupAppStore();
		}
	};

	const resetPage = async () => {
		const appStore = useAppStore.getState();
		if ( appStore.authenticated == true ) {
			if ( appStore.wssReadyState ) {
				await appStore.closeWSS();
				useAppStore.setState({ wss: null });
			}
			if ( appStore.watches.length > 0 ) {
				appStore.watches.forEach((watch) => {
					watch.stop();
				});
			}
		}
	};

	useEffect(() => {
		loadPage();
		if ( useAppStore.getState().authenticated === true ) {
			loadPageRanForAuth.current = true;
		}
		return () => {
			resetPage();
		};
	}, []);

	useEffect(() => {
		const appStore = useAppStore.getState();
		if ( appStore.authenticated == true ) {
			if ( wssReadyState !== 2 && wssReadyState !== 1 ) {
				useAppStore.setState({ wssDialogue: true });
				if ( appStore.wssConnectionAttempt <= appStore.wssConnectionAttemptMax ) {
					useAppStore.setState({ wssConnectionAttempt: appStore.wssConnectionAttempt + 1 });
					const run = async () => {
						await appStore.delay(appStore.wssConnectionDelay);
						await useAppStore.getState().openWSS(useAppStore.getState().settings.user_id as number);
					};
					run();
				}
			}
		}
	}, [authenticated, wssReadyState]);

	useEffect(() => {
		if ( authenticated === false ) {
			loadPageRanForAuth.current = false;
			return;
		}
		if ( authenticated === true && loadPageRanForAuth.current === false ) {
			loadPageRanForAuth.current = true;
			loadPage();
		}
	}, [authenticated]);

	useEffect(() => {
		useAppStore.setState({ headerMenuOpen: false });
		const appStore = useAppStore.getState();
		if ( appStore.authenticated == true && appStore.setupComplete == false ) {
			appStore.setupAppStore();
		}
	}, [location.pathname]);

	const canShowPage = (page: any) => {
		return (
			(authenticated == true &&
				(page.meta.auth_required == 1 || page.meta.auth_required == 3) &&
				settings.role &&
				(settings.role as any).auth_level <= page.meta.auth_level) ||
			(authenticated == false &&
				(page.meta.auth_required == 2 || page.meta.auth_required == 3) &&
				page.meta &&
				page.meta.location == 1)
		);
	};

	return (
		<div id={(currentPage?.meta?.slug as string) || ""} className="webApp" data-theme={theme}>
			<div id="header">
				<div className="headerContent">
					<Link to="/" className="logofull noselect">
						<div className="logo">
							<img src="/img/dev.svg" />
						</div>
						<div className="wordmark">
							<h1>WebDev</h1>
							<h1>Matt</h1>
						</div>
					</Link>
					<div id="headerNavRight">
						<div className="headerNavRightItem noselect">
							<div className="headerNavItemHeader">
								<a
									className="headerNavItemHeaderLink"
									href="javascript:void(0)"
									onClick={async (event) => await useAppStore.getState().toggleTheme(event)}
								>
									<div className="headerNavItemHeaderIcon">
										{theme == "light" ? <Moon /> : null}
										{theme == "dark" ? <Sun /> : null}
									</div>
								</a>
							</div>
						</div>
						<div className="headerNavRightItem noselect">
							<div className="headerNavItemHeader">
								{authenticated == true ? (
									<a
										className="headerNavItemHeaderLink"
										href="javascript:void(0)"
										onClick={async (event) => await useAppStore.getState().logout(event)}
									>
										<div className="headerNavItemHeaderIcon">
											<LogOut />
										</div>
									</a>
								) : (
									<a
										className="headerNavItemHeaderLink"
										href="javascript:void(0)"
										onClick={async (event) => await useAppStore.getState().login(event)}
									>
										<div className="headerNavItemHeaderIcon">
											<LogIn />
										</div>
									</a>
								)}
							</div>
						</div>
						<div className="headerNavRightItem noselect">
							<div className="headerNavItemHeader">
								<a
									className="headerNavItemHeaderLink"
									href="javascript:void(0)"
									id="menu"
									onClick={async (event) => await useAppStore.getState().toggleHeaderMenu(event, "menu")}
								>
									<div className="headerNavItemHeaderIcon">
										<Menu />
									</div>
								</a>
							</div>
						</div>
						{headerMenuType == "menu" ? (
							<Dialog
								modelValue={headerMenuOpen}
								onClose={() => {
									useAppStore.getState().closeHeaderMenu();
								}}
								className="menuDialogueWrapper dialogueWrapper headerDialogueWrapper noselect"
							>
								<div className="dialogue">
									<div className="headerNavItemArrow"></div>
									<div className="headerNavItemContentWrapper">
										<div className="headerNavItemContent" id="menu">
											<ul>
												{pages.map((page: any, index: number) =>
													canShowPage(page) ? (
														<li key={index}>
															<Link to={page.path} replace={true}>
																<div className="menuItem">
																	<div className="menuItemIcon">
																		{page.meta.icon ? <Lucide name={page.meta.icon} /> : null}
																		{page.name && collapsed ? (
																			<Tooltip text={page.name}>
																				<span></span>
																			</Tooltip>
																		) : null}
																	</div>
																	{page.name && !collapsed ? (
																		<span className="menuItemText">{page.name}</span>
																	) : null}
																</div>
															</Link>
														</li>
													) : null,
												)}
											</ul>
										</div>
									</div>
								</div>
							</Dialog>
						) : null}
					</div>
				</div>
			</div>

			<div id="main">
				<div id="mainContent">
					<div id="viewContent">
						{globalVars.GLOBAL_DEBUG_LEVEL == "debug" || globalVars.DEBUG_USER == "mryan" ? (
							<ExpansionPanels>
								<ExpansionPanel value="global" title="Global Variables">
									<pre>{JSON.stringify(globalVars, null, 2)}</pre>
								</ExpansionPanel>
								<ExpansionPanel value="settings" title="Settings">
									<pre>{JSON.stringify(settings, null, 2)}</pre>
								</ExpansionPanel>
							</ExpansionPanels>
						) : null}
						<ErrorBoundary>
							<AppRoutes />
						</ErrorBoundary>
					</div>
				</div>
			</div>
		</div>
	);
}
