import {makeUseStyles} from '../../helpers';

export const useStyle = makeUseStyles(
  ({scale, palette, colors, hexToRGB, insets, layout}) => ({
    container: {
      flex: 1,
    },
    background: {
      position: 'absolute',
      transform: [{scale: 1.1}],
      top: scale(layout.gutter),
      right: scale(layout.gutter),
    },
    contents: {
      flex: 1,
      gap: scale(layout.gutter),
      justifyContent: 'flex-end',
      paddingHorizontal: scale(layout.gutter * 2),
      paddingBottom: scale(insets.bottom + layout.gutter * 3),
    },
    button: {
      overflow: 'hidden',
      height: scale(60, 0.25),
      borderRadius: scale(30),
    },
    createAccount: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    haveAnAccount: {
      borderWidth: 1,
      borderColor: hexToRGB(palette.blue_200, 0.4),
    },
    gradientButtonCover: {
      flex: 1,
      alignItems: 'center',
      borderRadius: scale(30),
      justifyContent: 'center',
    },
    text: {
      fontWeight: '600',
      textAlign: 'center',
      fontSize: scale(14),
      color: colors.light.white,
    },
    haveAnAccountText: {
      color: hexToRGB(colors.light.white, 0.7),
    },
  }),
);
