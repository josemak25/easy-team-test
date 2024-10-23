import {renderHook} from '@testing-library/react-hooks';

import {makeUseStyles} from '../makeUseStyles';
import {Providers} from '@app/providers';

describe('helper / makeUseStyles', () => {
  it('should return hook handler', () => {
    const useStyles = makeUseStyles(() => ({container: {flex: 1}}));
    expect(useStyles).toBeInstanceOf(Function);
  });

  it('should return styles object', async () => {
    const styles = {container: {flex: 1}};
    const useStyles = makeUseStyles(() => styles);

    const {result, waitForNextUpdate} = renderHook(useStyles, {
      wrapper: Providers,
    });

    await waitForNextUpdate();

    expect(result.current).toHaveProperty('theme');
    expect(result.current).toHaveProperty('fonts');
    expect(result.current).toHaveProperty('insets');
    expect(result.current).toHaveProperty('palette');
    expect(result.current).toHaveProperty('hexToRGB');
    expect(result.current).toHaveProperty('dimension');
    expect(result.current).toHaveProperty('isDarkMode');
    expect(result.current).toHaveProperty('toggleTheme');

    expect(result.current).toHaveProperty('layout');
    expect(result.current).toHaveProperty('layout.radius');
    expect(result.current).toHaveProperty('layout.gutter');
    expect(result.current).toHaveProperty('layout.screen');
    expect(result.current).toHaveProperty('fonts.variants');

    expect(result.current).toHaveProperty('colors');
    expect(result.current).toHaveProperty('colors.dark');
    expect(result.current).toHaveProperty('colors.light');

    expect(result.current).toHaveProperty('styles');
    expect(result.current.styles).toBe(styles);
  });
});
