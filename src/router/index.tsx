import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import pagesJson from "./pages.json";
import { useAppStore } from "@/store/app";

export interface PageRouteDefinition {
	path: string;
	name: string;
	meta: Record<string, unknown>;
	component: string;
	props?: boolean;
}

const viewModules = import.meta.glob("../views/*.tsx");

function loadView(componentPath: string) {
	const viewFile = componentPath.replace(/^\.\.\/views\//, "").replace(/^@\/views\//, "").replace(/\.vue$/, ".tsx");
	const importer = viewModules[`../views/${viewFile}`];
	if ( !importer ) {
		return lazy(() => import("@/views/Error"));
	}
	return lazy(importer as () => Promise<{ default: React.ComponentType<any> }>);
}

const pages = (pagesJson as PageRouteDefinition[]).map((page) => ({
	...page,
	Component: loadView(page.component),
}));

function getBasePath(path: string) {
	const regex =
		/(?<full>(?<path>(?:[/]{1})(?:[A-Za-z0-9]{1,}))(?<param>(?:[/]{1})(?:[/:A-Za-z0-9_]{1,})(?:[?]{1})?)?)/g;
	regex.lastIndex = 0;
	const testPath = regex.exec(path);
	if ( testPath?.groups?.path ) {
		return testPath.groups.path.toString();
	}
	return path;
}

function AuthGuard({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const authenticated = useAppStore((state) => state.authenticated);
	const testLogin = useAppStore((state) => state.testLogin);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			await testLogin();
			if ( !cancelled ) {
				setReady(true);
			}
		};
		run();
		return () => {
			cancelled = true;
		};
	}, [location.pathname, testLogin]);

	if ( !ready ) {
		return null;
	}

	const regex =
		/(?<full>(?<path>(?:[/]{1})(?:[A-Za-z0-9]{1,}))(?<param>(?:[/]{1})(?:[/:A-Za-z0-9_]{1,})(?:[?]{1})?)?)/g;
	const publicPages: string[] = [];
	const protectedPages: string[] = [];
	let toPath = location.pathname.toString();
	const testPath = regex.exec(toPath);
	if ( testPath?.groups?.path ) {
		toPath = testPath.groups.path.toString();
		for ( const page of pages ) {
			if ( page.meta ) {
				if ( page.meta.auth_required !== 1 ) {
					if ( page.path ) {
						publicPages.push(getBasePath(page.path.toString()));
					}
				}
				if ( page.meta.auth_required == 1 || page.meta.auth_required == 3 ) {
					if ( page.path ) {
						protectedPages.push(getBasePath(page.path.toString()));
					}
				}
			}
		}
		if ( authenticated == false && !publicPages.includes(toPath) ) {
			if ( location.pathname !== "/login" ) {
				return <Navigate to="/login" replace />;
			}
		}
		if ( authenticated == true && !protectedPages.includes(toPath) ) {
			if ( location.pathname !== "/" ) {
				return <Navigate to="/" replace />;
			}
		}
	}

	return <>{children}</>;
}

export function AppRoutes() {
	return (
		<AuthGuard>
			<Suspense fallback={null}>
				<Routes>
					{pages.map((page) => (
						<Route key={page.path} path={page.path} element={<page.Component />} />
					))}
				</Routes>
			</Suspense>
		</AuthGuard>
	);
}

export function useCurrentPage() {
	const location = useLocation();
	return pages.find((page) => page.path === location.pathname) || pages.find((page) => page.path === "/") || pages[0];
}

export { pages };
