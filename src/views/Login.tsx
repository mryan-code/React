import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeySquare } from "lucide-react";
import APIClass from "@/classes/API";
import { useAppStore } from "@/store/app";
import * as types from "@/types";
import { useVisitorData } from "@/hooks/useVisitorData";

const API = new APIClass();

export default function Login() {
	const navigate = useNavigate();
	const { getData } = useVisitorData();
	const [email, setEmail] = useState("");
	const [auth_code, setAuthCode] = useState("");
	const [loginMessages, setLoginMessages] = useState<string[]>([]);
	const [verify, setVerify] = useState(false);
	const [verifyMessages, setVerifyMessages] = useState<string[]>([]);

	const loginRequest = async (event: Event | FormEvent) => {
		event.preventDefault();
		const visitorData = await getData();
		console.log("visitorData", visitorData);

		const loginRequestRes = await API.login(email);
		if ( loginRequestRes.success === true ) {
			setLoginMessages([]);
			setVerify(true);
			setAuthCode("");
			if ( loginRequestRes.auth_code ) {
				setAuthCode(loginRequestRes.auth_code as string);
			}
			await useAppStore.getState().delay(0);
			useAppStore.getState().focusField("#verifyInput");
			await useAppStore.getState().delay(3000);
		} else {
			if ( loginRequestRes.message && Array.isArray(loginRequestRes.message) ) {
				setLoginMessages(loginRequestRes.message as string[]);
			}
			await useAppStore.getState().delay(0);
			useAppStore.getState().focusField("#emailInput");
		}
	};

	const verifyRequest = async (event: Event | FormEvent) => {
		event.preventDefault();
		let visitorData = null;
		try {
			visitorData = await getData();
			console.log("visitorData", JSON.parse(JSON.stringify(visitorData)));
		} catch ( error: any ) {
			console.log("error", error.message);
		}
		const userAgent: string | string[] = navigator.userAgent;
		const IP: string | null = await API.getIP();
		const geoLocation: types.KeyValue | null = await API.getGeoLocation(IP as string);
		const verifyRequestRes = (await API.verify(
			email,
			auth_code,
			userAgent as string | null,
			IP as string | null,
			geoLocation?.latitude as number | null,
			geoLocation?.longitude as number | null,
			visitorData?.visitor_id as string | null,
		)) as types.KeyValue;
		if ( verifyRequestRes.authenticated === true ) {
			setAuthCode("");
			setEmail("");
			navigate("/", { replace: true });
		} else {
			if ( verifyRequestRes.message && Array.isArray(verifyRequestRes.message) ) {
				setVerifyMessages(verifyRequestRes.message as string[]);
			}
			await useAppStore.getState().delay(0);
			useAppStore.getState().focusField("#verifyInput");
		}
	};

	const loginSubmit = async (event: Event | FormEvent | KeyboardEvent) => {
		event.preventDefault();
		let type = "login";
		if ( auth_code.length > 0 ) {
			type = "verify";
		}
		if ( type === "login" ) {
			await loginRequest(event as Event);
		} else if ( type === "verify" ) {
			await verifyRequest(event as Event);
		}
	};

	useEffect(() => {
		useAppStore.setState({ authenticated: false });
		const loginTokenKey = useAppStore.getState().loginTokenKey;
		if ( localStorage.getItem(loginTokenKey) ) {
			localStorage.removeItem(loginTokenKey);
		}

		setVerify(false);
		setLoginMessages([]);
		setVerifyMessages([]);
		useAppStore.getState().focusField("#emailInput");
	}, []);

	return (
		<div className="v-card login-card">
			<div className="v-card-item">
				<div className="v-card-title">
					<h2>Login</h2>
				</div>

				<div className="v-card-text">
					<p>Please enter your email and login code to continue.</p>
				</div>

				{loginMessages.length > 0 || verifyMessages.length > 0 ? (
					<div className="v-card-text">
						{loginMessages.length > 0 ? (
							<div>
								<p>Login Messages:</p>
								<ul>
									{loginMessages.map((message) => (
										<li key={message}>{message}</li>
									))}
								</ul>
							</div>
						) : null}
						{verifyMessages.length > 0 ? (
							<div>
								<p>Verify Messages:</p>
								<ul>
									{verifyMessages.map((message) => (
										<li key={message}>{message}</li>
									))}
								</ul>
							</div>
						) : null}
					</div>
				) : null}

				<form id="loginForm" onSubmit={async (event) => await loginSubmit(event)}>
					<div className="inputWrapper">
						<input
							className="input"
							id="emailInput"
							data-field="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							type="email"
							required
							onKeyUp={async (event: KeyboardEvent<HTMLInputElement>) => {
								if ( event.key === "Enter" ) {
									await loginSubmit(event);
								}
							}}
							readOnly={verify}
						/>
						<button
							className="button primary"
							id="loginButton"
							type="button"
							onClick={async (event) => await loginRequest(event)}
							disabled={email.length === 0 || verify}
						>
							<span className="buttonInitial">
								<span className="buttonIcon">
									<Mail />
								</span>
							</span>
						</button>
					</div>
					<div className="inputWrapper">
						<input
							className="input"
							id="verifyInput"
							data-field="verify"
							value={auth_code}
							onChange={(event) => setAuthCode(event.target.value)}
							type="text"
							required
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="off"
							spellCheck={false}
							onKeyUp={async (event: KeyboardEvent<HTMLInputElement>) => {
								if ( event.key === "Enter" ) {
									await loginSubmit(event);
								}
							}}
							readOnly={!verify}
							disabled={!verify}
						/>
						<button
							className="button primary"
							id="verifyButton"
							type="button"
							onClick={async (event) => await verifyRequest(event)}
							disabled={auth_code.length === 0 || !verify}
						>
							<span className="buttonInitial">
								<span className="buttonIcon">
									<KeySquare />
								</span>
							</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
