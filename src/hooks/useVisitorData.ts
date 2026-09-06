import { useCallback, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export type VisitorData = {
	visitor_id: string | null;
	visitorId?: string;
};

// Replaces @fingerprint/vue. Uses the already-installed open-source FingerprintJS agent.
export function useVisitorData() {
	const [data, setData] = useState<VisitorData | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const getData = useCallback(async (): Promise<VisitorData | null> => {
		setIsLoading(true);
		try {
			const agent = await FingerprintJS.load();
			const result = await agent.get();
			const visitorData: VisitorData = {
				visitor_id: result.visitorId,
				visitorId: result.visitorId,
			};
			setData(visitorData);
			setError(null);
			return visitorData;
		} catch ( err ) {
			const nextError = err instanceof Error ? err : new Error(String(err));
			setError(nextError);
			return null;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { data, error, isLoading, getData };
}
