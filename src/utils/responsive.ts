import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH_PORTRAIT = 375;
const BASE_HEIGHT_PORTRAIT = 667;
const BASE_WIDTH_LANDSCAPE = 667;
const BASE_HEIGHT_LANDSCAPE = 375;

const isPortrait = SCREEN_HEIGHT >= SCREEN_WIDTH;

const BASE_WIDTH = isPortrait ? BASE_WIDTH_PORTRAIT : BASE_WIDTH_LANDSCAPE;
const BASE_HEIGHT = isPortrait ? BASE_HEIGHT_PORTRAIT : BASE_HEIGHT_LANDSCAPE;

export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

export const verticalScale = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const scaleFont = (size: number) => {
  const newSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
