import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/app";

type AvatarAudioLevelEvent = CustomEvent<{ level: number }>;

export default function Avatar() {
	const avatarTTS = useAppStore((state) => state.avatarTTS);
	const avatarResponse = useAppStore((state) => state.avatarResponse);
	const audioUrlRef = useRef<string | null>(null);
	const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationFrameRef = useRef(0);
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
	const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
	const frequencyDataRef = useRef<Uint8Array | null>(null);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);
	const lastFrameRef = useRef(0);
	const manualAudioLevelRef = useRef<number | null>(null);
	const manualAudioLevelUpdatedRef = useRef(0);
	const speechAudioPulseFrameRef = useRef(0);
	const isPlayingRef = useRef(false);

	const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
		const shader = gl.createShader(type);
		if ( shader === null ) {
			return null;
		}
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	};

	const createProgram = (gl: WebGLRenderingContext): WebGLProgram | null => {
		const vertexShader = createShader(
			gl,
			gl.VERTEX_SHADER,
			`
			attribute vec2 position;
			void main() {
				gl_Position = vec4(position, 0.0, 1.0);
			}
		`,
		);
		const fragmentShader = createShader(
			gl,
			gl.FRAGMENT_SHADER,
			`
			precision mediump float;
			uniform vec2 resolution;
			uniform float time;
			uniform float audio;
			uniform vec3 primaryColor;

			float ring(vec2 uv, float radius, float thickness) {
				return smoothstep(thickness, 0.0, abs(length(uv) - radius));
			}

			float spokes(vec2 uv, float count, float speed) {
				float angle = atan(uv.y, uv.x) + time * speed;
				return smoothstep(0.965, 1.0, abs(sin(angle * count)));
			}

			float grid(vec2 uv) {
				vec2 g = abs(fract((uv + time * 0.02) * 9.0) - 0.5);
				return smoothstep(0.492, 0.5, max(g.x, g.y));
			}

			void main() {
				vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
				float pulse = 0.08 + audio * 0.2;
				float core = ring(uv, 0.22 + pulse, 0.03 + audio * 0.02);
				float inner = ring(uv, 0.42 + sin(time * 1.7) * 0.025, 0.013);
				float outer = ring(uv, 0.72 + audio * 0.08, 0.018);
				float halo = smoothstep(0.95 + audio * 0.15, 0.18, length(uv));
				float radial = spokes(uv, 18.0, 0.38) * outer;
				float fine = spokes(uv, 54.0, -0.22) * ring(uv, 0.58, 0.02);
				float circuit = grid(uv) * smoothstep(0.9, 0.18, length(uv)) * 0.18;
				float sparks = smoothstep(0.986, 1.0, sin((uv.x * 37.0 + uv.y * 61.0) + time * 8.0));
				float glow = core * 1.5 + inner + outer * 1.4 + radial + fine * 0.7 + circuit + sparks * audio;
				vec3 base = clamp(primaryColor, 0.0, 1.0);
				vec3 darkTone = base * (0.18 + audio * 0.08);
				vec3 brightTone = min(base * (1.35 + audio * 0.35), vec3(1.0));
				vec3 coreTone = min(base * 1.6, vec3(1.0));
				vec3 color = darkTone * halo + brightTone * glow + coreTone * core;
				float alpha = smoothstep(1.05, 0.2, length(uv));
				gl_FragColor = vec4(color, alpha);
			}
		`,
		);

		if ( vertexShader === null || fragmentShader === null ) {
			return null;
		}

		const program = gl.createProgram();
		if ( program === null ) {
			return null;
		}

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
			gl.deleteProgram(program);
			return null;
		}

		return program;
	};

	const updateAudioLevel = () => {
		if ( manualAudioLevelRef.current !== null && performance.now() - manualAudioLevelUpdatedRef.current < 500 ) {
			useAppStore.setState({
				avatarAudioLevel: useAppStore.getState().avatarAudioLevel * 0.78 + manualAudioLevelRef.current * 0.22,
			});
			return;
		}

		if ( analyserRef.current === null || frequencyDataRef.current === null ) {
			const fallback = 0.12 + Math.sin(performance.now() / 520) * 0.04;
			useAppStore.setState({
				avatarAudioLevel: useAppStore.getState().avatarAudioLevel * 0.94 + fallback * 0.06,
			});
			return;
		}

		analyserRef.current.getByteFrequencyData(frequencyDataRef.current as Uint8Array<ArrayBuffer>);
		const sum = frequencyDataRef.current.reduce((total, value) => total + value, 0);
		const nextLevel = Math.min(sum / frequencyDataRef.current.length / 155, 1);
		useAppStore.setState({
			avatarAudioLevel: useAppStore.getState().avatarAudioLevel * 0.82 + nextLevel * 0.18,
		});
	};

	const connectAnalyser = () => {
		if ( audioContextRef.current === null ) {
			audioContextRef.current = new AudioContext();
		}

		analyserRef.current?.disconnect();
		analyserRef.current = audioContextRef.current.createAnalyser();
		analyserRef.current.fftSize = 512;
		analyserRef.current.smoothingTimeConstant = 0.84;
		frequencyDataRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

		return analyserRef.current;
	};

	const setAudioLevel = (level: number) => {
		manualAudioLevelRef.current = Math.max(0, Math.min(level, 1));
		manualAudioLevelUpdatedRef.current = performance.now();
	};

	const emitAvatarAudioLevel = (level: number) => {
		window.dispatchEvent(
			new CustomEvent("avatar-audio-level", {
				detail: {
					level: Math.max(0, Math.min(level, 1)),
				},
			}),
		);
	};

	const stopSpeechAudioPulse = () => {
		if ( speechAudioPulseFrameRef.current !== 0 ) {
			window.cancelAnimationFrame(speechAudioPulseFrameRef.current);
			speechAudioPulseFrameRef.current = 0;
		}
	};

	const startSpeechAudioPulse = () => {
		stopSpeechAudioPulse();

		const pulse = (now: number) => {
			const level = 0.38 + Math.sin(now / 95) * 0.12 + Math.sin(now / 41) * 0.06;
			emitAvatarAudioLevel(level);

			if ( isPlayingRef.current === true ) {
				speechAudioPulseFrameRef.current = window.requestAnimationFrame(pulse);
			}
		};

		speechAudioPulseFrameRef.current = window.requestAnimationFrame(pulse);
	};

	const onAvatarAudioLevel = (event: Event) => {
		const audioEvent = event as AvatarAudioLevelEvent;
		if ( typeof audioEvent.detail?.level !== "number" ) {
			return;
		}
		setAudioLevel(audioEvent.detail.level);
	};

	const resizeCanvas = () => {
		const targetCanvas = canvasRef.current;
		if ( targetCanvas === null ) {
			return;
		}
		const pixelRatio = window.devicePixelRatio || 1;
		const width = Math.max(Math.floor(targetCanvas.clientWidth * pixelRatio), 1);
		const height = Math.max(Math.floor(targetCanvas.clientHeight * pixelRatio), 1);

		if ( targetCanvas.width !== width || targetCanvas.height !== height ) {
			targetCanvas.width = width;
			targetCanvas.height = height;
		}
	};

	const getPrimaryColor = () => {
		const fallback: [number, number, number] = [0.84, 0.12, 0.1];
		const style = getComputedStyle(document.documentElement);
		const rawValue = style.getPropertyValue("--primary").trim();

		if ( rawValue.length === 0 ) {
			return fallback;
		}

		const hexMatch = rawValue.match(/^#([\da-fA-F]{3}|[\da-fA-F]{6})$/);
		if ( hexMatch ) {
			const compact = hexMatch[1];
			const normalizedHex =
				compact.length === 3
					? compact
							.split("")
							.map((value) => `${value}${value}`)
							.join("")
					: compact;
			const red = Number.parseInt(normalizedHex.slice(0, 2), 16) / 255;
			const green = Number.parseInt(normalizedHex.slice(2, 4), 16) / 255;
			const blue = Number.parseInt(normalizedHex.slice(4, 6), 16) / 255;
			return [red, green, blue];
		}

		const rgbMatch = rawValue.match(/^rgba?\(([^)]+)\)$/i);
		if ( rgbMatch ) {
			const parts = rgbMatch[1].split(",").map((part) => Number.parseFloat(part.trim()));
			if ( parts.length >= 3 && parts.slice(0, 3).every((value) => Number.isFinite(value)) ) {
				return [
					Math.max(0, Math.min(parts[0], 255)) / 255,
					Math.max(0, Math.min(parts[1], 255)) / 255,
					Math.max(0, Math.min(parts[2], 255)) / 255,
				];
			}
		}

		return fallback;
	};

	const startAnimation = () => {
		const targetCanvas = canvasRef.current;
		if ( targetCanvas === null ) {
			return;
		}

		const gl = targetCanvas.getContext("webgl", { alpha: true, antialias: true });
		if ( gl === null ) {
			return;
		}

		const program = createProgram(gl);
		if ( program === null ) {
			return;
		}

		const buffer = gl.createBuffer();
		const position = gl.getAttribLocation(program, "position");
		const resolution = gl.getUniformLocation(program, "resolution");
		const time = gl.getUniformLocation(program, "time");
		const audio = gl.getUniformLocation(program, "audio");
		const primaryColor = gl.getUniformLocation(program, "primaryColor");

		if (
			buffer === null ||
			position === -1 ||
			resolution === null ||
			time === null ||
			audio === null ||
			primaryColor === null
		) {
			return;
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
		gl.useProgram(program);
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

		const render = (now: number) => {
			lastFrameRef.current = lastFrameRef.current || now;
			const elapsed = (now - lastFrameRef.current) / 1000;
			lastFrameRef.current = now;

			updateAudioLevel();
			resizeCanvas();
			gl.viewport(0, 0, targetCanvas.width, targetCanvas.height);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.uniform2f(resolution, targetCanvas.width, targetCanvas.height);
			gl.uniform1f(time, now / 1000);
			gl.uniform1f(audio, Math.min(useAppStore.getState().avatarAudioLevel + elapsed * 0.1, 1));
			const [primaryRed, primaryGreen, primaryBlue] = getPrimaryColor();
			gl.uniform3f(primaryColor, primaryRed, primaryGreen, primaryBlue);
			gl.drawArrays(gl.TRIANGLES, 0, 6);

			animationFrameRef.current = window.requestAnimationFrame(render);
		};

		render(0);
	};

	const cleanUpUrl = () => {
		if ( audioUrlRef.current ) {
			URL.revokeObjectURL(audioUrlRef.current);
			audioUrlRef.current = "";
			if ( audioPlayerRef.current ) {
				audioPlayerRef.current.removeAttribute("src");
			}
		}
	};

	const loadAudioBlob = async (blob: Blob) => {
		cleanUpUrl();
		audioUrlRef.current = URL.createObjectURL(blob);
		if ( audioPlayerRef.current ) {
			audioPlayerRef.current.src = audioUrlRef.current;
		}
	};

	const playAudio = () => {
		if ( audioPlayerRef.current ) {
			audioPlayerRef.current.play().catch((error) => {
				console.error("Playback failed. Ensure user interacted with the page first:", error);
			});
		}
	};

	useEffect(() => {
		resizeCanvas();
		startAnimation();
		window.addEventListener("avatar-audio-level", onAvatarAudioLevel);

		if ( canvasRef.current !== null ) {
			resizeObserverRef.current = new ResizeObserver(resizeCanvas);
			resizeObserverRef.current.observe(canvasRef.current);
		}

		return () => {
			stopSpeechAudioPulse();
			window.cancelAnimationFrame(animationFrameRef.current);
			window.removeEventListener("avatar-audio-level", onAvatarAudioLevel);
			cleanUpUrl();
			resizeObserverRef.current?.disconnect();
			mediaStreamSourceRef.current?.disconnect();
			mediaElementSourceRef.current?.disconnect();
			analyserRef.current?.disconnect();
			audioContextRef.current?.close();
		};
	}, []);

	useEffect(() => {
		const playResponse = async () => {
			stopSpeechAudioPulse();
			if ( useAppStore.getState().avatarTTS?.base64 ) {
				const currentTTS = useAppStore.getState().avatarTTS;
				const audioBlob = await fetch(
					`data:${currentTTS?.mime_type || "audio/wav"};base64,${currentTTS?.base64}`,
				).then((res) => res.blob());
				await loadAudioBlob(audioBlob).then(() => {
					playAudio();
					emitAvatarAudioLevel(0.56);
				});
			}
		};
		playResponse();
	}, [avatarResponse, avatarTTS]);

	return (
		<>
			{avatarTTS?.base64 && audioUrlRef.current ? (
				<div>
					<div className="audioPlayerWrapper">
						<audio
							ref={audioPlayerRef}
							src={audioUrlRef.current || undefined}
							onPlay={() => {
								isPlayingRef.current = true;
								startSpeechAudioPulse();
							}}
							onPause={() => {
								isPlayingRef.current = false;
								stopSpeechAudioPulse();
							}}
							onEnded={() => {
								isPlayingRef.current = false;
								stopSpeechAudioPulse();
							}}
							controls
						></audio>
					</div>
				</div>
			) : null}
			<div id="avatarWrapper">
				<div className="avatarVisual" aria-label="Audio reactive avatar">
					<canvas ref={canvasRef} className="avatarVisualCanvas"></canvas>
				</div>
			</div>
		</>
	);
}
