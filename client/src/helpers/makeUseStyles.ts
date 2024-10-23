import {useCallback, useMemo, useState} from 'react';
import {
  Platform,
  StyleSheet,
  useColorScheme,
  PlatformIOSStatic,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ms, mvs} from 'react-native-size-matters';

import {hexToRGB} from './hexToRGB';
import {DARK_MODE_COLORS, FONTS, LIGHT_MODE_COLORS} from '../constants/theme';

type DefaultTheme = {
  isDarkMode: boolean;
  hexToRGB: typeof hexToRGB;
  scale: typeof mvs | typeof ms;
  fonts: {variants: typeof FONTS};
  insets: ReturnType<typeof useSafeAreaInsets>;
  theme: NonNullable<ReturnType<typeof useColorScheme>>;
  palette: typeof DARK_MODE_COLORS | typeof LIGHT_MODE_COLORS;
  toggleTheme: (mode?: NonNullable<ReturnType<typeof useColorScheme>>) => void;
  colors: {light: typeof LIGHT_MODE_COLORS; dark: typeof DARK_MODE_COLORS};
  layout: {
    radius: number;
    gutter: number;
    screen: ReturnType<typeof useWindowDimensions>;
  };
};

export function makeUseStyles<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(getStyles: (payload: DefaultTheme) => T): () => DefaultTheme & {styles: T} {
  return () => {
    const insets = useSafeAreaInsets();
    const dimension = useWindowDimensions();
    const [systemTheme, setSystemTheme] = useState(
      useColorScheme() as DefaultTheme['theme'],
    );

    const isDarkMode = systemTheme === 'dark';
    const isPad = (Platform as PlatformIOSStatic).isPad;

    const toggleTheme = useCallback(
      (mode?: DefaultTheme['theme']) => {
        const theme = mode || (isDarkMode ? 'light' : 'dark');
        return setSystemTheme(theme);
      },
      [isDarkMode],
    );

    const theme: DefaultTheme = useMemo(
      () => ({
        insets,
        hexToRGB,
        isDarkMode,
        toggleTheme,
        theme: systemTheme,
        scale: isPad ? mvs : ms,
        fonts: {variants: FONTS},
        layout: {radius: 10, gutter: 16, screen: dimension},
        palette: isDarkMode ? DARK_MODE_COLORS : LIGHT_MODE_COLORS,
        colors: {light: LIGHT_MODE_COLORS, dark: DARK_MODE_COLORS},
      }),
      [insets, isDarkMode, toggleTheme, systemTheme, isPad, dimension],
    );

    const styles = useMemo(
      () => StyleSheet.create(getStyles({...theme})),
      [theme],
    );

    return {...theme, styles};
  };
}
