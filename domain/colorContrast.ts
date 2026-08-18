type ParsedHslToken = {
  hue: number;
  saturation: number;
  lightness: number;
};

const BLACK_HSL = '0 0% 0%';
const WHITE_HSL = '0 0% 100%';

const parseHslToken = (value: string): ParsedHslToken | null => {
  const match = /^\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\s*$/.exec(value);
  if (!match) return null;
  const hue = Number(match[1]);
  const saturation = Number(match[2]);
  const lightness = Number(match[3]);
  if (![hue, saturation, lightness].every(Number.isFinite)) return null;
  return {
    hue: ((hue % 360) + 360) % 360,
    saturation: Math.min(100, Math.max(0, saturation)) / 100,
    lightness: Math.min(100, Math.max(0, lightness)) / 100,
  };
};

const hslToRgb = ({ hue, saturation, lightness }: ParsedHslToken): [number, number, number] => {
  if (saturation === 0) return [lightness, lightness, lightness];

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const [red, green, blue] =
    huePrime < 1 ? [chroma, x, 0] :
    huePrime < 2 ? [x, chroma, 0] :
    huePrime < 3 ? [0, chroma, x] :
    huePrime < 4 ? [0, x, chroma] :
    huePrime < 5 ? [x, 0, chroma] :
    [chroma, 0, x];
  const match = lightness - chroma / 2;
  return [red + match, green + match, blue + match];
};

const toLinearSrgb = (channel: number): number => (
  channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
);

export const getHslTokenRelativeLuminance = (value: string): number | null => {
  const parsed = parseHslToken(value);
  if (!parsed) return null;
  const [red, green, blue] = hslToRgb(parsed).map(toLinearSrgb);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const getContrastRatio = (foregroundLuminance: number, backgroundLuminance: number): number => {
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

export const resolveReadableForegroundForHsl = (
  backgroundHsl: string,
  fallback: string = WHITE_HSL,
): string => {
  const backgroundLuminance = getHslTokenRelativeLuminance(backgroundHsl);
  if (backgroundLuminance == null) return fallback;

  const blackContrast = getContrastRatio(0, backgroundLuminance);
  const whiteContrast = getContrastRatio(1, backgroundLuminance);
  return whiteContrast >= blackContrast ? WHITE_HSL : BLACK_HSL;
};

/**
 * Chrome surfaces (top tabs, settings text) must stay neutral and readable
 * even when the terminal theme replays a saturated foreground color
 * (e.g. an all-green terminal).
 */
export const neutralChromeForegroundToken = (value: string, isDark: boolean): string => {
  const parsed = parseHslToken(value);
  if (!parsed) return value;
  const min = isDark ? 85 : 10;
  const max = isDark ? 95 : 22;
  const lightness = Math.round(Math.min(max, Math.max(min, parsed.lightness * 100)) * 10) / 10;
  return `0 0% ${lightness}%`;
};

/**
 * Same policy as the foreground channel for accent-driven chrome surfaces
 * (sidebar icons, section headers, toggles): drop the terminal cursor hue so
 * a themed terminal does not repaint the whole app chrome.
 */
export const neutralChromeAccentToken = (value: string, isDark: boolean): string => {
  const parsed = parseHslToken(value);
  if (!parsed) return value;
  const min = isDark ? 78 : 20;
  const max = isDark ? 90 : 35;
  const lightness = Math.round(Math.min(max, Math.max(min, parsed.lightness * 100)) * 10) / 10;
  return `0 0% ${lightness}%`;
};
