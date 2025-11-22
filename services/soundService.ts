
let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Helper to create a noise buffer for gritty textures
const createNoiseBuffer = () => {
  const ctx = getContext();
  const bufferSize = ctx.sampleRate * 2.0; // 2 seconds
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

let noiseBuffer: AudioBuffer | null = null;

export const initAudio = () => {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  if (!noiseBuffer) {
    noiseBuffer = createNoiseBuffer();
  }
};

export const playClickSound = () => {
  const ctx = getContext();
  const t = ctx.currentTime;

  // High tick
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);

  gain.gain.setValueAtTime(0.1, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.05);
};

export const playPaperSound = () => {
  // A short burst of noise like crumpling paper or a static shift
  const ctx = getContext();
  if (!noiseBuffer) noiseBuffer = createNoiseBuffer();
  const t = ctx.currentTime;

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  const gain = ctx.createGain();
  
  // Bandpass filter to make it sound like paper/rustle
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1000;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0.5, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
  
  source.start(t);
  source.stop(t + 0.15);
};

export const playDramaticBoom = () => {
  const ctx = getContext();
  const t = ctx.currentTime;

  // Sub-bass boom
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.5);

  gain.gain.setValueAtTime(0.5, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 1.5);

  // Add some grit/distortion on top
  if (!noiseBuffer) noiseBuffer = createNoiseBuffer();
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = noiseBuffer;
  const noiseGain = ctx.createGain();
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 600;

  noiseSrc.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noiseGain.gain.setValueAtTime(0.2, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
  
  noiseSrc.start(t);
  noiseSrc.stop(t + 0.5);
};

export const playProjectorSound = () => {
  const ctx = getContext();
  const t = ctx.currentTime;

  // Rhythmic clicking
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(15, t); // 15hz rattle

  gain.gain.setValueAtTime(0.1, t);
  gain.gain.linearRampToValueAtTime(0, t + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.3);
};
