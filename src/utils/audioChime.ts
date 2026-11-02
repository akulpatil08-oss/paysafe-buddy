/**
 * Web Audio API synthesizer for authentic UPI payment chime
 */
export function playUpiSuccessChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Two-tone cheerful melodic chime (like Google Pay / Paytm soundbox)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Note 1: E5 (659.25 Hz) -> Note 2: A5 (880 Hz) -> Note 3: C#6 (1108.73 Hz)
    osc1.frequency.setValueAtTime(659.25, now);
    osc1.frequency.setValueAtTime(880, now + 0.12);
    osc1.frequency.setValueAtTime(1108.73, now + 0.24);

    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc1.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.7);
  } catch (err) {
    // Audio context may be restricted before user gesture
    console.debug('Audio play skipped:', err);
  }
}
