import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, Dimensions, Animated, Easing, StyleSheet } from 'react-native';
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
  const translateX = useRef(new Animated.Value(0)).current;
  const TEXT_MARGIN = 60;
  const [containerWidth, setContainerWidth] = useState(0);
  const canvasRef = useRef<Canvas | null>(null);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // 只有当文本宽度大于容器宽度时才滚动
  const isCopy = useMemo(() => {
    return textWidth > containerWidth && containerWidth > 0;
  }, [textWidth, containerWidth]);

  // 使用原生Animated API创建动画
  useEffect(() => {
    // 清除之前的动画
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    // 如果文本不需要滚动，直接返回
    if (!isCopy) {
      translateX.setValue(0);
      return;
    }

    // 计算滚动一次需要的时间（毫秒）
    const duration = (textWidth / speed) * 1000;

    // 重置位置
    translateX.setValue(0);

    // 创建滚动序列
    const scrollSequence = Animated.sequence([
      // 先短暂停留（可选）
      Animated.timing(translateX, {
        toValue: 0,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
      // 然后滚动到末尾
      Animated.timing(translateX, {
        toValue: -(textWidth + TEXT_MARGIN),
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      })
    ]);
    
    // 创建无限循环动画
    animationRef.current = Animated.loop(scrollSequence);
    
    // 延迟100ms启动动画，避免与其他动画冲突
    setTimeout(() => {
      if (animationRef.current) {
        animationRef.current.start();
      }
    }, 100);

    // 组件卸载时清理动画
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [textWidth, speed, isCopy, containerWidth, text]);

  const handleCanvas = async (canvas: Canvas) => {
    if (!canvas) return;

    try {
      canvasRef.current = canvas;
      
      // 设置Canvas尺寸
      canvas.width = screenWidth;
      canvas.height = 30;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 设置字体样式
      ctx.font = `${fontWeight} ${fontSize}px Arial`;
      ctx.fillStyle = color;

      // 绘制文本
      ctx.fillText(text || '', 0, fontSize);

      // 获取文本的宽度
      const measuredWidth = ctx.measureText(text || '').width;
      
      // 更新状态
      if (measuredWidth > 0) {
        setTextWidth(measuredWidth);
      } else {
        // 如果测量失败，使用备用计算方法
        setTextWidth(text ? text.length * (fontSize * 0.6) : 0);
      }
    } catch (error) {
      console.error('Canvas error:', error);
      // 使用备用宽度
      setTextWidth(text ? text.length * (fontSize * 0.6) : 0);
    }
  };

  // 使用StyleSheet创建样式，提高性能
  const textStyles = useMemo(() => StyleSheet.create({
    primary: {
      color, 
      fontSize, 
      fontWeight, 
      paddingRight: isCopy ? TEXT_MARGIN : 0,
      textAlign: isCopy ? undefined : 'center' as const,
      width: isCopy ? textWidth + TEXT_MARGIN : undefined
    },
    copy: {
      color, 
      fontSize, 
      fontWeight, 
      width: textWidth + TEXT_MARGIN
    }
  }), [color, fontSize, fontWeight, isCopy, textWidth, TEXT_MARGIN]);

  return (
    <View 
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* @ts-ignore */}
      <Canvas ref={handleCanvas} style={{ width: 1, height: 1, opacity: 0, position: 'absolute' }} />
      
      <Animated.View
        style={[
          styles.row, 
          { transform: [{ translateX }] },
          { 
            justifyContent: isCopy ? undefined : 'center', 
            width: !isCopy ? containerWidth : undefined 
          },
        ]}
        shouldRasterizeIOS={true} // 启用iOS栅格化
        renderToHardwareTextureAndroid={true} // 启用Android硬件加速
      >
        <Text
          numberOfLines={1}
          style={textStyles.primary}
        >
          {text}
        </Text>
        {isCopy ? <Text style={textStyles.copy}>{text}</Text> : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: 'hidden',
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
});

export default memo(MarqueeScroll);