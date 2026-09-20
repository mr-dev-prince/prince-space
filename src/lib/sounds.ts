type FilterType = BiquadFilterType;
type WaveType = OscillatorType;

let context: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
let unlockInstalled = false;
let lastKeyAt = 0;
let lastTickAt = 0;

const getContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!context) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  return context;
};

let hasGesture = false;

/** Browsers keep audio suspended until the page receives a click or key press. */
export const unlockAudio = () => {
  const ctx = getContext();
  if (ctx && ctx.state === "suspended") void ctx.resume();
};

/**
 * Marks the first user gesture in the capture phase, so a sound triggered by
 * that same click is scheduled while the context resumes instead of dropped.
 */
export const installAudioUnlock = () => {
  if (unlockInstalled || typeof window === "undefined") return;
  unlockInstalled = true;
  const handler = () => {
    hasGesture = true;
    unlockAudio();
    window.removeEventListener("pointerdown", handler, true);
    window.removeEventListener("keydown", handler, true);
  };
  window.addEventListener("pointerdown", handler, true);
  window.addEventListener("keydown", handler, true);
};

const ready = (): AudioContext | null => {
  if (!hasGesture) return null;
  const ctx = getContext();
  if (!ctx) return null;
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
};

const getNoise = (ctx: AudioContext) => {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
};

const burst = (
  ctx: AudioContext,
  opts: {
    duration: number;
    gain: number;
    filter: FilterType;
    frequency: number;
    q?: number;
  },
) => {
  const source = ctx.createBufferSource();
  source.buffer = getNoise(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = opts.filter;
  filter.frequency.value = opts.frequency;
  filter.Q.value = opts.q ?? 1;
  const gain = ctx.createGain();
  const t = ctx.currentTime;
  gain.gain.setValueAtTime(opts.gain, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.duration);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(t, Math.random() * 0.5);
  source.stop(t + opts.duration + 0.02);
};

const tone = (
  ctx: AudioContext,
  opts: {
    frequency: number;
    duration: number;
    gain: number;
    type?: WaveType;
    start?: number;
  },
) => {
  const osc = ctx.createOscillator();
  osc.type = opts.type ?? "sine";
  osc.frequency.value = opts.frequency;
  const gain = ctx.createGain();
  const t = ctx.currentTime + (opts.start ?? 0);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(opts.gain, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + opts.duration + 0.02);
};

/** Mechanical key: a filtered noise tap plus a low "thock", randomised per key. */
export const playKey = () => {
  const ctx = ready();
  if (!ctx) return;
  const now = performance.now();
  if (now - lastKeyAt < 28) return;
  lastKeyAt = now;
  burst(ctx, {
    duration: 0.06,
    gain: 0.35,
    filter: "bandpass",
    frequency: 1800 + Math.random() * 1600,
    q: 0.8,
  });
  tone(ctx, {
    frequency: 140 + Math.random() * 40,
    duration: 0.05,
    gain: 0.12,
    type: "triangle",
  });
};

export const playMouse = (phase: "down" | "up") => {
  const ctx = ready();
  if (!ctx) return;
  burst(ctx, {
    duration: phase === "down" ? 0.03 : 0.025,
    gain: phase === "down" ? 0.5 : 0.35,
    filter: "highpass",
    frequency: phase === "down" ? 2500 : 3500,
    q: 0.7,
  });
};

export const playScrollTick = () => {
  const ctx = ready();
  if (!ctx) return;
  const now = performance.now();
  if (now - lastTickAt < 40) return;
  lastTickAt = now;
  burst(ctx, {
    duration: 0.012,
    gain: 0.2,
    filter: "bandpass",
    frequency: 4000,
    q: 2,
  });
};

/** Piezo buzzer style beep. */
export const playBeep = (frequency = 1400, duration = 0.09) => {
  const ctx = ready();
  if (!ctx) return;
  tone(ctx, { frequency, duration, gain: 0.06, type: "square" });
};

/** Plays a note sequence; returns the total length in seconds, or 0 if audio is locked. */
export const playChime = (
  notes: number[],
  step = 0.16,
  duration = 0.5,
  gain = 0.12,
) => {
  const ctx = ready();
  if (!ctx) return 0;
  notes.forEach((frequency, i) =>
    tone(ctx, { frequency, duration, gain, type: "sine", start: i * step }),
  );
  return (notes.length - 1) * step + duration;
};

/**
 * The background music is a real track rather than synthesis, so it lives on a
 * plain <audio> element: no AudioContext to keep alive, and nothing is fetched
 * until someone actually asks to hear it.
 */
const TRACK_SRC = "/music.mp3";
const TRACK_LEVEL = 0.45;
const FADE_STEP_MS = 40;

let track: HTMLAudioElement | null = null;
let playing = false;
let fadeTimer = 0;

/**
 * Set while the dock is deliberately playing music, so the headphones doodle
 * cutting its own hover playback does not silence a track the visitor asked
 * for. Only a forced stop, which is what the dock's pause does, gets through.
 */
let held = false;

type AmbientListener = (playing: boolean) => void;
const listeners = new Set<AmbientListener>();

/** Subscribes to playback starting or stopping, from whichever control did it. */
export const onAmbientChange = (listener: AmbientListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const announce = () => listeners.forEach((listener) => listener(playing));

export const holdAmbient = (value: boolean) => {
  held = value;
};

const getTrack = () => {
  if (!track) {
    track = new Audio(TRACK_SRC);
    track.loop = true;
    track.preload = "none";
    track.volume = 0;
  }
  return track;
};

/** Linear volume ramp, so starting mid fade-out simply turns around. */
const fadeTo = (target: number, ms: number, done?: () => void) => {
  const el = track;
  if (!el) return;
  window.clearInterval(fadeTimer);
  const from = el.volume;
  const startedAt = performance.now();
  fadeTimer = window.setInterval(() => {
    const progress =
      ms <= 0 ? 1 : Math.min(1, (performance.now() - startedAt) / ms);
    el.volume = Math.min(1, Math.max(0, from + (target - from) * progress));
    if (progress === 1) {
      window.clearInterval(fadeTimer);
      done?.();
    }
  }, FADE_STEP_MS);
};

/** Starts (or fades back in) the track. Returns false while audio is still locked. */
export const startAmbient = (): boolean => {
  if (!hasGesture || typeof window === "undefined") return false;

  const el = getTrack();
  playing = true;
  fadeTo(TRACK_LEVEL, 1200);

  // Playback can still be refused, in which case nothing is playing after all.
  void Promise.resolve(el.play()).catch(() => {
    playing = false;
    window.clearInterval(fadeTimer);
    announce();
  });

  announce();
  return true;
};

export const stopAmbient = (fadeSeconds = 1.5, force = false) => {
  if (held && !force) return;
  if (!playing) return;
  playing = false;
  announce();
  fadeTo(0, fadeSeconds * 1000, () => track?.pause());
};

export const isAmbientPlaying = () => playing;
