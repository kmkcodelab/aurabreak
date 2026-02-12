import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import { formatTime } from '../../utils/formatTime';

interface Props {
  remainingSeconds: number;
  totalSeconds: number;
  isBreak: boolean;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIZE = SCREEN_WIDTH * 0.65;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CircularTimer({
  remainingSeconds,
  totalSeconds,
  isBreak,
}: Props) {
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={COLORS.surfaceLight}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={isBreak ? COLORS.info : COLORS.accent}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
        {/* Glow dot at progress tip */}
        <Circle
          cx={SIZE / 2}
          cy={STROKE_WIDTH / 2}
          r={STROKE_WIDTH}
          fill={isBreak ? COLORS.info : COLORS.accent}
          opacity={0.6}
          transform={`rotate(${360 * progress - 90} ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>

      <View style={styles.textContainer}>
        <Text style={styles.time}>{formatTime(remainingSeconds)}</Text>
        <Text
          style={[
            styles.label,
            { color: isBreak ? COLORS.info : COLORS.accent },
          ]}
        >
          ⚡ {isBreak ? 'BREAK' : 'FOCUS'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
  },
  time: {
    color: COLORS.textPrimary,
    fontSize: 52,
    fontWeight: '200',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
});
