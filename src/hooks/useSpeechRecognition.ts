import { useCallback, useRef, useState } from "react";

type SpeechRecognitionOptions = {
	lang?: string;
	continuous?: boolean;
	interimResults?: boolean;
};

// Browser SpeechRecognition stand-in for VueUse's useSpeechRecognition.
export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
	const [result, setResult] = useState("");
	const [isListening, setIsListening] = useState(false);
	const recognitionRef = useRef<any>(null);

	const start = useCallback(async () => {
		const SpeechRecognitionImpl =
			(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
		if ( !SpeechRecognitionImpl ) {
			return;
		}
		const recognition = new SpeechRecognitionImpl();
		recognition.lang = options.lang || "en-US";
		recognition.continuous = options.continuous ?? true;
		recognition.interimResults = options.interimResults ?? true;
		recognition.onresult = (event: any) => {
			const last = event.results[event.results.length - 1];
			setResult(last[0].transcript);
		};
		recognition.onend = () => {
			setIsListening(false);
		};
		recognition.start();
		recognitionRef.current = recognition;
		setIsListening(true);
	}, [options.continuous, options.interimResults, options.lang]);

	const stop = useCallback(async () => {
		recognitionRef.current?.stop();
		setIsListening(false);
	}, []);

	return { result, isListening, start, stop };
}
