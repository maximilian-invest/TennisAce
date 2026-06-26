import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'arrowRight'
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronDown'
  | 'check'
  | 'info'
  | 'menu'
  | 'swap'
  | 'bulb'
  | 'replace'
  | 'pause'
  | 'eqNone'
  | 'eqHome'
  | 'eqGym'
  | 'play'
  | 'steps'
  | 'flame'
  | 'bolt'
  | 'calendar'
  | 'figure'
  | 'search'
  | 'plus';

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

// Icon paths transcribed 1:1 from the ACE Athlete design export.
export function Icon({ name, size = 20, color = '#000', strokeWidth = 2 }: Props) {
  const s = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === 'arrowRight' && <Path d="M5 12h14M13 6l6 6-6 6" {...s} />}
      {name === 'chevronLeft' && <Path d="M15 6l-6 6 6 6" {...s} />}
      {name === 'chevronRight' && <Path d="M9 6l6 6-6 6" {...s} />}
      {name === 'chevronDown' && <Path d="M6 9l6 6 6-6" {...s} />}
      {name === 'check' && <Path d="M5 13l4 4L19 7" {...s} />}
      {name === 'menu' && <Path d="M4 6h16M4 12h16M4 18h16" {...s} />}
      {name === 'swap' && <Path d="M7 8l-4 4 4 4M3 12h12M17 16l4-4-4-4M21 12H9" {...s} />}
      {name === 'bulb' && <Path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.6-1 1-1 2H9c0-1-.3-1.4-1-2A6 6 0 0 1 12 3z" {...s} />}
      {name === 'replace' && <Path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4" {...s} />}
      {name === 'play' && <Path d="M7 5l13 7-13 7z" fill={color} />}
      {name === 'pause' && (
        <>
          <Rect x={6} y={5} width={4} height={14} rx={1.2} fill={color} />
          <Rect x={14} y={5} width={4} height={14} rx={1.2} fill={color} />
        </>
      )}
      {name === 'flame' && <Path d="M12 2c1 3-1 5-2 7s0 4 2 4 3-2 2-5c2 1 4 4 4 7a6 6 0 0 1-12 0c0-4 4-6 6-13z" fill={color} />}
      {name === 'bolt' && <Path d="M13 2L3 14h7l-1 8 10-12h-7z" fill={color} />}
      {name === 'steps' && (
        <Path d="M6 17c-1 0-2-1-2-3s.5-4 2-5 2 1 2 3 0 5-2 5zM15 21c-1 0-2-1-2-3s.5-4 2-5 2 1 2 3 0 5-2 5z" {...s} />
      )}
      {name === 'calendar' && (
        <>
          <Rect x={3} y={4} width={18} height={17} rx={3} {...s} />
          <Path d="M3 9h18M8 2v4M16 2v4" {...s} />
        </>
      )}
      {name === 'info' && (
        <>
          <Circle cx={12} cy={12} r={9} {...s} />
          <Path d="M12 8h.01M11 12h1v4h1" {...s} />
        </>
      )}
      {name === 'figure' && (
        <>
          <Circle cx={12} cy={5} r={2.3} {...s} />
          <Path d="M12 8v6M12 11l-4 2M12 11l4 2M12 14l-3 5M12 14l3 5" {...s} />
        </>
      )}
      {name === 'search' && (
        <>
          <Circle cx={11} cy={11} r={7} {...s} />
          <Path d="M21 21l-4-4" {...s} />
        </>
      )}
      {name === 'plus' && <Path d="M12 5v14M5 12h14" {...s} />}
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
