import React from 'react';
import {Image, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

Ionicons.loadFont(); // <- Load font here

import {Text} from '../../components/text';
import {MainStackScreenProps} from '../../../typings/navigation';

import {AppImages} from '../../helpers';
import {useStyle} from './welcome.styles';
import {Bounceable} from '../../components/bounceable';

export const WelcomeScreen: React.FC<MainStackScreenProps<'WelcomeScreen'>> = ({
  navigation,
}) => {
  const {palette, colors, scale, styles} = useStyle();

  return (
    <LinearGradient
      end={{x: 0.5, y: 0.3}}
      start={{x: 0.5, y: 0}}
      style={styles.container}
      colors={[palette.dark_blue_100, palette.dark_blue_200]}>
      <Image
        style={styles.background}
        source={AppImages.images['auth-background']}
      />

      <View style={styles.contents}>
        <Bounceable
          style={styles.button}
          onPress={() => navigation.navigate('AuthScreen', {title: 'Sign Up'})}>
          <LinearGradient
            end={{x: 1.5, y: 1}}
            start={{x: 0, y: 0}}
            style={[styles.gradientButtonCover, styles.createAccount]}
            colors={[palette.blue_200, palette.blue_100]}>
            <View />
            <Text style={styles.text}>Create an account</Text>
            <Ionicons
              size={scale(24)}
              name="chevron-forward"
              color={colors.light.white}
            />
          </LinearGradient>
        </Bounceable>

        <Bounceable
          style={[styles.button, styles.haveAnAccount]}
          onPress={() => navigation.navigate('AuthScreen', {title: 'Sign In'})}>
          <LinearGradient
            end={{x: 2, y: 1}}
            start={{x: 0, y: 0}}
            style={styles.gradientButtonCover}
            colors={[palette.dark_blue_200, palette.dark_blue_100]}>
            <Text style={[styles.text, styles.haveAnAccountText]}>
              Already have an account?
            </Text>
          </LinearGradient>
        </Bounceable>
      </View>
    </LinearGradient>
  );
};
