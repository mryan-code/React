import { useEffect, useState } from "react";
import APIClass from "@/classes/API";
import { useAppStore } from "@/store/app";
import * as types from "@/types";

const API = new APIClass();

export default function Portfolio() {
	const authenticated = useAppStore((state) => state.authenticated);
	const globalVars = useAppStore((state) => state.globalVars);
	const [picturePuzzleGridSize, setPicturePuzzleGridSize] = useState(3);
	const picturePuzzleGridSizeOptions = [3, 6, 9];
	const [picturePuzzleGrid] = useState<string[] | null>(null);
	const [picturePuzzleImage, setPicturePuzzleImage] = useState<File | null>(null);

	const displayPicturePuzzle = async () => {
		if ( picturePuzzleImage ) {
		}
	};

	const handleFileSelect = async (event: Event) => {
		setPicturePuzzleImage((event.target as HTMLInputElement)?.files?.[0] || null);
		if ( globalVars.GLOBAL_DEBUG_LEVEL == "debug" || globalVars.DEBUG_USER == "mryan" ) {
			console.log("handleFileSelect: picturePuzzleImage: ", (event.target as HTMLInputElement)?.files?.[0]);
		}
	};

	const uploadPicturePuzzleImage = async (event: Event) => {
		event.preventDefault();
		event.stopPropagation();

		const formData = new FormData();
		if ( picturePuzzleImage ) {
			formData.append("file", picturePuzzleImage);
		}
		const uploadPicturePuzzleImageRes = await API.uploadPicturePuzzleImage(formData);
		if ( globalVars.GLOBAL_DEBUG_LEVEL == "debug" || globalVars.DEBUG_USER == "mryan" ) {
			console.log(
				"uploadPicturePuzzleImage: uploadPicturePuzzleImageRes: ",
				JSON.parse(JSON.stringify(uploadPicturePuzzleImageRes)),
			);
		}
	};

	const getPicturePuzzleImages = async () => {
		const getPicturePuzzleImagesRes = await API.getPicturePuzzleImages();
		if ( globalVars.GLOBAL_DEBUG_LEVEL == "debug" || globalVars.DEBUG_USER == "mryan" ) {
			console.log(
				"getPicturePuzzleImages: getPicturePuzzleImagesRes: ",
				JSON.parse(JSON.stringify(getPicturePuzzleImagesRes)),
			);
		}
	};

	useEffect(() => {
		getPicturePuzzleImages();
	}, []);

	return (
		<>
			<div className="pageTitle">
				<h1>Portfolio</h1>
			</div>
			<div className="pageContent">
				<div className="portfolio">
					<div className="portfolioItem">
						<div className="portfolioItemTitle">
							<h2>Picture Puzzle</h2>
						</div>
						<div className="portfolioItemDescription">
							<p>A picture puzzle game built with React and TypeScript.</p>
						</div>
						<div className="portfolioItemContent">
							<div id="picturePuzzleForm">
								<div className="picturePuzzleFormItem">
									<label htmlFor="picturePuzzleGridSize">Grid Size</label>
									<select
										id="picturePuzzleGridSize"
										value={picturePuzzleGridSize}
										onChange={async (event) => {
											setPicturePuzzleGridSize(Number(event.target.value));
											await displayPicturePuzzle();
										}}
									>
										{picturePuzzleGridSizeOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
								</div>
								{authenticated == true ? (
									<div className="picturePuzzleFormItem">
										<label htmlFor="picturePuzzleImage">Image</label>
										<input
											type="file"
											id="picturePuzzleImage"
											onChange={async (event) => await handleFileSelect(event.nativeEvent)}
											accept="image/*"
										/>
									</div>
								) : null}
								{picturePuzzleImage && authenticated == true ? (
									<div className="picturePuzzleFormItem">
										<button
											className="button primary"
											onClick={async (event) => await uploadPicturePuzzleImage(event.nativeEvent)}
										>
											Upload Image to API
										</button>
									</div>
								) : null}
							</div>
							{picturePuzzleGrid ? <div className="picturePuzzleGrid"></div> : null}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
