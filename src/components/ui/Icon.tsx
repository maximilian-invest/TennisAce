import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'arrowRight'
  | 'chevronLeft'
  | 'check'
  | 'info'
  | 'eqNone'
  | 'eqHome'
  | 'eqGym';

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

// Icon paths transcribed 1:1 from the ACE Athlete design export.
export function Icon({ name, size = 20, color = '#000', strokeWidth = 2 }: Props) {
  const s = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === 'arrowRight' && <Path d="M5 12h14M13 6l6 6-6 6" {...s} />}
      {name === 'chevronLeft' && <Path d="M15 6l-6 6 6 6" {...s} />}
      {name === 'check' && <Path d="M5 13l4 4L19 7" {...s} />}
      {name === 'info' && (
        <>
          <Circle cx={12} cy={12} r={9} {...s} />
          <Path d="M12 8h.01M11 12h1v4h1" {...s} />
        </>
      )}
      {name === 'eqNone' && (
        <>
          <Circle cx={12} cy={7} r={3.4} {...s} />
          <Path d="M5.5 21c0-3.6 2.9-6.4 6.5-6.4s6.5 2.8 6.5 6.4" {...s} />
        </>
      )}
      {name === 'eqHome' && <Path d="M6 9v6M18 9v6M3 11h3M18 11h3M9 8v8M15 8v8M9 12h6" {...s} />}
      {name === 'eqGym' && (
        <>
          <Rect x={3} y={3} width={7} height={7} rx={1.4} {...s} />
          <Rect x={14} y={3} width={7} height={7} rx={1.4} {...s} />
          <Rect x={3} y={14} width={7} height={7} rx={1.4} {...s} />
          <Rect x={14} y={14} width={7} height={7} rx={1.4} {...s} />
        </>
      )}
    </Svg>
  );
}
