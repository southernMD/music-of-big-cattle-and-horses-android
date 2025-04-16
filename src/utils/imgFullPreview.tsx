import React, { createContext, useState, useContext } from 'react';
import { Modal, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

/// 定义 Context 的值类型
type FullScreenImageContextValue = {
    showFullScreenImage: (url: string) => void;
};

// 创建 Context，使用类型推断
const FullScreenImageContext = createContext<FullScreenImageContextValue>({
    showFullScreenImage: () => { },
});


// 实现 Provider
export const FullScreenImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const showFullScreenImage = (url: string) => {
        setImageUrl(url);
        setIsVisible(true);
    };

    const closePreview = () => {
        setIsVisible(false);
    };
    // 将函数封装到对象中
    const contextValue: FullScreenImageContextValue = {
        showFullScreenImage,
    };
    return (
        <FullScreenImageContext.Provider value={contextValue}>
            {children}
            <Modal visible={isVisible} transparent={true} onRequestClose={closePreview}>
                <TouchableOpacity style={styles.fullScreenContainer} onPress={closePreview}>
                    <Image source={{ uri: imageUrl }} style={styles.fullScreenImage} />
                </TouchableOpacity>
            </Modal>
        </FullScreenImageContext.Provider>
    );
};

// 暴露函数式 API
export const useFullScreenImage = () => {
    return useContext(FullScreenImageContext);
};

// 样式
const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    fullScreenImage: {
        width: width,
        height: height,
        resizeMode: 'contain',
    },
});