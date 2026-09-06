import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import allPages from "@/router/pages.json";
import { useAppStore } from "@/store/app";
import Lucide from "@/components/Lucide";
import Tooltip from "@/components/ui/Tooltip";

export default function MainMenu() {
	const authenticated = useAppStore((state) => state.authenticated);
	const pages = useAppStore((state) => state.pages);
	const settings = useAppStore((state) => state.settings);
	const collapsed = useAppStore((state) => state.collapsed);

	useEffect(() => {
		if ( authenticated == true ) {
			useAppStore.setState({ pages: JSON.parse(JSON.stringify(allPages)) });
		}
	}, [authenticated]);

	const canShowPage = (page: any) => {
		return (
			((authenticated == true && page.meta.auth_required == 1) ||
				(authenticated == false && page.meta.auth_required == 2) ||
				page.meta.auth_required == 3) &&
			page.meta.location == 1 &&
			settings.role &&
			(settings.role as any).auth_level <= page.meta.auth_level
		);
	};

	if ( Object.entries(settings).length === 0 ) {
		return null;
	}

	return (
		<div id="menu" className="noselect">
			<ul>
				{pages.map((page: any, index: number) => (
					<li key={index}>
						{page.meta.section_id != null ? (
							<div className="subMenu">
								{canShowPage(page) ? (
									<Link to={page.path} replace={true}>
										<div
											className="menuItem subMenuParent parentMenuItem"
											onClick={async (event) => await useAppStore.getState().parentToggleSubMenu(page, event)}
										>
											<div className="menuItemIcon">
												{page.meta.icon ? <Lucide name={page.meta.icon} /> : null}
												{page.name && collapsed ? <Tooltip text={page.name}><span></span></Tooltip> : null}
											</div>
											{page.name && !collapsed ? <span className="menuItemText">{page.name}</span> : null}
											{!collapsed ? (
												<a
													className="subMenuToggle"
													onClick={async (event) => await useAppStore.getState().toggleSubMenu(page, event)}
												>
													{page.meta.subMenuOpen == 1 ? <ChevronDown /> : null}
													{page.meta.subMenuOpen == 0 ? <ChevronUp /> : null}
												</a>
											) : null}
										</div>
									</Link>
								) : null}
								{page.meta.pages?.length > 0 ? (
									<div
										className="subMenuChildren"
										data-sub-menu-open={page.meta.subMenuOpen}
										data-section_id={page.meta.section_id}
									>
										<ul>
											{page.meta.pages.map((nestedPage: any, nestedIndex: number) => (
												<li key={nestedIndex}>
													<Link to={nestedPage.path} replace={true}>
														<div className="menuItem subMenuItem">
															<div className="menuItemIcon">
																{nestedPage.meta.icon ? <Lucide name={nestedPage.meta.icon} /> : null}
																{nestedPage.name && collapsed ? (
																	<Tooltip text={nestedPage.name}><span></span></Tooltip>
																) : null}
															</div>
															{nestedPage.name && !collapsed ? (
																<span className="menuItemText">{nestedPage.name}</span>
															) : null}
														</div>
													</Link>
												</li>
											))}
										</ul>
									</div>
								) : null}
							</div>
						) : (
							<div>
								<pre>{JSON.stringify(settings, null, 2)}</pre>
								{canShowPage(page) ? (
									<Link to={page.path} replace={true}>
										<div className="menuItem parentMenuItem">
											<div className="menuItemIcon">
												{page.meta.icon ? <Lucide name={page.meta.icon} /> : null}
												{page.name && collapsed ? <Tooltip text={page.name}><span></span></Tooltip> : null}
											</div>
											{page.name && !collapsed ? <span className="menuItemText">{page.name}</span> : null}
										</div>
									</Link>
								) : null}
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
