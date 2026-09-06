import { SkipBack, SkipForward } from "lucide-react";

type PaginationProps = {
	results: any[];
	page: {
		totalPages: number;
		currentPage: number;
	};
	getSpecificPage: (page: number) => Promise<void> | void;
};

export default function Pagination({ results, page, getSpecificPage }: PaginationProps) {
	if ( !Array.isArray(results) || results.length === 0 ) {
		return null;
	}

	const pages = Array.from({ length: page.totalPages }, (_, index) => index + 1);

	return (
		<div className="pagination">
			<ul>
				{page.totalPages > 1 ? (
					<li>
						<button
							className="paginationIcon"
							onClick={async () => await getSpecificPage(1)}
							disabled={page.currentPage == 1}
						>
							<SkipBack />
						</button>
					</li>
				) : null}
				{pages.map((pageNumber) =>
					pageNumber <= page.totalPages &&
					pageNumber > 0 &&
					pageNumber <= page.currentPage + 7 &&
					pageNumber >= page.currentPage - 7 ? (
						<li
							key={pageNumber}
							onClick={async () => await getSpecificPage(pageNumber)}
							className={pageNumber == page.currentPage ? "currentPage" : ""}
						>
							<button className="paginationButton">{pageNumber}</button>
						</li>
					) : null,
				)}
				{page.currentPage < page.totalPages ? (
					<li>
						<button
							className="paginationIcon"
							onClick={async () => await getSpecificPage(page.totalPages)}
							disabled={page.currentPage == page.totalPages}
						>
							<SkipForward />
						</button>
					</li>
				) : null}
			</ul>
		</div>
	);
}
