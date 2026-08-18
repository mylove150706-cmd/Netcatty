import {
  HOST_INFO_BAR_HEIGHT_DEFAULT,
  HOST_INFO_BAR_HEIGHT_MAX,
  HOST_INFO_BAR_HEIGHT_MIN,
} from '../../domain/models/terminal';

/** Pixel metrics derived from the host info bar height setting. */
export interface TerminalTopbarMetrics {
  heightPx: number;
  textPx: number;
  statsPx: number;
  iconPx: number;
  iconSmPx: number;
  iconLgPx: number;
  buttonPx: number;
  terminalOffsetPx: number;
}

const BASE_HEIGHT = 28;

const scale = (base: number, height: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.round((base * height) / BASE_HEIGHT)));

/**
 * Derive every topbar element size from the configured bar height. Height 28
 * (the default) reproduces the pre-feature hardcoded sizes exactly; the input
 * is clamped into the setting's valid range first.
 */
export function terminalTopbarMetrics(height: number): TerminalTopbarMetrics {
  const raw = Number.isFinite(height) ? height : HOST_INFO_BAR_HEIGHT_DEFAULT;
  const h = Math.min(HOST_INFO_BAR_HEIGHT_MAX, Math.max(HOST_INFO_BAR_HEIGHT_MIN, Math.round(raw)));
  return {
    heightPx: h,
    textPx: scale(11, h, 9, 17),
    statsPx: scale(10, h, 8, 16),
    iconPx: scale(10, h, 8, 16),
    iconSmPx: scale(9, h, 8, 14),
    iconLgPx: scale(12, h, 9, 19),
    buttonPx: scale(24, h, 20, 36),
    terminalOffsetPx: h + 4,
  };
}
