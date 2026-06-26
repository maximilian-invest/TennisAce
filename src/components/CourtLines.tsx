import { StyleSheet } from 'react-native';
import Svg, { G, Line, Path } from 'react-native-svg';

/** Faint tennis-court line illustration used as a card background (from the design). */
export function CourtLines({ color, opacity = 0.16 }: { color: string; opacity?: number }) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 360 220"
      preserveAspectRatio="xMidYMid slice"
      style={StyleSheet.absoluteFill}
    >
      <G fill="none" stroke={color} strokeWidth={1.4} opacity={opacity}>
        <Path d="M120 6 L240 6 L348 214 L12 214 Z" />
        <Line x1={-10} y1={112} x2={370} y2={112} />
        <Path d="M150 6 L138 112 L222 112 L210 6" />
        <Line x1={180} y1={6} x2={180} y2={128} />
      </G>
    </Svg>
  );
}
