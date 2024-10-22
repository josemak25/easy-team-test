import React from 'react';
import {TextProps, Text as BaseText} from 'react-native';

import {makeUseStyles} from '../../helpers';

const TextComponent: React.FC<TextProps> = ({children, style, ...props}) => {
  const {styles} = useStyles();

  return (
    <BaseText
      allowFontScaling
      minimumFontScale={0.05}
      maxFontSizeMultiplier={0.05}
      style={[styles.text, style]}
      {...props}>
      {children}
    </BaseText>
  );
};

const useStyles = makeUseStyles(({fonts, palette, scale}) => ({
  text: {
    color: palette.text,
    fontSize: scale(12),
    fontFamily: fonts.variants.montserratRegular,
  },
}));

export const Text = React.memo(TextComponent);
