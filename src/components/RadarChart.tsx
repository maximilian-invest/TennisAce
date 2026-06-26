import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

import type { Domain, DomainScores, Lang } from '@/domain/models';
import { useTheme } from '@/theme/ThemeContext';

const DOMAINS: Domain[] = ['speed', 'agility', 'powerLower', 'powerUpper', 'core', 'aerobic', 'mobility'];

const SHORT: Record<Domain, string> = {
  speed: 'SPD',
  agility: 'AGI',
  powerLower: 'P·L',
  powerUpper: 'P·O',
  core: 'CORE',
  aerobic: 'AER',
  mobility: 'MOB',
};

export function RadarChart({ scores, size = 280 }: { scores: DomainScores; size?: number; lang?: Lang }) {
  const { colors } = useTheme();
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 32;
  const n = DOMAINS.length;

  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const point = (i: number, r: number): [number, number] => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  const ring = (f: number) => DOMAINS.map((_, i) => point(i, R * f).join(',')).join(' ');

  const dataPolygon = DOMAINS.map((d, i) => point(i, (R * Math.max(0, Math.min(100, scores[d]))) / 100).join(',')).join(' ');

  return (
    <Svg width={size} height={size}>
      {[0.25, 0.5, 0.75, 1].map((f, idx) => (
        <Polygon key={`ring-${idx}`} points={ring(f)} fill="none" stroke={colors.line} strokeWidth={1} />
      ))}
      {DOMAINS.map((d, i) => {
        const [x, y] = point(i, R);
        return <Line key={`axis-${d}`} x1={cx} y1={cy} x2={x} y2={y} stroke={colors.line} strokeWidth={1} />;
      })}
      <Polygon points={dataPolygon} fill={`${colors.accent}45`} stroke={colors.accent} strokeWidth={2.5} />
      {DOMAINS.map((d, i) => {
        const [px, py] = point(i, (R * Math.max(0, Math.min(100, scores[d]))) / 100);
        return <Circle key={`pt-${d}`} cx={px} cy={py} r={3.5} fill={colors.accent} />;
      })}
      {DOMAINS.map((d, i) => {
        const [lx, ly] = point(i, R + 16);
        return (
          <SvgText key={`lbl-${d}`} x={lx} y={ly} fill={colors.dim} fontSize={10} fontWeight="700" textAnchor="middle">
            {SHORT[d]}
          </SvgText>
        );
      })}
    </Svg>
  );
}
