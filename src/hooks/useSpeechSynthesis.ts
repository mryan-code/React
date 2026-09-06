import { useCallback, useState } from "react";

type SpeechSynthesisOptions = {
	lang?: string;
	pitch?: number;
	rate?: number;
};

// Browser speechSynthesis stand-in for VueUse's useSpeechSynthesis.
export function useSpeechSynthesis(text: string, options: SpeechSynthesisOptions = {}) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [status, setStatus] = useState("stop");

	const speak = useCallback(() => {
		if ( !window.speechSynthesis ) {
			return;
		}
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = options.lang || "en-US";
		utterance.pitch = options.pitch ?? 1;
		utterance.rate = options.rate ?? 1;
		utterance.onstart = () => {
			setIsPlaying(true);
			setStatus("speaking");
		};
		utterance.onend = () => {
			setIsPlaying(false);
			setStatus("stop");
		};
		window.speechSynthesis.speak(utterance);
	}, [options.lang, options.pitch, options.rate, text]);

	const stop = useCallback(() => {
		if ( window.speechSynthesis ) {
			window.speechSynthesis.cancel();
		}
		setIsPlaying(false);
		setStatus("stop");
	}, []);

	return { speak, stop, isPlaying, status };
}
