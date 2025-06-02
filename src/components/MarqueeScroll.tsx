import React, { LegacyRef, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import Canvas from 'react-native-canvas'
const { width: screenWidth } = Dimensions.get('window');

interface Props {
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: any;
  speed?: number; // px per second
}


function MarqueeScroll({
  text,
  color = '#fff',
  fontSize = 16,
  fontWeight = '600',
  speed = 30,
}: Props) {
  const [textWidth, setTextWidth] = useState(0);
  const translateX = useSharedValue(0);
  const TEXT_MARGIN = 60
  const [containerWidth, setContainerWidth] = useState(0);

  const isCopy = useMemo(() => {
    return textWidth > containerWidth;
  }, [textWidth, containerWidth]);

  useEffect(() => {
    console.log(textWidth > containerWidth, containerWidth, textWidth, "文本滚动宽度各是");
    console.log(isCopy, "不滚动");
    if (!isCopy) return; // ✅ 不滚动

    const duration = (textWidth / speed) * 1000;

    const animate = () => {
      translateX.value = 0;
      translateX.value = withTiming(-(textWidth + TEXT_MARGIN), {
        duration,
        easing: Easing.linear
      }, (finished) => {
        if (finished) {
          runOnJS(animate)(); // 循环
        }
      });
    };

    animate();
  }, [textWidth, speed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleCanvas = async (canvas: Canvas) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置字体样式
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;

    // 绘制文本
    ctx.fillText(text, 0, fontSize);

    // 获取文本的宽度
    const textWidth2 = (await ctx.measureText(text)).width
    console.log('文本宽度:', textWidth2);

    // 更新状态
    setTextWidth(textWidth2);
  };


  return (
    <View style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* @ts-ignore */}
      <Canvas ref={handleCanvas} style={{ width: screenWidth, height: 20, display: 'none' }}></Canvas>
      <Animated.View
        style={[styles.row, animatedStyle,
        { justifyContent: isCopy ? undefined : 'center', width: !isCopy ? containerWidth + TEXT_MARGIN : containerWidth },
        ]}>
        <Text
          numberOfLines={1}
          style={{ color, fontSize, fontWeight, paddingRight: TEXT_MARGIN, width: textWidth + TEXT_MARGIN }}
        >
          {text}
        </Text>
        {isCopy ? <Text style={[{ color, fontSize, fontWeight, width: textWidth + TEXT_MARGIN }]}>{text}</Text> : <></>}
      </Animated.View>
    </View>
  );
};

const styles = {
  container: {
    width: "100%" as const,
    overflow: 'hidden' as const,
    flexDirection: 'row' as const,
  },
  row: {
    flexDirection: 'row' as const,
  },
};

export default memo(MarqueeScroll)