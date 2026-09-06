import { Loader } from "lucide-react";
import { useAppStore } from "@/store/app";
import Dialog from "@/components/ui/Dialog";

export default function WSSDialogue() {
	const wssDialogue = useAppStore((state) => state.wssDialogue);
	const wssConnectionAttempt = useAppStore((state) => state.wssConnectionAttempt);
	const wssConnectionAttemptMax = useAppStore((state) => state.wssConnectionAttemptMax);
	const wssDialogueMessage = useAppStore((state) => state.wssDialogueMessage);
	const wssError = useAppStore((state) => state.wssError);
	const globalVars = useAppStore((state) => state.globalVars);

	return (
		<Dialog
			modelValue={wssDialogue}
			onClose={() => {
				useAppStore.getState().closeWSSDialogue();
			}}
			className="wssDialogueWrapper dialogueWrapper"
		>
			<div className="wssDialogue dialogue">
				<div className="dialogueHeader">
					<div className="dialogueTitle">
						<h3>Setup</h3>
					</div>
				</div>
				{wssConnectionAttempt > wssConnectionAttemptMax ? (
					<div>
						<h3 className="dialogueTitle">Connection failed</h3>
						{globalVars.NODE_ENV !== "production" &&
						globalVars.NODE_ENV !== "prod" &&
						wssConnectionAttempt > 0 ? (
							<p>Connection failed after {wssConnectionAttempt} attempts</p>
						) : null}
					</div>
				) : (
					<div>
						<h3 className="dialogueTitle">{wssDialogueMessage}</h3>
						{wssError != "" ? <p>{wssError}</p> : null}
						{globalVars.NODE_ENV !== "production" &&
						globalVars.NODE_ENV !== "prod" &&
						wssConnectionAttempt > 0 ? (
							<p>
								Attempt {wssConnectionAttempt} out of {wssConnectionAttemptMax}
							</p>
						) : null}
						<p className="dialogueProgress">
							<Loader className="spin" />
						</p>
					</div>
				)}
			</div>
		</Dialog>
	);
}
