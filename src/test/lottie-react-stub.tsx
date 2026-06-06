// Test-only stub for lottie-react. Bypasses lottie-web, which crashes in
// jsdom because HTMLCanvasElement.getContext returns null. Renders a tiny
// placeholder so LazyLottie consumers still get the wrapping element.
import * as React from 'react';

type StubProps = {
  className?: string;
  style?: React.CSSProperties;
};

const Lottie: React.FC<StubProps> = ({ className, style }) => (
  <div data-testid="lottie-stub" className={className} style={style} />
);

export default Lottie;
