import {makeUseStyles} from '../../helpers';

export const useStyle = makeUseStyles(
  ({scale, palette, colors, hexToRGB, fonts, insets, layout}) => ({
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
      paddingBottom: scale(insets.bottom + layout.gutter / 2),
    },
    button: {
      overflow: 'hidden',
      height: scale(60, 0.25),
      borderRadius: scale(30),
    },
    socialButton: {
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
      fontFamily: fonts.variants.montserratRegular,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(layout.gutter / 2),
      justifyContent: 'space-between',
      marginVertical: scale(layout.gutter / 2),
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: palette.dark_blue_100,
    },
    dividerText: {
      fontSize: scale(16),
      color: palette.dark_blue_100,
    },
    socialText: {
      color: hexToRGB(colors.light.white, 0.7),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    haveAnAccount: {
      marginTop: scale(layout.gutter * 1.2),
      color: hexToRGB(colors.light.white, 0.5),
    },
    form: {
      gap: scale(layout.gutter * 1.5),
    },
    inputGradient: {
      backgroundColor: palette.transparent,
    },
    textInput: {
      flex: 1,
      fontSize: scale(16),
      color: palette.white,
      paddingHorizontal: scale(layout.gutter),
    },
  }),
);
