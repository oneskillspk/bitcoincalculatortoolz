/**
 * Vitest stub for `lottie-react` — the real package pulls in canvas/DOM
 * animation deps that jsdom can't resolve. Tests only care that a component
 * mounts without crashing.
 */
import React from 'react';

const Lottie: React.FC<Record<string, unknown>> = () => null;

export default Lottie;
export { Lottie };
