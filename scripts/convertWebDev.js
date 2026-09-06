/* eslint-env node */
const fs = require("fs");
const path = require("path");

const vuePath = path.resolve(__dirname, "../src/views/WebDev.vue");
const source = fs.readFileSync(vuePath, "utf8");

const templateMatch = source.match(/<template>([\s\S]*?)<\/template>/);
const styleMatch = source.match(/<style lang="scss" scoped>([\s\S]*?)<\/style>/);

if ( !templateMatch || !styleMatch ) {
	throw new Error("Unable to extract WebDev.vue template or style.");
}

function cssToJsxStyle(styleValue) {
	const declarations = styleValue
		.split(";")
		.map((item) => item.trim())
		.filter(Boolean);
	const pairs = declarations.map((declaration) => {
		const colon = declaration.indexOf(":");
		if ( colon === -1 ) {
			return null;
		}
		const property = declaration.slice(0, colon).trim();
		const value = declaration.slice(colon + 1).trim();
		const camel = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
		const jsValue = /^-?\d+(\.\d+)?$/.test(value) ? value : JSON.stringify(value);
		return `${camel}: ${jsValue}`;
	}).filter(Boolean);
	return `{{ ${pairs.join(", ")} }}`;
}

const attrMap = {
	class: "className",
	for: "htmlFor",
	tabindex: "tabIndex",
	colspan: "colSpan",
	rowspan: "rowSpan",
	maxlength: "maxLength",
	readonly: "readOnly",
	autofocus: "autoFocus",
	autocomplete: "autoComplete",
	autocorrect: "autoCorrect",
	autocapitalize: "autoCapitalize",
	spellcheck: "spellCheck",
	crossorigin: "crossOrigin",
	"stroke-width": "strokeWidth",
	"stroke-linecap": "strokeLinecap",
	"stroke-linejoin": "strokeLinejoin",
	"stroke-dasharray": "strokeDasharray",
	"stroke-dashoffset": "strokeDashoffset",
	"stroke-miterlimit": "strokeMiterlimit",
	"stroke-opacity": "strokeOpacity",
	"fill-rule": "fillRule",
	"fill-opacity": "fillOpacity",
	"clip-path": "clipPath",
	"clip-rule": "clipRule",
	"font-size": "fontSize",
	"font-family": "fontFamily",
	"font-weight": "fontWeight",
	"font-style": "fontStyle",
	"letter-spacing": "letterSpacing",
	"text-anchor": "textAnchor",
	"text-decoration": "textDecoration",
	"stop-color": "stopColor",
	"stop-opacity": "stopOpacity",
	"color-interpolation-filters": "colorInterpolationFilters",
	"enable-background": "enableBackground",
	"xmlns:xlink": "xmlnsXlink",
	"xlink:href": "xlinkHref",
	"xml:space": "xmlSpace",
	"xml:lang": "xmlLang",
	"dominant-baseline": "dominantBaseline",
	"alignment-baseline": "alignmentBaseline",
};

