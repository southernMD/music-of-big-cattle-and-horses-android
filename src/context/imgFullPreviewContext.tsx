import { X } from 'lucide-react-native';
import React, { createContext, useState, useContext } from 'react';
import {
    Modal,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {
    GestureDetector, Gesture,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

type FullScreenImageContextValue = {
    showFullScreenImage: (url: string) => void;
};

const FullScreenImageContext = createContext<FullScreenImageContextValue>({
    showFullScreenImage: () => { },
});

export const FullScreenImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // 动画值
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);

    const showFullScreenImage = (url: string) => {
        setImageUrl(url);
        setIsImageLoaded(false);
        setIsVisible(true);
        // 重置动画值
        scale.value = 1;
        translateX.value = 0;
        translateY.value = 0;
    };

    const closePreview = () => {
        setIsVisible(false);
    };

    const handleSaveImage = async () => {
        if (!imageUrl) return;
        // 这里添加保存图片的逻辑
    };

    // 拖动手势
    const panGesture = Gesture.Pan()
        .onBegin(() => {
            startX.value = translateX.value;
            startY.value = translateY.value;
        })
        .onUpdate((e) => {
            translateX.value = startX.value + e.translationX;
            translateY.value = startY.value + e.translationY;
        })
        .onEnd(() => {
            if (scale.value === 1) {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const savedScale = useSharedValue(1); 

    const pinchGesture = Gesture.Pinch()
      .onStart(() => {
        savedScale.value = scale.value; 
      })
      .onUpdate((e) => {
        scale.value = savedScale.value * e.scale;
        console.log('当前缩放:', scale.value);
      })
      .onEnd(() => {
        if (scale.value < 1) {
          scale.value = withTiming(1);
          translateX.value = withTiming(0);
          translateY.value = withTiming(0);
        }
      });
    const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value },
            ],
        };
    });

    const contextValue: FullScreenImageContextValue = {
        showFullScreenImage,
    };

    return (
        <FullScreenImageContext.Provider value={contextValue}>
            {children}
            <Modal visible={isVisible} transparent={true} onRequestClose={closePreview}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <View style={styles.fullScreenContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closePreview}
                            activeOpacity={0.7}
                        >
                            <X size={30} color="white" />
                        </TouchableOpacity>

                        <GestureDetector gesture={composedGesture}>
                            <Animated.Image
                                source={{ uri: imageUrl }}
                                style={[
                                    styles.fullScreenImage,
                                    animatedStyle,
                                    { opacity: isImageLoaded ? 1 : 0 },
                                ]}
                                onLoad={() => setIsImageLoaded(true)}
                                onLoadStart={() => setIsImageLoaded(false)}
                            />
                        </GestureDetector>

                        {!isImageLoaded && (
                            <ActivityIndicator
                                size="large"
                                color="#fff"
                                style={StyleSheet.absoluteFill}
                            />
                        )}

                        <View style={styles.bottomBar}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveImage}
                            >
                                <Text style={styles.saveButtonText}>保存图片</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </GestureHandlerRootView>
            </Modal>
        </FullScreenImageContext.Provider>
    );
};

export const useFullScreenImage = () => {
    return useContext(FullScreenImageContext);
};

// 样式
const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: width,
        height: height,
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        left: 20,
        zIndex: 10,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#1890ff',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 