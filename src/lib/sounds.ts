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

// A major pentatonic across two octaves, from A3.
const AMBIENT_SCALE = [
  220, 246.94, 277.18, 329.63, 369.99, 440, 493.88, 554.37,
];
const AMBIENT_LEVEL = 0.5;

type Ambient = {
  token: object;
  master: GainNode;
  voices: OscillatorNode[];
  timer: number;
};

let ambient: Ambient | null = null;

const rampGain = (
  param: AudioParam,
  ctx: AudioContext,
  to: number,
  seconds: number,
) => {
  const now = ctx.currentTime;
  param.cancelScheduledValues(now);
  param.setValueAtTime(Math.max(param.value, 0.0001), now);
  param.exponentialRampToValueAtTime(to, now + seconds);
};

/** Starts (or fades back in) a slow generative pad. Returns false while audio is still locked. */
export const startAmbient = (): boolean => {
  const ctx = ready();
  if (!ctx) return false;
  if (ambient) {
    rampGain(ambient.master.gain, ctx, AMBIENT_LEVEL, 1);
    return true;
  }

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(AMBIENT_LEVEL, now + 2.5);
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1500;
  filter.Q.value = 0.4;
  filter.connect(master);

  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.42;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.4;
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  filter.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(wet).connect(master);

  const voices: OscillatorNode[] = [];
  const drone = (frequency: number, type: WaveType, gain: number) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    const g = ctx.createGain();
    g.gain.value = gain;
    osc.connect(g).connect(filter);
    osc.start(now);
    voices.push(osc);
  };
  drone(110, "sine", 0.16);
  drone(164.81, "triangle", 0.05);
  drone(220.6, "sine", 0.04);

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 400;
  lfo.connect(lfoDepth).connect(filter.frequency);
  lfo.start(now);
  voices.push(lfo);

  const token = {};
  const current: Ambient = { token, master, voices, timer: 0 };
  ambient = current;

  let lastIndex = -1;
  const playNote = () => {
    if (ambient?.token !== token) return;
    let index = Math.floor(Math.random() * AMBIENT_SCALE.length);
    if (index === lastIndex) index = (index + 1) % AMBIENT_SCALE.length;
    lastIndex = index;
    const frequency = AMBIENT_SCALE[index];
    const t = ctx.currentTime + 0.05;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frequency;
    const octave = ctx.createOscillator();
    octave.type = "triangle";
    octave.frequency.value = frequency * 2;
    const octaveGain = ctx.createGain();
    octaveGain.gain.value = 0.2;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.15, t + 0.6);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);
    osc.connect(env);
    octave.connect(octaveGain).connect(env);
    env.connect(filter);
    osc.start(t);
    octave.start(t);
    osc.stop(t + 3.5);
    octave.stop(t + 3.5);
    current.timer = window.setTimeout(playNote, 1500 + Math.random() * 1500);
  };
  playNote();
  return true;
};

export const stopAmbient = (fadeSeconds = 1.5) => {
  const current = ambient;
  if (!current) return;
  ambient = null;
  window.clearTimeout(current.timer);
  const ctx = getContext();
  if (!ctx) return;
  rampGain(current.master.gain, ctx, 0.0001, fadeSeconds);
  window.setTimeout(
    () => {
      current.voices.forEach((voice) => voice.stop());
      current.master.disconnect();
    },
    (fadeSeconds + 0.2) * 1000,
  );
};

export const isAmbientPlaying = () => ambient !== null;