let jsx = templateMatch[1];
jsx = jsx.replace(/<!--([\s\S]*?)-->/g, (_match, comment) => `{/*${comment}*/}`);
jsx = jsx.replace(/<RouterLink\s+:to="'\/'">([\s\S]*?)<\/RouterLink>/g, "<Link to=\"/\">$1</Link>");
jsx = jsx.replace(/\sstyle=(["'])([\s\S]*?)\1/g, (_match, _quote, value) => {
	return ` style=${cssToJsxStyle(value.replace(/\s+/g, " ").trim())}`;
});

for ( const [from, to] of Object.entries(attrMap) ) {
	const pattern = new RegExp(`\\s${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=`, "g");
	jsx = jsx.replace(pattern, ` ${to}=`);
}

const voidTags = [
	"img",
	"input",
	"br",
	"hr",
	"meta",
	"link",
	"source",
	"area",
	"col",
	"embed",
	"wbr",
	"path",
	"circle",
	"rect",
	"line",
	"polyline",
	"polygon",
	"ellipse",
	"stop",
	"use",
	"image",
];
for ( const tag of voidTags ) {
	// Require a word boundary so `line` does not match `linearGradient`.
	const pattern = new RegExp(`<${tag}(?=[\\s/>])([^>]*?)(?<!/)>`, "g");
	jsx = jsx.replace(pattern, `<${tag}$1 />`);
	jsx = jsx.replace(new RegExp(`</${tag}>`, "g"), "");
}

const scssPath = path.resolve(__dirname, "../src/views/WebDev.scss");
fs.writeFileSync(scssPath, styleMatch[1].trim() + "\n");

const component = `import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./WebDev.scss";

// Converted from WebDev.vue. Scroll/SVG animation logic stays DOM-based in useEffect.
export default function WebDev() {
	useEffect(() => {
		const meta = document.createElement("meta");
		meta.name = "theme-color";
		meta.content = "#000000";
		document.head.appendChild(meta);

		const rotationREGEX = /(?:[rotate\\(]{7})(?<rotation>[\\\\-\\\\d]{1,4})/gm;
		let giraffeAnimating = false;
		let giraffeangle = 0;

		const skillRank: any = document.querySelectorAll(".rankValue");
		if ( skillRank ) {
			skillRank.forEach((skill: any) => {
				const width = parseInt(skill.getAttribute("data-value")) * 20;
				skill.style.width = "calc(" + width + "% - 4px)";
			});
		}

		const skillSlide: any = document.querySelector("#skillSlide");
		const skillBody: any = skillSlide.querySelector(".slideBody");
		const skillHero: any = skillSlide.querySelector(".slideHeroWrapper");
		const resetSkill: any = async () => {
			const skillLogo = skillHero.querySelector("#skillLogo");
			if ( skillLogo ) {
				skillLogo.setAttribute("transform", "translate(0, 0) scale(1, 1)");
			}
			const stars1 = skillHero.querySelector("#stars1");
			if ( stars1 ) {
				stars1.setAttribute("transform", "translate(0, 0)");
			}
			const stars2 = skillHero.querySelector("#stars2");
			if ( stars2 ) {
				stars2.setAttribute("transform", "translate(0, 0)");
			}
			const stars3 = skillHero.querySelector("#stars3");
			if ( stars3 ) {
				stars3.setAttribute("transform", "translate(0, 0)");
			}
			const planet1 = skillHero.querySelector("#planet1");
			if ( planet1 ) {
				planet1.setAttribute("transform", "translate(0, 0) scale(1)");
			}
			const planet2 = skillHero.querySelector("#planet2");
			if ( planet2 ) {
				planet2.setAttribute("transform", "translate(0, 0) scale(1)");
			}
			const rocket = skillHero.querySelector("#rocket");
			if ( rocket ) {
				rocket.setAttribute("transform", "translate(0, 0) scale(1)");
				const rocketEventListener = rocket.addEventListener("transitionend", () => {
					skillHero.querySelector("#rocket g").setAttribute("opacity", "1");
				});
				rocket.removeEventListener("transitionend", rocketEventListener);
			}
		};
		const skillScroll: any = async (skillPercentage: number) => {
			if ( skillPercentage > 20 ) {
				const skillLogo = skillHero.querySelector("#skillLogo");
				if ( skillLogo ) {
					skillLogo.setAttribute("transform", "translate(0, 20) scale(0.2, 0.2)");
				}
			}
			if ( skillPercentage > 30 ) {
				const stars1 = skillHero.querySelector("#stars1");
				if ( stars1 ) {
					stars1.setAttribute("transform", "translate(0, 50)");
				}
			}
			if ( skillPercentage > 40 ) {
				const stars2 = skillHero.querySelector("#stars2");
				if ( stars2 ) {
					stars2.setAttribute("transform", "translate(0, 75)");
				}
			}
			if ( skillPercentage > 45 ) {
				const stars3 = skillHero.querySelector("#stars3");
				if ( stars3 ) {
					stars3.setAttribute("transform", "translate(0, 120)");
				}

				const planet1 = skillHero.querySelector("#planet1");
				if ( planet1 ) {
					planet1.setAttribute("transform", "translate(200, -300) scale(1.5, 1.5)");
				}

				const planet2 = skillHero.querySelector("#planet2");
				if ( planet2 ) {
					planet2.setAttribute("transform", "translate(-1150, -500) scale(2, 2)");
				}
			}
			if ( skillPercentage > 50 ) {
				const rocket = skillHero.querySelector("#rocket");
				if ( rocket ) {
					rocket.setAttribute("transform", "translate(1300, -400) scale(3.5)");
					const rocketEventListener = rocket.addEventListener("transitionend", () => {
						skillHero.querySelector("#rocket g").setAttribute("opacity", "0");
					});
					rocket.removeEventListener("transitionend", rocketEventListener);
				}
			}
		};

		const experienceSlide: any = document.querySelector("#experienceSlide");
		const experienceBody: any = experienceSlide.querySelector(".slideBody");
		const experienceHero: any = experienceSlide.querySelector(".slideHeroWrapper");
		const resetExperience: any = async () => {
			const experienceLogo = experienceHero.querySelector("#experienceLogo");
			if ( experienceLogo ) {
				experienceLogo.setAttribute("transform", "translate(0, 0) scale(1, 1)");
			}
			const experienceBG = experienceHero.querySelector("#experienceGB g");
			if ( experienceBG ) {
				experienceBG.setAttribute("opacity", "1");
			}
			const rightleaf = experienceHero.querySelector("#rightleaf");
			if ( rightleaf ) {
				rightleaf.setAttribute("transform", "translate(0, 0) scale(1, 1)");
			}
			const leftleaf = experienceHero.querySelector("#leftleaf");
			if ( leftleaf ) {
				leftleaf.setAttribute("transform", "translate(0, 0) scale(1, 1)");
			}
			const tiger = experienceHero.querySelector("#tiger");
			if ( tiger ) {
				tiger.setAttribute("transform", "translate(0, 0)");
			}
			const grass1 = experienceHero.querySelector("#grass1");
			if ( grass1 ) {
				grass1.setAttribute("transform", "translate(0, 0)");
			}
			const grass2 = experienceHero.querySelector("#grass2");
			if ( grass2 ) {
				grass2.setAttribute("transform", "translate(0, 0)");
			}
			const grass3 = experienceHero.querySelector("#grass3");
			if ( grass3 ) {
				grass3.setAttribute("transform", "translate(0, 0)");
			}
			const giraffehead = experienceHero.querySelector("#giraffehead");
			if ( giraffehead ) {
				giraffehead.setAttribute("transform", "rotate(0 0 0)");
				giraffeAnimating = false;
			}
		};
		const experienceScroll: any = async (experiencePercentage: number) => {
			if ( experiencePercentage > 20 ) {
				const experienceLogo = experienceHero.querySelector("#experienceLogo");
				if ( experienceLogo ) {
					experienceLogo.setAttribute("transform", "translate(2, 10) scale(0.2)");
				}
			}

			if ( experiencePercentage > 25 ) {
				const experienceBG = experienceHero.querySelector("#experienceGB g");
				if ( experienceBG ) {
					experienceBG.setAttribute("opacity", "0");
				}

				const grass1 = experienceHero.querySelector("#grass1");
				if ( grass1 ) {
					grass1.setAttribute("transform", "translate(" + experiencePercentage * 8 + ", 0)");
				}
				const grass2 = experienceHero.querySelector("#grass2");
				if ( grass2 ) {
					grass2.setAttribute("transform", "translate(" + experiencePercentage * 5 + ", 0)");
				}
				const grass3 = experienceHero.querySelector("#grass3");
				if ( grass3 ) {
					grass3.setAttribute("transform", "translate(" + experiencePercentage * 2 + ", 0)");
				}
				const grass4 = experienceHero.querySelector("#grass4");
				if ( grass4 ) {
					grass4.setAttribute("transform", "translate(" + experiencePercentage * 0.5 + ", 0)");
				}
			}

			if ( experiencePercentage > 38 ) {
				const rightleaf = experienceHero.querySelector("#rightleaf");
				if ( rightleaf ) {
					rightleaf.setAttribute("transform", "translate(1500, 150) scale(0.5, 0)");
				}
				const leftleaf = experienceHero.querySelector("#leftleaf");
				if ( leftleaf ) {
					leftleaf.setAttribute("transform", "translate(-1500, 150) scale(0.5, 0)");
				}
			}
			if ( experiencePercentage > 50 ) {
				const tiger = experienceHero.querySelector("#tiger");
				if ( tiger ) {
					tiger.setAttribute("transform", "translate(0, -50)");
				}
			}
		};

		const educationSlide: any = document.querySelector("#educationSlide");
		const educationBody: any = educationSlide.querySelector(".slideBody");
		const educationHero: any = educationSlide.querySelector(".slideHeroWrapper");
		const resetEducation: any = async () => {
			const educationLogo = educationHero.querySelector("#educationLogo");
			if ( educationLogo ) {
				educationLogo.setAttribute("transform", "translate(0, 0) scale(1, 1)");
			}
			const moon = educationHero.querySelector("#moon");
			if ( moon ) {
				moon.setAttribute("transform", "translate(0, 0) scale(1, 1)");
			}
			const buildings1 = educationHero.querySelector("#buildings1");
			if ( buildings1 ) {
				buildings1.setAttribute("transform", "translate(0, 0)");
			}
			const buildings2 = educationHero.querySelector("#buildings2");
			if ( buildings2 ) {
				buildings2.setAttribute("transform", "translate(0, 0)");
			}
			const buildings3 = educationHero.querySelector("#buildings3");
			if ( buildings3 ) {
				buildings3.setAttribute("transform", "translate(0, 0)");
			}
			const eduClouds1 = educationHero.querySelector("#eduClouds1");
			if ( eduClouds1 ) {
				eduClouds1.setAttribute("transform", "translate(0, 0)");
				eduClouds1.querySelector("path").setAttribute("opacity", "0");
			}
			const eduClouds2 = educationHero.querySelector("#eduClouds2");
			if ( eduClouds2 ) {
				eduClouds2.setAttribute("transform", "translate(0, 0)");
				eduClouds2.querySelector("path").setAttribute("opacity", "0");
			}
			const eduClouds3 = educationHero.querySelector("#eduClouds3");
			if ( eduClouds3 ) {
				eduClouds3.setAttribute("transform", "translate(0, 0)");
				eduClouds3.querySelector("path").setAttribute("opacity", "0");
			}
		};
		const educationScroll: any = async (educationPercentage: number) => {
			const educationLogo = educationHero.querySelector("#educationLogo");
			if ( educationLogo ) {
				educationLogo.setAttribute("transform", "translate(2, 10) scale(0.2)");
			}
			const eduClouds1 = educationHero.querySelector("#eduClouds1");
			if ( eduClouds1 ) {
				eduClouds1.setAttribute("transform", "translate(" + educationPercentage * 0.6 + ", 0)");
			}
			const eduClouds2 = educationHero.querySelector("#eduClouds2");
			if ( eduClouds2 ) {
				eduClouds2.setAttribute("transform", "translate(" + educationPercentage * 0.3 + ", 0)");
			}
			const eduClouds3 = educationHero.querySelector("#eduClouds3");
			if ( eduClouds3 ) {
				eduClouds3.setAttribute("transform", "translate(" + educationPercentage * 0.1 + ", 0)");
			}
			if ( educationPercentage > 25 ) {
				const moon = educationHero.querySelector("#moon");
				if ( moon ) {
					moon.setAttribute("transform", "translate(-500, 200) scale(2, 2)");
				}
			}
			if ( educationPercentage > 40 ) {
				if ( eduClouds1 ) {
					eduClouds1.querySelector("path").setAttribute("opacity", "1");
				}
				if ( eduClouds2 ) {
					eduClouds2.querySelector("path").setAttribute("opacity", "1");
				}
				if ( eduClouds3 ) {
					eduClouds3.querySelector("path").setAttribute("opacity", "1");
				}
			}
			if ( educationPercentage > 45 ) {
				const buildings1 = educationHero.querySelector("#buildings1");
				if ( buildings1 ) {
					buildings1.setAttribute("transform", "translate(0, -150)");
				}
				const buildings2 = educationHero.querySelector("#buildings2");
				if ( buildings2 ) {
					buildings2.setAttribute("transform", "translate(0, -150)");
				}
				const buildings3 = educationHero.querySelector("#buildings3");
				if ( buildings3 ) {
					buildings3.setAttribute("transform", "translate(0, -150)");
				}
			}
		};

		const personalSlide: any = document.querySelector("#personalSlide");
		const personalBody: any = personalSlide.querySelector(".slideBody");
		const personalHero: any = personalSlide.querySelector(".slideHeroWrapper");
		const resetPersonal: any = async () => {
			const personalLogo = personalHero.querySelector("#personalLogo");
			if ( personalLogo ) {
				personalLogo.setAttribute("transform", "translate(0, 0) scale(1, 1)");
			}
		};
		const personalScroll: any = async (personalPercentage: number) => {
			const personalLogo = personalHero.querySelector("#personalLogo");
			if ( personalLogo ) {
				personalLogo.setAttribute("transform", "translate(2, 10) scale(0.2)");
			}
		};

		skillBody.style.paddingTop = skillHero.querySelector(".image").clientHeight + "px";
		experienceBody.style.paddingTop = experienceHero.querySelector(".image").clientHeight + "px";
		educationBody.style.paddingTop = educationHero.querySelector(".image").clientHeight + "px";
		personalBody.style.paddingTop = personalHero.querySelector(".image").clientHeight + "px";

		const onResize = async () => {
			skillBody.style.paddingTop = skillHero.querySelector(".image").clientHeight + "px";
			experienceBody.style.paddingTop = experienceHero.querySelector(".image").clientHeight + "px";
			educationBody.style.paddingTop = educationHero.querySelector(".image").clientHeight + "px";
			personalBody.style.paddingTop = personalHero.querySelector(".image").clientHeight + "px";
		};

		const onScroll = async () => {
			const skillPosition = skillBody.getBoundingClientRect();
			let skillPercentage = Math.floor(
				((skillPosition.height - skillHero.clientHeight + skillPosition.y) /
					(skillPosition.height - skillHero.clientHeight)) *
					100,
			);
			skillPercentage = 100 - skillPercentage;
			if ( skillPercentage <= 100 && skillPercentage > 0 ) {
				if ( skillPercentage <= 20 ) {
					await resetSkill();
				} else {
					await skillScroll(skillPercentage);
				}

				skillHero.style.width = skillBody.clientWidth + "px";
				skillHero.style.position = "fixed";
				skillHero.style.top = "0px";
				skillHero.style.left = skillPosition.left + "px";
			} else {
				skillHero.style.position = "absolute";
				skillHero.style.left = "0px";
				skillHero.style.width = "-webkit-fill-available";
				if ( skillPosition.y >= 0 ) {
					skillHero.style.top = "0px";
				} else if ( skillPosition.top + skillPosition.height <= skillHero.clientHeight ) {
					skillHero.style.top = skillPosition.height - skillHero.clientHeight + "px";
				}
				await resetSkill();
			}

			const experiencePosition = experienceBody.getBoundingClientRect();
			let experiencePercentage = Math.floor(
				((experiencePosition.height - experienceHero.clientHeight + experiencePosition.y) /
					(experiencePosition.height - experienceHero.clientHeight)) *
					100,
			);
			experiencePercentage = 100 - experiencePercentage;
			if ( experiencePercentage <= 100 && experiencePercentage > 0 ) {
				if ( experiencePercentage <= 15 ) {
					await resetExperience();
				} else {
					await experienceScroll(experiencePercentage);
				}

				experienceHero.style.width = experienceBody.clientWidth + "px";
				experienceHero.style.position = "fixed";
				experienceHero.style.top = "0px";
				experienceHero.style.left = experiencePosition.left + "px";
			} else {
				experienceHero.style.position = "absolute";
				experienceHero.style.left = "0px";
				experienceHero.style.width = "-webkit-fill-available";
				if ( experiencePosition.y >= 0 ) {
					experienceHero.style.top = "0px";
				} else if ( experiencePosition.top + experiencePosition.height <= experienceHero.clientHeight ) {
					experienceHero.style.top = experiencePosition.height - experienceHero.clientHeight + "px";
				}
				await resetExperience();
			}

			const educationPosition = educationBody.getBoundingClientRect();
			let educationPercentage = Math.floor(
				((educationPosition.height - educationHero.clientHeight + educationPosition.y) /
					(educationPosition.height - educationHero.clientHeight)) *
					100,
			);
			educationPercentage = 100 - educationPercentage;
			if ( educationPercentage <= 100 && educationPercentage > 0 ) {
				if ( educationPercentage <= 20 ) {
					await resetEducation();
				} else {
					await educationScroll(educationPercentage);
				}

				educationHero.style.width = educationBody.clientWidth + "px";
				educationHero.style.position = "fixed";
				educationHero.style.top = "0px";
				educationHero.style.left = educationPosition.left + "px";
			} else {
				educationHero.style.position = "absolute";
				educationHero.style.left = "0px";
				educationHero.style.width = "-webkit-fill-available";
				if ( educationPosition.y >= 0 ) {
					educationHero.style.top = "0px";
				} else if ( educationPosition.top + educationPosition.height <= educationHero.clientHeight ) {
					educationHero.style.top = educationPosition.height - educationHero.clientHeight + "px";
				}
				await resetEducation();
			}

			const personalPosition = personalBody.getBoundingClientRect();
			let personalPercentage = Math.floor(
				((personalPosition.height - personalHero.clientHeight + personalPosition.y) /
					(personalPosition.height - personalHero.clientHeight)) *
					100,
			);
			personalPercentage = 100 - personalPercentage;
			if ( personalPercentage <= 100 && personalPercentage > 0 ) {
				if ( personalPercentage <= 20 ) {
					await resetPersonal();
				} else {
					await personalScroll(personalPercentage);
				}

				personalHero.style.width = personalBody.clientWidth + "px";
				personalHero.style.position = "fixed";
				personalHero.style.top = "0px";
				personalHero.style.left = personalPosition.left + "px";
			} else {
				personalHero.style.position = "absolute";
				personalHero.style.left = "0px";
				personalHero.style.width = "100%";
				if ( personalPosition.y >= 0 ) {
					personalHero.style.top = "0px";
				} else if ( personalPosition.top + personalPosition.height <= personalHero.clientHeight ) {
					personalHero.style.top = personalPosition.height - personalHero.clientHeight + "px";
				}
				await resetPersonal();
			}
		};

		window.addEventListener("resize", onResize);
		document.addEventListener("scroll", onScroll);

		return () => {
			window.removeEventListener("resize", onResize);
			document.removeEventListener("scroll", onScroll);
			document.head.removeChild(meta);
		};
	}, []);

	return (
		<>
${jsx}
		</>
	);
}
`;

const tsxPath = path.resolve(__dirname, "../src/views/WebDev.tsx");
fs.writeFileSync(tsxPath, component);
console.log("Wrote", tsxPath, "and", scssPath);
