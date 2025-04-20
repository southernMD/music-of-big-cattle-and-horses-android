import React from 'react';
import { ViewStyle, ImageStyle, TextStyle, StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/hook/commonTypes';
type BaseComponentProps = {
  style?: StyleProp<ViewStyle | ImageStyle | TextStyle>;
  [key: string]: any;
};

type AnimatedOrRegularProps = {
  isAnimated: boolean;
  component: React.ComponentType<any>;
  animatedStyle?: DefaultStyle;
} & BaseComponentProps;

export const AnimatedOrRegular: React.FC<AnimatedOrRegularProps> = ({
  isAnimated,
  component: Component,
  animatedStyle,
  ...props
}) => {
  const FinalComponent = isAnimated ? Animated.createAnimatedComponent(Component) : Component;
  return <FinalComponent {...props} style={[props.style, isAnimated ? animatedStyle : null]} />;
};
