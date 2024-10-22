import {makeUseStyles} from '../../helpers';

export const useStyles = makeUseStyles(
  ({scale, fonts, palette, layout, hexToRGB}) => ({
    safeView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      maxWidth: scale(425),
      justifyContent: 'center',
      padding: scale(layout.gutter),
    },
    title: {
      fontWeight: '600',
      textAlign: 'center',
      color: palette.text,
      fontSize: scale(20),
      marginTop: scale(layout.gutter * 2),
      fontFamily: fonts.variants.montserratBold,
    },
    subtitle: {
      opacity: 0.7,
      fontWeight: '400',
      fontSize: scale(15),
      lineHeight: scale(18),
      paddingHorizontal: scale(10),
      marginTop: scale(layout.gutter),
      marginVertical: scale(layout.gutter),
      fontFamily: fonts.variants.montserratMedium,
    },
    button: {
      borderWidth: 1,
      height: scale(50),
      alignItems: 'center',
      minWidth: scale(300),
      justifyContent: 'center',
      marginVertical: scale(14),
      borderColor: hexToRGB(palette.text, 0.2),
      borderRadius: scale(layout.radius / 2),
    },
    text: {
      marginTop: 0,
      fontSize: scale(14),
      fontFamily: fonts.variants.montserratSemibold,
    },
  }),
);
