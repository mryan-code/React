import type { KeyValue } from "./KeyValue";

/**
 * Company row from tblcompany (API responses use snake_case column names).
 * Backend: tblcompany.autodial TINYINT(1) NOT NULL DEFAULT 0.
 */
export interface Company extends KeyValue {
	company_id?: string | null;
	name?: string;
	/** 0 = company autodial features off, 1 = on */
	autodial?: number;
	timezone?: string;
}
