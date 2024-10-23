import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {TextInput} from 'react-native-gesture-handler';

Ionicons.loadFont(); // <- Load font here

import {useStyle} from './auth.styles';
import {AppImages} from '../../helpers';
import {Text} from '../../components/text';
import {Bounceable} from '../../components/bounceable';
import {AuthUserInterface} from '../../../typings/user';
import {useSignInMutation, useSignUpMutation} from '../../hooks';
import {MainStackScreenProps} from '../../../typings/navigation';

const DEFAULT_FORM: AuthUserInterface = {password: '', email_address: ''};

export const AuthScreen: React.FC<MainStackScreenProps<'AuthScreen'>> = ({
  route,
  navigation,
}) => {
  const signInMutation = useSignInMutation();
  const signUpMutation = useSignUpMutation();
  const [form, setForm] = useState(DEFAULT_FORM);
  const {palette, colors, hexToRGB, scale, styles} = useStyle();

  const isSignUp = route.params?.title?.includes('Sign Up');
  const isLoading = signUpMutation.isPending || signInMutation.isPending;

  useEffect(() => {
    navigation.setOptions({title: route.params?.title});
  }, [navigation, route.params.title]);

  const onSubmit = async () => {
    const mutateAsync = isSignUp
      ? signUpMutation.mutateAsync
      : signInMutation.mutateAsync;

    await mutateAsync(form);

    if (isSignUp) {
      navigation.replace('AuthScreen', {title: 'Sign In'});
    }
  };

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

      <KeyboardAwareScrollView
        bounces={false}
        extraKeyboardSpace={-120}
        contentContainerStyle={styles.contents}>
        <View style={styles.form}>
          <LinearGradient
            end={{x: 1.5, y: 1}}
            start={{x: 0, y: 0}}
            style={[styles.button, styles.socialButton, styles.inputGradient]}
            colors={[
              hexToRGB(palette.dark_blue_100, 0.7),
              hexToRGB(palette.dark_blue_100, 0.7),
            ]}>
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              defaultValue={form.email_address}
              placeholderTextColor={hexToRGB(colors.light.white, 0.5)}
              onChangeText={email_address => setForm({...form, email_address})}
            />
          </LinearGradient>

          <LinearGradient
            end={{x: 1.5, y: 1}}
            start={{x: 0, y: 0}}
            style={[styles.button, styles.socialButton, styles.inputGradient]}
            colors={[
              hexToRGB(palette.dark_blue_100, 0.7),
              hexToRGB(palette.dark_blue_100, 0.7),
            ]}>
            <TextInput
              secureTextEntry
              placeholder="Password"
              style={styles.textInput}
              defaultValue={form.password}
              onChangeText={password => setForm({...form, password})}
              placeholderTextColor={hexToRGB(colors.light.white, 0.5)}
            />
          </LinearGradient>

          <Bounceable
            onPress={onSubmit}
            style={styles.button}
            disabled={!form.password || !form.email_address}>
            <LinearGradient
              end={{x: 1.5, y: 1}}
              start={{x: 0, y: 0}}
              style={styles.gradientButtonCover}
              colors={[palette.blue_200, palette.blue_100]}>
              {isLoading ? (
                <ActivityIndicator color={palette.white} />
              ) : (
                <Text style={styles.text}>{route.params?.title}</Text>
              )}
            </LinearGradient>
          </Bounceable>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={[styles.text, styles.dividerText]}>or</Text>
          <View style={styles.divider} />
        </View>

        <Bounceable style={[styles.button, styles.socialButton]}>
          <LinearGradient
            end={{x: 2, y: 1}}
            start={{x: 0, y: 0}}
            style={[styles.gradientButtonCover, styles.row]}
            colors={[palette.dark_blue_200, palette.dark_blue_100]}>
            <Image source={AppImages.images['google-icon']} />
            <Text style={[styles.text, styles.socialText]}>
              Continue with Google
            </Text>
            <Ionicons
              size={scale(24)}
              color={palette.grey}
              name="chevron-forward"
            />
          </LinearGradient>
        </Bounceable>

        <Bounceable style={[styles.button, styles.socialButton]}>
          <LinearGradient
            end={{x: 2, y: 1}}
            start={{x: 0, y: 0}}
            style={[styles.gradientButtonCover, styles.row]}
            colors={[palette.dark_blue_200, palette.dark_blue_100]}>
            <Ionicons
              size={scale(24)}
              name="logo-apple"
              color={colors.light.white}
            />
            <Text style={[styles.text, styles.socialText]}>
              Continue with Apple
            </Text>
            <Ionicons
              size={scale(24)}
              color={palette.grey}
              name="chevron-forward"
            />
          </LinearGradient>
        </Bounceable>

        <Text style={[styles.text, styles.haveAnAccount]}>
          Already have an account?
        </Text>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};
