import { useState } from "react";

export default function OSINT() {
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userPhone, setUserPhone] = useState("");

	const osintRequest = async (event: Event) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());
		console.log(data);
	};

	return (
		<>
			<div className="pageTitle">
				<h1>OSINT</h1>
			</div>
			<div className="pageContent">
				<p>Welcome to the OSINT page.</p>
				<div className="styledBlockForm">
					<div className="formRow">
						<span className="label">User's Name</span>
						<input
							type="text"
							value={userName}
							onChange={(event) => setUserName(event.target.value)}
							onKeyUp={async (event) => await osintRequest(event.nativeEvent)}
						/>
					</div>
					<div className="formRow">
						<span className="label">User's Email</span>
						<input
							type="text"
							value={userEmail}
							onChange={(event) => setUserEmail(event.target.value)}
							onKeyUp={async (event) => await osintRequest(event.nativeEvent)}
						/>
					</div>
					<div className="formRow">
						<span className="label">User's Phone</span>
						<input
							type="text"
							value={userPhone}
							onChange={(event) => setUserPhone(event.target.value)}
							onKeyUp={async (event) => await osintRequest(event.nativeEvent)}
						/>
					</div>
				</div>
				<div className="styledTable">
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Phone</th>
							</tr>
						</thead>
					</table>
				</div>
			</div>
		</>
	);
}
