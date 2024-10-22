import Haptics from 'react-native-haptic-feedback';
import React, {
  useMemo,
  ComponentClass,
  FunctionComponent,
  PropsWithChildren,
} from 'react';
import Animated, {AnimatedProps} from 'react-native-reanimated';
import {Pressable, PressableProps, TouchableOpacityProps} from 'react-native';

import {useBounceable} from '../../hooks';

type AnimatedComponentProps = {
  createAnimatedComponent?: ComponentClass<object> | FunctionComponent<object>;
};

type BounceableProps = Omit<
  AnimatedProps<PressableProps | TouchableOpacityProps>,
  'children'
> & {
  isBounceable?: boolean;
  isWithHaptics?: boolean;
  animationProps?: Parameters<typeof useBounceable>[0];
} & AnimatedComponentProps;

const BounceableComponent: React.FC<PropsWithChildren<BounceableProps>> = ({
  style,
  onPress,
  children,
  onPressIn,
  onPressOut,
  animationProps,
  isBounceable = true,
  isWithHaptics = true,
  createAnimatedComponent = Pressable,
  ...rest
}) => {
  const {
    animatedStyle,
    onPressIn: animatedOnPressIn,
    onPressOut: animatedOnPressOut,
  } = useBounceable(animationProps);

  const AnimatedComponent = useMemo(
    () => Animated.createAnimatedComponent(createAnimatedComponent),
    [createAnimatedComponent],
  );

  const handlePress: typeof onPress = e => {
    if (isWithHaptics) {
      Haptics.trigger('impactMedium');
    }
    //@ts-ignore
    onPress?.(e);
  };

  const handlePressIn: typeof onPressIn = e => {
    if (isBounceable) {
      animatedOnPressIn();
    }
    //@ts-ignore
    onPressIn?.(e);
  };

  const handlePressOut: typeof onPressOut = e => {
    if (isBounceable) {
      animatedOnPressOut();
    }
    //@ts-ignore
    onPressOut?.(e);
  };

  return (
    //@ts-ignore
    <AnimatedComponent
      {...rest}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style as any, animatedStyle]}>
      {children}
    </AnimatedComponent>
  );
};

export const Bounceable = React.memo(BounceableComponent);
